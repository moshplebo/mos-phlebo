# == Schema Information
#
# Table name: comments
#
#  id         :integer          not null, primary key
#  fio        :string
#  text       :text
#  date       :date
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Comment < ApplicationRecord
  default_scope -> { order(date: :desc) }

  validates :fio, presence: true
  validates :text, presence: true
  validates :date, presence: true

  attr_accessor :media_file_id

  has_one :media_reference, as: :referrer, dependent: :destroy
  has_one :media_file, through: :media_reference

  before_validation :set_media_file
  after_save :comments_root_page

  def frontend
    data = {comments: []}

    Comment.all.each do |cm|
      img = cm.media_file ? cm.media_file.file.big.url : ''
      data[:comments] << {id: cm.id, fio: cm.fio, text: cm.text, date: cm.date.strftime('%d.%m.%Y'), img: img}
    end

    data
  end

  def admin_frontend
    data = {
        id: id,
        fio: fio,
        text: text,
        date: Frontend.format_time(date),
        control_url: "/admin/comments/#{id}"
    }

    data[:preview_image] = media_file ? { id: media_file.id, src: media_file.file.big.url } : {}
    data
  end

  def main_frontend
    data = {comments: []}

    Comment.all.each do |cm|
      img = cm.media_file ? cm.media_file.file.big.url : ''
      data[:comments] << {id: cm.id, fio: cm.fio, text: cm.text, date: cm.date.strftime('%d.%m.%Y'), img: img}
    end

    data
  end

  private

  def set_media_file
    if media_file.blank? && media_file_id.blank?
      return
    end

    self.media_file = MediaFile.find(media_file_id) if media_file.blank? || media_file_id && media_file.id != media_file_id
  end

  def comments_root_page
    comments_root_page = Page.where(slug: 'comments', parent_id: Page.first.id).first_or_initialize

    return comments_root_page unless comments_root_page.new_record?

    comments_root_page.active = true
    comments_root_page.name = 'Отзывы'
    comments_root_page.title = 'Отзывы'
    comments_root_page.h1 = 'Отзывы'
    comments_root_page.kind = 'Comments'

    comments_root_page.save!
    comments_root_page
  end

end
