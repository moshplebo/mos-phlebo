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

class MediaImage < MediaFile
  mount_uploader :file, ImageUploader

  before_validation :set_checksum
  after_save :optimize

  private

  def set_checksum
    self.checksum = Digest::MD5.hexdigest(File.read(file.path))
  end

  def optimize
    image_optim = ImageOptim.new(
        jpegoptim: { max_quality: 90, allow_lossy: true, strip: :all },
        jpegtran: false, jhead: false, pngout: false, svgo: false, advpng: false, pngquant: false,
        gifsicle: false, optipng: false, pngcrush: false, allow_lossy: true, jpegrecompress: false
    )
    file.versions.each do |_name, version|
      image_optim.optimize_image!(version.path) if File.exist?(version.path)
    end
  end
end
