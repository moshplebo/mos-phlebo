# == Schema Information
#
# Table name: photo_categories
#
#  id         :integer          not null, primary key
#  position   :integer
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class PhotoCategory < ApplicationRecord
  default_scope { order('position') }

  has_many :photos, dependent: :destroy

  validates :name, presence: true, length: {maximum: 200}

  after_create :generate_page

  def admin_frontend
    data = {}

    data[:id] = id
    data[:name] = name

    data[:control_url] = "/admin/photo_categories/#{id}"

    data
  end

  def prev_category
    PhotoCategory.where('position<?', position).last
  end

  def next_category
    PhotoCategory.where('position>?', position).first
  end

  private

  def generate_page
    unless Page.find_by(slug: 'fotogalereya')
      Page.create(active: true,
                  slug: 'fotogalereya',
                  name: 'Фотогалерея',
                  title: 'Фотогалерея',
                  h1: 'Фотогалерея',
                  kind: 'PhotosPage',
                  parent_id: Page.first.id)
    end
  end
end
