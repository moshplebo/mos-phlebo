class MediaReference < ApplicationRecord
  # default_scope -> { order(:position) }

  belongs_to :media_file
  belongs_to :referrer, polymorphic: true
end
