# == Schema Information
#
# Table name: media_folders
#
#  id                :integer          not null, primary key
#  parent_id         :integer
#  lft               :integer          not null
#  rgt               :integer          not null
#  depth             :integer          default(0), not null
#  media_files_count :integer          default(0), not null
#  name              :string
#  file_type         :string
#  slug              :string
#  path              :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#

class MediaFolder < ApplicationRecord
  default_scope -> { order(:lft) }

  ICON_BY_FILETYPE = {
    'MediaImage' => 'folder-image',
    'MediaDocument' => 'folder-document',
    'Photo' => 'folder-image'
  }.freeze

  validate :depth_less_than_five
  validates :name, presence: true, uniqueness: { scope: :parent_id }, length: { maximum: 40 }
  validates :slug, presence: true
  validates :file_type, presence: true

  has_many :media_files

  before_validation :clear_path
  before_destroy :check_deleted_files
  before_destroy :check_for_empty
  acts_as_nested_set
  include Slugable
  include AttributesCleaner

  before_save :set_media_files_count
  after_save :set_path

  def frontend
    {
        id: id,
        name: name,
        src: src,
        path: path,
        icon: ICON_BY_FILETYPE[file_type],
        folders: nested_folders,
        files: media_files.library.includes(:media_references).map(&:frontend),
        breadcrumbs: breadcrumbs,
        allow_new_folders: depth < 4
    }
  end

  def short_info
    {
        id: id,
        name: name,
        src: src,
        info: contains_info,
        delete_status: allow_delete? ? nil : 'disabled'
    }
  end

  def src
    "/admin/media_library/#{path}"
  end

  def initialize_child
    MediaFolder.new(parent_id: id, file_type: file_type, name: generate_new_folder_name)
  end

  def allow_delete?
    nested_folders.count.zero? && media_files_count.zero?
  end

  def set_media_files_count
    # Doing it instead of counter cache to respect `default_scope`
    self.media_files_count = media_files.count
  end

  private

  def nested_folders
    # `children` method just don't work here cause of `default_scope`
    @nested_folders ||= MediaFolder.unscoped.where(parent_id: id).order(:name).map(&:short_info)
  end

  def breadcrumbs
    self_and_ancestors.map(&:short_info)
  end

  def depth_less_than_five
    return if parent_id.blank?

    errors.add(:depth, 'Достигнут максимальный уровень вложенности') if parent.depth >= 4
  end

  def generate_new_folder_name
    names = children.pluck(:name)
    new_name = 'Новая папка'
    counter = 0

    while names.include?(new_name)
      counter += 1
      new_name = "Новая папка #{counter}"
    end

    new_name
  end

  def contains_info
    contains = []
    folders_count = nested_folders.count

    if folders_count.nonzero?
      folders_string = Russian.p(folders_count, 'папку', 'папки', 'папок')
      contains << "#{folders_count} #{folders_string}"
    end

    if media_files_count.nonzero?
      files_string = Russian.p(media_files_count, 'файл', 'файла', 'файлов')
      contains << "#{media_files_count} #{files_string}"
    end

    contains.any? ? "Содержит #{contains.join(' и ')}" : 'Папка пустая'
  end

  def set_path
    return if path.present?

    composite_path = []
    self_and_ancestors.each do |page|
      composite_path << page.slug
    end
    update_column(:path, composite_path.join('/'))

    descendants.each do |child|
      child.slug = nil
      child.path = nil
      child.save
    end
  end

  def check_deleted_files
    MediaFile.unscoped.where(media_folder_id: id, trash: true).each do |mf|
      mf.media_folder = root
      mf.save
    end
  end

  def check_for_empty
    return true if allow_delete?

    errors.add(:base, 'Переместите или удалите все объекты из папки перед её удалением')
    throw(:abort)
  end

  def clear_path
    return if new_record? || (name_was == name && parent_id_was == parent_id)

    self.slug = nil
    self.path = nil
  end
end
