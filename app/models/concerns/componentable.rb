module Componentable
  extend ActiveSupport::Concern

  included do
    has_many :components, as: :componentable, dependent: :destroy
  end

  def components_frontend
    {
        allowed_kinds: Component::ALLOWED_KINDS,
        components: components.map(&:admin_frontend)
    }
  end
end
