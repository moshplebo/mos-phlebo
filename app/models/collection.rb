# == Schema Information
#
# Table name: collections
#
#  id                  :integer          not null, primary key
#  name                :string
#  slug                :string
#  collectionable_type :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

class Collection < ApplicationRecord
  ALLOWED_ELEMENTS = ['Article', 'Healing', 'Novelty'].freeze

  include Slugable

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true
  validates :collectionable_type, presence: true, inclusion: { in: ALLOWED_ELEMENTS }

  has_one :page, as: :main_object

  def frontend
    klass = collectionable_type.constantize
    ids = page.children.pluck(:main_object_id).uniq
    data = {}
    data[:type] = collectionable_type
    data[:elements] = klass.includes(klass.all_in).where(id: ids).map(&:collection_frontend)

    data
  end
end
