namespace :app do
  task clean_trash: :environment do
    MediaFile.trash.where('updated_at < ?', Time.now - 1.week).destroy_all
  end

  task cache_clear: :environment do
    Rails.cache.clear
  end
end
