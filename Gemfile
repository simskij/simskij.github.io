source "https://rubygems.org"

gem "jekyll", "~> 4.0.0"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-redirect-from"
  gem "jekyll-tidy"
end

install_if -> { RUBY_PLATFORM =~ %r!mingw|mswin|java! } do
  gem "tzinfo", "~> 1.2"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1.1", :install_if => Gem.win_platform?
gem 'jekyll-sitemap'
gem 'kramdown-math-katex'
gem "webrick", "~> 1.7"
