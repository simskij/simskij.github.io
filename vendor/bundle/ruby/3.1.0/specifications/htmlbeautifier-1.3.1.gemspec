# -*- encoding: utf-8 -*-
# stub: htmlbeautifier 1.3.1 ruby lib

Gem::Specification.new do |s|
  s.name = "htmlbeautifier".freeze
  s.version = "1.3.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Paul Battley".freeze]
  s.date = "2017-05-04"
  s.description = "A normaliser/beautifier for HTML that also understands embedded Ruby.".freeze
  s.email = "pbattley@gmail.com".freeze
  s.executables = ["htmlbeautifier".freeze]
  s.files = ["bin/htmlbeautifier".freeze]
  s.homepage = "http://github.com/threedaymonk/htmlbeautifier".freeze
  s.licenses = ["MIT".freeze]
  s.required_ruby_version = Gem::Requirement.new(">= 1.9.2".freeze)
  s.rubygems_version = "3.4.16".freeze
  s.summary = "HTML/ERB beautifier".freeze

  s.installed_by_version = "3.4.16" if s.respond_to? :installed_by_version

  s.specification_version = 4

  s.add_development_dependency(%q<rake>.freeze, ["~> 0"])
  s.add_development_dependency(%q<rspec>.freeze, ["~> 3"])
  s.add_development_dependency(%q<rubocop>.freeze, ["~> 0.30.0"])
end
