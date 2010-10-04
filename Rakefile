require 'rake'

ZEPTO_ROOT     = File.expand_path(File.dirname(__FILE__))
ZEPTO_SRC_DIR  = File.join(ZEPTO_ROOT, 'src')
ZEPTO_DIST_DIR = File.join(ZEPTO_ROOT, 'dist')

ZEPTO_FILES    = [
  File.join(ZEPTO_SRC_DIR,'zepto.js'),
  File.join(ZEPTO_SRC_DIR,'fx.js'),
  File.join(ZEPTO_SRC_DIR,'touch.js'),
  File.join(ZEPTO_SRC_DIR,'ajax.js')
]

task :default => [:clean, :concat, :dist]

desc "Clean the distribution directory."
task :clean do 
  rm_rf ZEPTO_DIST_DIR
  mkdir ZEPTO_DIST_DIR
end

desc "Concatenate Zepto core and plugins to build a distributable zepto.js file"
task :concat do
  File.open(File.join(ZEPTO_DIST_DIR,'zepto.js'),"w") do |f|
    f.puts ZEPTO_FILES.map{ |s| IO.read(s) } 
  end
end

def minify(src, target)
  puts "Minifying #{src}..."
  `java -jar vendor/google-compiler/compiler.jar --js #{src} --summary_detail_level 3 --js_output_file #{target}`
  cp target, File.join(ZEPTO_DIST_DIR,'temp.js')
  msize = File.size(File.join(ZEPTO_DIST_DIR,'temp.js'))
  `gzip -9 #{File.join(ZEPTO_DIST_DIR,'temp.js')}`
  
  osize = File.size(src)
  dsize = File.size(File.join(ZEPTO_DIST_DIR,'temp.js.gz'))
  rm_rf File.join(ZEPTO_DIST_DIR,'temp.js.gz')
  
  puts "Original version: %.1fk" % (osize/1024.0)
  puts "Minified: %.1fk" % (msize/1024.0)
  puts "Minified and gzipped: %.1fk, compression factor %.1f" % [dsize/1024.0, osize/dsize.to_f]  
end

desc "Generates a minified version for distribution."
task :dist do
  minify File.join(ZEPTO_DIST_DIR,'zepto.js'), File.join(ZEPTO_DIST_DIR,'zepto.min.js')
end