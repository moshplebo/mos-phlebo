# == Schema Information
#
# Table name: banners
#
#  id         :integer          not null, primary key
#  header     :text
#  text       :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Banner < ApplicationRecord

  attr_accessor :media_file_id

  has_one :media_reference, as: :referrer, dependent: :destroy
  has_one :media_file, through: :media_reference

  validates :media_file, presence: true

  before_validation :set_media_file

  def set_media_file
    self.media_file = MediaFile.find(media_file_id) if media_file.blank? || media_file_id && media_file.id != media_file_id
  end

  def frontend
    {
        id: id,
        img: image,
        header: header,
        text: text
    }
  end

  def admin_frontend
    data = {}

    data[:id] = id
    data[:header] = header
    data[:text] = text
    data[:control_url] = "/admin/banners/#{id}"
    data[:img] = image
    data[:preview_image] = media_file ? {id: media_file.id, src: media_file.file.banner.url} : {}

    data
  end

  def image
    media_file.file.banner.url if media_file
  end
end
