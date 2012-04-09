require 'guard/guard'

class ::Guard::PhantomJS < ::Guard::Guard
  def run_all
    run_on_change([])
  end

  def run_on_change(paths)
    passed = system @options[:runner], *paths

    ::Guard::Notifier.notify \
      (passed ? 'passed' : 'failed'),
      :title => 'Zepto test results',
      :image => (passed ? :success : :failed)
  end
end

guard :phantomjs, :runner => 'script/test' do
  watch(%r{src/(.+)\.js$}) do |m|
    "test/#{m[1]}.html"
  end
  watch(%r{test/(.+)\.html$}) do |m|
    m[0] unless m[1].include? '_functional'
  end
end
