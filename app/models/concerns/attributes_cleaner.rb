module AttributesCleaner
  extend ActiveSupport::Concern

  included do
    before_validation :clean_attributes

    def clean_attributes
      return if name.blank?
      self.name = name.squish
    end
  end
end
