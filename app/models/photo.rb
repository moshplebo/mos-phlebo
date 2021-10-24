# == Schema Information
#
# Table name: photos
#
#  id                :integer          not null, primary key
#  photo_category_id :integer
#  position          :integer
#  metadata          :jsonb            not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class Photo < ApplicationRecord

  attr_accessor :media_file_id

  belongs_to :photo_category
  has_one :media_reference, as: :referrer, dependent: :destroy
  has_one :media_file, through: :media_reference

  before_validation :set_media_file

  def frontend
    data = {photo_categories: []}

    PhotoCategory.all.each do |pc|
      photos = []
      pc.photos.each do |ph|
        photos << {id: ph.id, img: ph.media_file.file.thumb.url, img_big: ph.media_file.file.big.url,
                   metadata: ph.metadata} if ph.media_file
      end

      data[:photo_categories] << {id: pc.id, name: pc.name, photos: photos}
    end

    data
  end

  def main_frontend
    data = {results: []}

    ph = PhotoCategory.find_by(name: 'До и после лечения')
    if ph
      ph.photos.each do |ph|
        data[:results] << {id: ph.id, img: ph.media_file.file.thumb.url, img_big: ph.media_file.file.big.url,
                           metadata: ph.metadata} if ph.media_file
      end
    end

    data
  end

  def admin_frontend
    data = {}

    data[:id] = id
    data[:img] = media_file.file.url if media_file
    data[:metadata] = metadata
    data[:photo_category] = photo_category.name if photo_category

    data[:header] = metadata['header']
    data[:text] = metadata['text']
    data[:alt] = metadata['alt']
    data[:preview_image] = media_file ? {id: media_file.id, src: media_file.file.thumb.url} : {}
    data[:control_url] = "/admin/photo_categories/#{photo_category.id}/photos/#{id}" if photo_category

    data
  end

  private

  def set_media_file
    if new_record? && media_file.blank? && media_file_id.blank?
      errors.add(:media_file, ' не может быть пустым')
      return
    end

    self.media_file = MediaFile.find(media_file_id) if media_file.blank? || media_file_id && media_file.id != media_file_id
  end
end
