class MediaFileUploader < CarrierWave::Uploader::Base
  storage :file
  process :save_original_name

  def store_dir
    "#{Rails.root}/public/uploads/#{model.class.to_s.underscore}/#{model.id}"
  end

  def filename
    "#{secure_token}.#{file.extension}" if original_filename
  end

  protected

  def secure_token
    var = :"@#{mounted_as}_secure_token"
    model.instance_variable_get(var) || model.instance_variable_set(var, SecureRandom.uuid)
  end

  def save_original_name
    model.name ||= original_filename.gsub(/\.[^\.]*\Z/, '').first(39) if original_filename
  end
end
