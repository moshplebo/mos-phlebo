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

class MediaDocument < MediaFile
  mount_uploader :file, DocumentUploader
end
