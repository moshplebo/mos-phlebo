# == Schema Information
#
# Table name: components
#
#  id                 :integer          not null, primary key
#  componentable_id   :integer
#  componentable_type :string
#  kind               :integer
#  position           :integer          default(0)
#  metadata           :jsonb            not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#

class Component < ApplicationRecord
  include MediaFilable
  default_scope -> { order(:position) }

  ALLOWED_KINDS = {
      'wysiwyg_block' => 'Текстовый блок',
      'gallery_block' => 'Фотогалерея',
      'wrapper_block' => 'Блок с обтеканием текста',
      'youtube_block' => 'Ютуб-видео'
  }.freeze

  acts_as_list scope: [:componentable_id, :componentable_type], add_new_at: :bottom

  enum kind: { wysiwyg_block: 0, gallery_block: 1, wrapper_block: 2, youtube_block: 3 }

  belongs_to :componentable, polymorphic: true
  has_many :media_references, as: :referrer, dependent: :destroy
  has_many :media_files, through: :media_references

  def frontend
    {
        kind: kind,
        metadata: metadata,
        media_files: media_files.map(&:frontend),
        r_key: "#{kind}-#{id}"
    }
  end

  def admin_frontend
    data = {}
    data[:id] = id
    data[:position] = position
    data[:kind] = kind
    data[:input_name] = "components[#{id}]"
    data[:componentable_id] = componentable_id
    data[:componentable_type] = componentable_type
    data[:content] = metadata['content'].present? ? metadata['content'] : ''
    data[:images] = media_files.map(&:frontend)
    data[:float] = metadata['float'].present? ? metadata['float'] : ''
    data[:youtube] = metadata['youtube']
    #Отдельное поле отвечающее за ютуб линк
    data
  end
end
