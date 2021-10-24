# == Schema Information
#
# Table name: static_pages
#
#  id               :integer          not null, primary key
#  slug             :string
#  name             :string
#  content          :string
#  parent_id        :integer
#  lft              :integer          not null
#  rgt              :integer          not null
#  depth            :integer          default(0), not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  active           :boolean          default(TRUE)
#  title            :string
#  meta_description :string
#  meta_keywords    :string
#

class StaticPage < ApplicationRecord
  acts_as_nested_set
  include Slugable
  include Componentable

  has_one :page, as: :main_object, dependent: :destroy

  after_save :set_page

  def frontend
    data = {}
    data[:id] = id
    data[:name] = name
    data[:url] = page.material_path unless new_record?
    data[:components] = components.map(&:frontend)
    data
  end

  def admin_frontend
    data = {}

    data[:id] = id
    data[:name] = name
    data[:depth] = depth
    data[:control_url] = "/admin/static_pages/#{id}"
    data[:new_record] = new_record?
    data[:href] = page.material_path if page
    data[:component_url] = '/admin/components'
    data.deep_merge!(components_frontend)
    data[:active] = active
    data[:parents] = allowed_parents
    data[:parent_id] = parent_id || '0'
    data[:title] = title.blank? ? name : title
    data[:slug] = slug.blank? ? name : slug
    data[:meta_description] = meta_description || ''
    data[:meta_keywords] = meta_keywords || ''
    data[:childs] = children.map(&:admin_frontend)

    data
  end

  private

  def set_page
    page = Page.where(main_object_type: 'StaticPage', main_object_id: id).first_or_initialize
    page.slug = slug
    page.parent_id = parent ? parent.page.id : Page.first.id
    page.name = name
    page.title = title.blank? ? name : title
    page.meta_description = meta_description || ''
    page.meta_keywords = meta_keywords || ''
    page.h1 = name
    page.kind = 'Page'
    page.active = active

    page.save! if page.changed?
  end


  def allowed_parents
    parents = {}
    parents['0'] = 'Главная'

    StaticPage.where(depth: 0).where.not(id: id).each { |c| parents[c.id] = c.name }

    parents
  end

end
