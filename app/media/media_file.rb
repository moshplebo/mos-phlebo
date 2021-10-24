# == Schema Information
#
# Table name: media_files
#
#  id              :integer          not null, primary key
#  media_folder_id :integer
#  type            :string
#  name            :string
#  file            :string
#  checksum        :string
#  metadata        :jsonb
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  trash           :boolean          default(FALSE), not null
#

class MediaFile < ApplicationRecord
  default_scope -> { where(trash: false) }

  include AttributesCleaner

  validates :name, presence: true,
                   length: { maximum: 40 },
                   uniqueness: {
                     scope: :media_folder_id,
                     message: 'файла должно быть уникально'
                   }
  validates :type, presence: true # You shouldn't create instances of MediaFile directly
  validates :file, presence: true

  has_many :media_references, dependent: :destroy
  belongs_to :media_folder

  before_validation :set_folder, if: :orphan?
  after_save :set_media_folder_files_count
  after_destroy :set_media_folder_files_count

  scope :library, -> { order(:name) }
  scope :trash, -> { unscoped.where(trash: true) }

  scope :images, -> { where(type: 'MediaImage') }
  scope :documents, -> { where(type: 'MediaDocument') }
  scope :photos, -> { where(type: 'Photo') }

  def frontend
    {
      id: id,
      name: name,
      ext: File.extname(file.path).gsub('.', '').downcase,
      ext_name: name + File.extname(file.path),
      src: file.url,
      type: type,
      info: references_info,
      delete_status: refs_count.zero? ? nil : 'warning',
      r_key: "#{type}-#{id}"
    }
  end

  protected

  def references_info
    if refs_count.zero?
      'Нет ссылок на этот файл'
    else
      "На этот файл ссылается #{refs_count} #{Russian.p(refs_count, 'элемент', 'элемента', 'элементов')}"
    end
  end

  def refs_count
    @refs_count ||= media_references.to_a.size
  end

  def orphan?
    media_folder.blank?
  end

  def set_folder
    folder = MediaFolder.where(parent_id: nil, file_type: type).first_or_create
    self.media_folder = folder
  end

  def set_media_folder_files_count
    media_folder.set_media_files_count
    media_folder.save

    if media_folder_id_was && media_folder_id_changed?
      folder_was = MediaFolder.find(media_folder_id_was)
      folder_was.set_media_files_count
      folder_was.save
    end
  end
end
