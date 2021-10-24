# == Schema Information
#
# Table name: articles
#
#  id               :integer          not null, primary key
#  name             :string
#  slug             :string
#  metadata         :jsonb            not null
#  published_at     :datetime
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  title            :string
#  meta_description :string
#  meta_keywords    :string
#

class Article < ApplicationRecord
  default_scope -> { where('published_at < ?', Time.now).order(published_at: :desc) }

  include Slugable
  include Componentable

  attr_accessor :media_file_id

  validates :name, presence: true
  validates :published_at, presence: true

  has_one :page, as: :main_object, dependent: :destroy
  has_one :media_reference, as: :referrer, dependent: :destroy
  has_one :media_file, through: :media_reference

  before_validation :set_media_file
  after_save :set_page

  def self.all_in
    [:page, :media_file, :components]
  end

  def active?
    Time.now > published_at
  end

  def frontend
    prev_page = ''
    unless Article.first.published_at == published_at
      prev_page = Article.where('published_at > ?', published_at).last.page.material_path
    end
    next_page = ''
    unless Article.last.published_at == published_at
      next_page = Article.where('published_at < ?', published_at).first.page.material_path
    end
    data =
    {
        id: id,
        name: name,
        date: published_at.strftime('%d.%m.%Y'),
        components: components.map(&:frontend),
        prev: prev_page,
        next: next_page
    }

    data[:articles_popular] = Article.all.shuffle.first(3).map do |art|
      descr = ''
      art.components.where(kind: 0).pluck(:metadata).map { |c| descr += "#{c['content']}. " }
      descr = ActionView::Base.full_sanitizer.sanitize(descr)
      {
          name: art.name,
          descr: descr,
          href: art.page.material_path
      }
    end

    data
  end

  def collection_frontend
    descr = ''
    components.where(kind: 0).pluck(:metadata).map { |c| descr += "#{c['content']}. " }
    descr = ActionView::Base.full_sanitizer.sanitize(descr)

    {
        id: id,
        name: name,
        href: page.material_path,
        short_description: descr.gsub("\r\n", ". "),
        preview_image: media_file.file.thumb.url,
        date: published_at.strftime('%d.%m.%Y'),
        datetime: published_at.strftime('%d%m%Y%H%M')
    }
  end

  def admin_frontend
    data = {}
    data[:id] = id
    data[:name] = name
    data[:published_at] = Frontend.format_time(published_at)
    data[:control_url] = "/admin/articles/#{id}"
    data[:title] = title.blank? ? name : title
    data[:slug] = slug.blank? ? name : slug
    data[:meta_description] = meta_description || ''
    data[:meta_keywords] = meta_keywords || ''
    data[:preview_image] = media_file ? {id: media_file.id, src: media_file.file.thumb.url} : {}

    data[:href] = page.material_path unless new_record?
    data[:component_url] = '/admin/components'
    data.deep_merge!(components_frontend)

    data
  end

  def preview_image
    media_file.file.url if media_file
  end

  private

  def set_media_file
    if new_record? && media_file.blank? && media_file_id.blank?
      errors.add(:media_file, ' не может быть пустым')
      return
    end

    self.media_file = MediaFile.find(media_file_id) if media_file.blank? || media_file_id && media_file.id != media_file_id
  end

  def set_page
    page = Page.where(main_object_type: 'Article', main_object_id: id).first_or_initialize
    page.slug = slug
    page.parent_id = news_root_page.id
    page.name = name
    page.title = title.blank? ? name : title
    page.meta_description = meta_description || ''
    page.meta_keywords = meta_keywords || ''
    page.h1 = name
    page.kind = 'Article'
    page.active = true

    page.save! if page.changed?
  end

  def news_root_page
    news_root = Page.where(slug: 'articles', parent_id: Page.first.id).first_or_initialize

    return news_root unless news_root.new_record?

    news_root.active = true
    news_root.name = 'Статьи о варикозе'
    news_root.title = 'Статьи о варикозе'
    news_root.h1 = 'Статьи о варикозе'
    news_root.kind = 'Collection'
    news_root.save!

    unless Collection.find_by(collectionable_type: 'Article')
      Collection.create!(slug: 'articles', page: news_root, collectionable_type: 'Article', name: 'Статьи о варикозе')
    end

    news_root
  end

end
