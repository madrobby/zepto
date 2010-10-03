require 'rake'

ZEPTO_ROOT     = File.expand_path(File.dirname(__FILE__))
ZEPTO_DIST_DIR = File.join(ZEPTO_ROOT, 'dist')

task :default => [:clean, :dist]

desc "Clean the distribution directory."
task :clean do 
  rm_rf ZEPTO_DIST_DIR
  mkdir ZEPTO_DIST_DIR
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
  minify File.join(ZEPTO_ROOT,'zepto.js'), File.join(ZEPTO_DIST_DIR,'zepto.min.js')
end