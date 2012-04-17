ZEPTO_VERSION = '1.0rc1'

DEFAULT_MODULES = %w[ polyfill zepto event detect fx ajax form ]

KILO = 1024   # how many bytes in a "kilobyte"

task :default => :dist

# module-aware file task
class BuildTask < Rake::FileTask
  def modules
    prerequisites.map {|f| File.basename(f, '.js') }
  end

  def remove_prerequisites to_remove
    @prerequisites -= to_remove
    return self
  end

  def modules_mismatch?
    File.open(name, 'r') {|f| f.gets } !~ /modules: ([\w,\s]+)/ or
      $1.split(/\W+/) != modules
  end

  def needed?() super or modules_mismatch? end
end

BuildTask.define_task 'dist/zepto.js' => DEFAULT_MODULES.map {|m| "src/#{m}.js" } do |task|
  mkdir_p 'dist', :verbose => false
  File.open(task.name, 'w') do |zepto|
    zepto.puts "/* Zepto %s - %s - zeptojs.com/license */" %
                [version_string, task.modules.join(' ')]

    task.prerequisites.each do |src|
      # bring in source files one by one, but without copyright info
      copyright = true
      File.open(src).each_line do |line|
        copyright = false if copyright and line !~ %r{^(/|\s*$)}
        zepto.puts line unless copyright
      end
    end
  end
end

file 'dist/zepto.min.js' => 'dist/zepto.js' do |task|
  begin require 'uglifier'
  rescue LoadError; fail "Uglifier not available: #{$!}"
  else
    File.open(task.name, 'w') do |min|
      min << Uglifier.new.compile(File.read(task.prerequisites.first))
    end
  end
end

file 'dist/zepto.min.gz' => 'dist/zepto.min.js' do |task|
  verbose false do
    tmp_file = task.name.sub('.gz', '')
    cp task.prerequisites.first, tmp_file
    sh 'gzip', '--best', tmp_file
  end
end

desc "Concatenate source files to build zepto.js"
task :concat, [:modules] do |task, args|
  modules = args[:modules].to_s.split(':')
  to_add, to_exclude = modules.partition {|m| m.sub!(/^(-)?(.+)/, 'src/\2.js'); !$1 }

  Rake::Task['dist/zepto.js'].
    remove_prerequisites(to_exclude).enhance(to_add).
    invoke
end

desc "Generate zepto.js distribution files and report size statistics"
task :dist => ['dist/zepto.js', 'dist/zepto.min.js', 'dist/zepto.min.gz'] do |task|
  orig_size, min_size, gz_size = task.prerequisites.map {|f| File.size(f) }

  puts "Original version: %.3fk" % (orig_size.to_f / KILO)
  puts "Minified: %.3fk" % (min_size.to_f / KILO)
  puts "Minified and gzipped: %.3fk, compression factor %.3f" % [gz_size.to_f / KILO, orig_size.to_f / gz_size]

  rm_f 'dist/zepto.min.gz', :verbose => false
end

desc "List available modules"
task :modules do
  Dir['src/**/*.js'].each do |file|
    name = file.gsub(/^src\//,'').gsub(/.js$/,'')
    puts name + (DEFAULT_MODULES.include?(name) ? '*' : '')
  end
  puts "\n*included in default build"
end

task(:clean) { rm_rf 'dist' }

desc "Run tests with PhantomJS"
task :test do
  sh 'script/test'
  Rake::Task[:check_whitespace].invoke
end

desc "Strip trailing whitespace and ensure each file ends with a newline"
task :whitespace do
  verbose false do
    files = Dir['{src,test,examples}/**/*.{js,html}']
    ruby(*%w'-p -i -e $_.sub!(/\s*\Z/,"\n")'.concat(files))
  end
end

desc "Checks for trailing whitespace in source files and tests"
task :check_whitespace do
  flunked = false
  flunk = lambda {|file, num| flunked = true; puts "#{file}:#{num}" }
  Dir['{src,test,examples}/**/*.{js,html}'].each do |file|
    File.open(file, 'r') {|f| f.each_with_index {|ln, num| flunk.call(file, num + 1) if ln.chomp =~ /\s+$/ } }
  end
  fail if flunked
end

desc "Generate docco documentation from source files"
task :docco do
  verbose false do
    sh 'docco', *Dir['src/*.js']
  end
end

# Zepto version number + git sha if available
def version_string
  desc = `git describe --tags HEAD 2>&1`.chomp
  if $?.success?
    desc
  else
    suffix, dir = '', File.basename(Dir.pwd)
    # detect git sha from directory name of GitHub zip/tarball
    suffix = "-g#{$1}" if dir =~ /^madrobby-zepto-([a-f0-9]{7,40})$/
    ZEPTO_VERSION + suffix
  end
end
