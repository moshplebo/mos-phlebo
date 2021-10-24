# == Schema Information
#
# Table name: healings
#
#  id               :integer          not null, primary key
#  name             :string
#  slug             :string
#  metadata         :jsonb            not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  title            :string
#  meta_description :string
#  meta_keywords    :string
#

class Healing < ApplicationRecord

  include Slugable
  include Componentable

  validates :name, presence: true

  has_one :page, as: :main_object, dependent: :destroy

  after_save :set_page

  def self.all_in
    [:page, :components]
  end

  def frontend
    data = {}

    data[:id] = id
    data[:name] = name
    data[:components] = components.map(&:frontend)
    data[:other] = Healing.where.not(id: id).all.map { |heal| {id: heal.id, name: heal.name,
                                                               href: heal.page.material_path} }

    data
  end

  def collection_frontend
    {
        id: id,
        name: name,
        href: page.material_path
    }
  end

  def admin_frontend
    data = {}
    data[:id] = id
    data[:name] = name
    data[:control_url] = "/admin/healings/#{id}"
    data[:title] = title.blank? ? name : title
    data[:slug] = slug.blank? ? name : slug
    data[:meta_description] = meta_description || ''
    data[:meta_keywords] = meta_keywords || ''
    data[:href] = page.material_path if !new_record? && page
    data[:component_url] = '/admin/components'
    data.deep_merge!(components_frontend)
    data
  end

  private

  def set_page
    page = Page.where(main_object_type: 'Healing', main_object_id: id).first_or_initialize
    page.slug = slug
    page.parent_id = healings_root_page.id
    page.name = name
    page.title = title.blank? ? name : title
    page.meta_description = meta_description || ''
    page.meta_keywords = meta_keywords || ''
    page.h1 = name
    page.kind = 'Healing'
    page.active = true

    page.save! if page.changed?
  end

  def healings_root_page
    healings_root = Page.where(slug: 'healings', parent_id: Page.first.id).first_or_initialize

    return healings_root unless healings_root.new_record?

    healings_root.active = true
    healings_root.name = 'Методы лечения'
    healings_root.title = 'Методы лечения'
    healings_root.h1 = 'Методы лечения'
    healings_root.kind = 'Collection'
    healings_root.save!

    unless Collection.find_by(collectionable_type: 'Healing')
      Collection.create!(slug: 'healings', page: healings_root, collectionable_type: 'Healing', name: 'Методы лечения')
    end

    healings_root
  end

end
