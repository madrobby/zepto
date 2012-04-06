require 'rake/packagetask'

ZEPTO_VERSION  = "0.8"

ZEPTO_ROOT     = File.expand_path(File.dirname(__FILE__))
ZEPTO_SRC_DIR  = File.join(ZEPTO_ROOT, 'src')
ZEPTO_DIST_DIR = File.join(ZEPTO_ROOT, 'dist')
ZEPTO_PKG_DIR  = File.join(ZEPTO_ROOT, 'pkg')

ZEPTO_COMPONENTS = [
  'polyfill',
  'zepto',
  'event',
  'detect',
  'fx',
  # 'fx_methods',
  'ajax',
  'form',
  # 'assets',
  # 'data',
  'touch',
  # 'gesture',
  # 'stack',
]

task :default => [:clean, :concat, :dist]

ZEPTO_TESTS = %w[
  test/zepto.html
  test/ajax.html
  test/data.html
  test/detect.html
  test/form.html
  test/fx.html
  test/polyfill.html
  test/stack.html
]

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

desc "Concatenate source files to build zepto.js"
task :concat, [:addons] => :whitespace do |task, args|
  # colon-separated arguments such as `concat[foo:bar:-baz]` specify
  # which components to add or exclude, depending on if it starts with "-"
  add, exclude = args[:addons].to_s.split(':').partition {|c| c !~ /^-/ }
  exclude.each {|c| c.sub!('-', '') }
  components = (ZEPTO_COMPONENTS | add) - exclude

  unless components == ZEPTO_COMPONENTS
    puts "Building zepto.js by including: #{components.join(', ')}"
  end

  File.open(File.join(ZEPTO_DIST_DIR, 'zepto.js'), 'w') do |f|
    f.puts components.map { |component|
      File.read File.join(ZEPTO_SRC_DIR, "#{component}.js")
    }
  end
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

desc "Generate docco documentation from sources."
task :docco do
  puts "Generating docs..."
  puts "Note: to work, install node.js first, then install docco with 'sudo npm install docco -g'."
  puts `docco src/*`
end

Rake::PackageTask.new('zepto', ZEPTO_VERSION) do |package|
  package.need_tar_gz = true
  package.need_zip = true
  package.package_dir = ZEPTO_PKG_DIR
  package.package_files.include(
    'README.md',
    'MIT-LICENSE',
    'dist/**/*',
    'src/**/*',
    'test/**/*',
    'vendor/evidence.js',
    'examples/**/*'
  ).exclude(*`git ls-files -o test src examples -z`.split("\0"))
end
