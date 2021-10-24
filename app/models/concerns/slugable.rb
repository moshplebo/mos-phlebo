# coding: utf-8
module Slugable
  extend ActiveSupport::Concern

  included do
    before_validation :transliterate_slug

    def transliterate_slug
      self.slug = name if slug.blank?

      self.slug = Slugable.transliterate(slug)
    end
  end
  def self.transliterate(string)
    return '' if string.blank?
    Russian.transliterate(string).squish.gsub(/( |\)|\(|\-)/, '_').downcase.gsub(/[^0-9a-z_]/, '')
  end
end
