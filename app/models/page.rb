# == Schema Information
#
# Table name: pages
#
#  id               :integer          not null, primary key
#  active           :boolean          default(FALSE), not null
#  parent_id        :integer
#  lft              :integer          not null
#  rgt              :integer          not null
#  depth            :integer          default(0), not null
#  name             :string
#  slug             :string
#  material_path    :string
#  title            :string
#  h1               :string
#  meta_description :string
#  meta_keywords    :string
#  meta_robots      :string
#  kind             :string
#  metadata         :jsonb            not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  main_object_id   :integer
#  main_object_type :string
#

class Page < ApplicationRecord
  default_scope -> {where(active: true).order('lft ASC')}

  include Slugable

  VIEWS_BY_KIND = {
      'MainPage' => ['MainPageView'],
      'Page' => ['PageView'],
      'PhotosPage' => ['PhotosView'],
      'Collection' => ['CollectionView'],
      'Comments' => ['CommentsView'],
      'Article' => ['ArticleView'],
      'Novelty' => ['NoveltyView'],
      'Healing' => ['HealingView'],
      'Contacts' => ['ContactsView'],
      'PricesPage' => ['PricesView']
  }.freeze

  validates :name, presence: true, length: {maximum: 250}
  validates :title, length: {maximum: 250}
  validates :h1, length: {maximum: 250}
  validates :meta_keywords, length: {maximum: 250}
  validates :meta_description, length: {maximum: 250}
  validates :slug, length: {maximum: 250}, uniqueness: {
      scope: :parent_id,
      message: 'псевдоним страницы должен быть уникальным'
  }

  before_save :set_kind
  after_save :set_material_path
  acts_as_nested_set

  belongs_to :main_object, polymorphic: true

  scope :admin_menu, -> {where(depth: 1)}
  scope :menu, -> {where(depth: 1)}

  def frontend
    data = {}
    data[:title] = title || name
    data[:h1] = h1 || name
    data[:meta_keywords] = meta_keywords
    data[:meta_description] = meta_description unless meta_description.blank?
    data[:view] = VIEWS_BY_KIND[kind]
    data[:breadcrumbs] = breadcrumbs
    data[:main_header] = false
    data[:cur_date] = Time.now.strftime('%d.%m.%Y')
    data[:cur_time] = Time.now.strftime('%H:%M')

    data = data.deep_merge!(main_object.frontend) if main_object
    data.merge!(Contact.first.frontend)

    case kind
      when 'MainPage'
        data.merge!(Photo.new.main_frontend)
        data.merge!(set_articles)
        data.merge!(Comment.new.main_frontend)        
        data[:main_header] = true
      when 'PhotosPage'
        data = data.deep_merge!(Photo.new.frontend) if kind == 'PhotosPage'
      when 'Comments'
        data = data.deep_merge!(Comment.new.frontend)
      when 'PricesPage'
        data[:prices] = Price.all.map(&:frontend)
        data[:other] = Healing.all.map {|heal| {id: heal.id, name: heal.name, href: heal.page.material_path}}
    end

    data
  end

  def admin_frontend
    data = {}
    data[:id] = id
    data[:name] = name
    data[:href] = material_path
    data[:control_url] = "/admin/pages/#{id}"

    data
  end

  def breadcrumbs
    breadcrumbs = []
    ancestors.each do |page|
      breadcrumbs << {href: page.material_path, text: page.name}
    end
    breadcrumbs
  end

  private

  def set_material_path
    if saved_changes['parent_id'].present? || saved_changes['slug'].present?
      self_and_descendants.each do |page|
        slug = page.slug == 'index' ? '' : page.slug
        new_path = page.root? || page.parent.root? ? '/' + slug : page.parent.material_path + '/' + slug
        page.update_column(:material_path, new_path)
      end
    end
  end

  def set_kind
    self.kind ||= main_object_type
  end

  def set_articles
    data = {}
    data[:articles] = Article.first(6).map(&:collection_frontend)
    Novelty.where(show_on_main: true).first(6).each do |nov|
      data[:articles] << nov.collection_frontend
    end
    data[:articles] = (data[:articles].sort_by {|art| art[:datetime]}).reverse
    data
  end
end
