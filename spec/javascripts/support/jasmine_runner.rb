$:.unshift(ENV['JASMINE_GEM_PATH']) if ENV['JASMINE_GEM_PATH'] # for gem testing purposes

require 'rubygems'
require 'jasmine'
jasmine_config_overrides = File.expand_path(File.join(File.dirname(__FILE__), 'jasmine_config.rb'))
require jasmine_config_overrides if File.exist?(jasmine_config_overrides)
if Jasmine::rspec2?
  require 'rspec'
else
  require 'spec'
end

jasmine_config = Jasmine::Config.new
spec_builder = Jasmine::SpecBuilder.new(jasmine_config)

should_stop = false

if Jasmine::rspec2?
  RSpec.configuration.after(:suite) do
    spec_builder.stop if should_stop
  end
else
  Spec::Runner.configure do |config|
    config.after(:suite) do
      spec_builder.stop if should_stop
    end
  end
end

spec_builder.start
should_stop = true
spec_builder.declare_suites