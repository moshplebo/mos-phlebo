class ImageUploader < MediaFileUploader
  include CarrierWave::MiniMagick

  process :auto_orient
  process quality: 100
  process resize_to_limit: [1500, -1]

  version :thumb do
    process :auto_orient
    process quality: 95
    process resize_to_fill: [452, 300]
  end

  version :big do
    process :auto_orient
    process quality: 95
    process resize_to_limit: [904, 600]
  end

  version :banner do
    process :auto_orient
    process quality: 95
    process resize_to_fill: [1480, 420]
  end

  storage :file

  def auto_orient
    manipulate! do |image|
      image.tap(&:auto_orient)
    end
  end

  def content_type_whitelist
    /image\//
  end

  def extension_whitelist
    %w(jpg jpeg gif png webp)
  end

  def store_dir
    "#{Rails.root}/public/uploads/photo/#{model.id}"
  end

  def filename
    # https://github.com/carrierwaveuploader/carrierwave/wiki/How-to%3A-Create-random-and-unique-filenames-for-all-versioned-files
    # image id is not present on filename creating moment, so we can not use model.id here
    @name ||= Digest::SHA256.hexdigest(model.checksum)[1..16] + '.jpg'.gsub(/[^a-zA-Z0-9.-]/, '_').downcase if original_filename.present?
  end

  def url
    if !file.nil? && file.exists?
      super
    elsif !Rails.env.production?
      default_url
    else
      default_url
    end
  end
end
