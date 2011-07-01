require 'rake'
require 'rake/packagetask'

ZEPTO_VERSION  = "0.6"

ZEPTO_ROOT     = File.expand_path(File.dirname(__FILE__))
ZEPTO_SRC_DIR  = File.join(ZEPTO_ROOT, 'src')
ZEPTO_DIST_DIR = File.join(ZEPTO_ROOT, 'dist')
ZEPTO_PKG_DIR  = File.join(ZEPTO_ROOT, 'pkg')

ZEPTO_FILES    = [
  File.join(ZEPTO_SRC_DIR,'polyfill.js'),
  File.join(ZEPTO_SRC_DIR,'zepto.js'),
  File.join(ZEPTO_SRC_DIR,'event.js'),
  File.join(ZEPTO_SRC_DIR,'detect.js'),
  File.join(ZEPTO_SRC_DIR,'fx.js'),
  File.join(ZEPTO_SRC_DIR,'ajax.js'),
  # File.join(ZEPTO_SRC_DIR,'assets.js'),
  File.join(ZEPTO_SRC_DIR,'touch.js')
  # File.join(ZEPTO_SRC_DIR,'gesture.js')
]

task :default => [:clean, :concat, :dist]

desc "Clean the distribution directory."
task :clean do
  rm_rf ZEPTO_DIST_DIR
  mkdir ZEPTO_DIST_DIR
end

def normalize_whitespace(filename)
  contents = File.readlines(filename)
  contents.each { |line| line.sub!(/\s+$/, "") }
  File.open(filename, "w") do |file|
    file.write contents.join("\n").sub(/(\n+)?\Z/m, "\n")
  end
end

desc "Strip trailing whitespace and ensure each file ends with a newline"
task :whitespace do
  Dir["*", "src/**/*", "test/**/*", "examples/**/*"].each do |filename|
    normalize_whitespace(filename) if File.file?(filename)
  end
end

desc "Concatenate Zepto core and plugins to build a distributable zepto.js file"
task :concat => :whitespace do
  File.open(File.join(ZEPTO_DIST_DIR,'zepto.js'),"w") do |f|
    f.puts ZEPTO_FILES.map{ |s| IO.read(s) }
  end
end

def google_compiler(src, target)
  puts "Minifying #{src} with Google Closure Compiler..."
  `java -jar vendor/google-compiler/compiler.jar --js #{src} --summary_detail_level 3 --js_output_file #{target}`
end

def yui_compressor(src, target)
  puts "Minifying #{src} with YUI Compressor..."
  `java -jar vendor/yuicompressor/yuicompressor-2.4.2.jar #{src} -o #{target}`
end

def uglifyjs(src, target)
  begin
    require 'uglifier'
  rescue LoadError => e
    if verbose
      puts "\nYou'll need the 'uglifier' gem for minification. Just run:\n\n"
      puts "  $ gem install uglifier"
      puts "\nand you should be all set.\n\n"
      exit
    end
    return false
  end
  puts "Minifying #{src} with UglifyJS..."
  File.open(target, "w"){|f| f.puts Uglifier.new.compile(File.read(src))}
end

def process_minified(src, target)
  cp target, File.join(ZEPTO_DIST_DIR,'temp.js')
  msize = File.size(File.join(ZEPTO_DIST_DIR,'temp.js'))
  `gzip -9 #{File.join(ZEPTO_DIST_DIR,'temp.js')}`

  osize = File.size(src)
  dsize = File.size(File.join(ZEPTO_DIST_DIR,'temp.js.gz'))
  rm_rf File.join(ZEPTO_DIST_DIR,'temp.js.gz')

  puts "Original version: %.3fk" % (osize/1024.0)
  puts "Minified: %.3fk" % (msize/1024.0)
  puts "Minified and gzipped: %.3fk, compression factor %.3f" % [dsize/1024.0, osize/dsize.to_f]
end

desc "Generates a minified version for distribution, using UglifyJS."
task :dist do
  src, target = File.join(ZEPTO_DIST_DIR,'zepto.js'), File.join(ZEPTO_DIST_DIR,'zepto.min.js')
  uglifyjs src, target
  process_minified src, target
end

desc "Generates a minified version for distribution using the Google Closure compiler."
task :googledist do
  src, target = File.join(ZEPTO_DIST_DIR,'zepto.js'), File.join(ZEPTO_DIST_DIR,'zepto.min.js')
  google_compiler src, target
  process_minified src, target
end

desc "Generates a minified version for distribution using the YUI compressor."
task :yuidist do
  src, target = File.join(ZEPTO_DIST_DIR,'zepto.js'), File.join(ZEPTO_DIST_DIR,'zepto.min.js')
  yui_compressor src, target
  process_minified src, target
end

desc "Genetated documentation from sources"
task :docs do
  puts "Generating docs..."
  puts `docco src/*`
end

Rake::PackageTask.new('zepto', ZEPTO_VERSION) do |package|
  package.need_tar_gz = true
  package.need_zip = true
  package.package_dir = ZEPTO_PKG_DIR
  package.package_files.include(
    'README.rdoc',
    'MIT-LICENSE',
    'dist/**/*',
    'src/**/*',
    'test/**/*',
    'examples/**/*'
  )
end
