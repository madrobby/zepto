guard 'jekyll' do
  ignores   = %r{^(?:\.|Guardfile|script/|public/)}
  includes  = %r{^_includes/}
  posts     = %r{(?:^|/)_posts/}
  home_page = 'index.html'

  watch(%r{.+}) do |match|
    case file = match[0]
    when ignores  then nil
    when includes then home_page
    when posts    then [file, home_page]
    else file
    end
  end
end

# gem 'sass' if defined? Gem
# guard 'sass', :style => :compressed, :input => 'stylesheets', :all_on_start => true

guard 'livereload', :apply_js_live => false, :grace_period => 0 do
  ext = %w[js css png gif html md markdown xml]

  watch(%r{^public(/[^/]+\.(?:#{ext.join('|')}))$}) do |match|
    match[1].sub(/\/index\.html$/, '/')
  end
end
