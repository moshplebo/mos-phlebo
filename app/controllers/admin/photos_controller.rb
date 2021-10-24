class Admin::PhotosController < Admin::BaseController
  before_action :set_view
  before_action :find_photo, except: [:index, :new, :create]
  before_action :find_photo_category, only: [:index, :new, :create]

  def index
    index_frontend
  end

  def new
    @data[:h1] = 'Добавление фотографии'
    @data[:controls] << { href: admin_photo_category_photos_url, text: 'Отмена', icon: 'close-circle' }
    @data[:form] = Photo.new.admin_frontend
    @data[:photos_create_url] = "/admin/photo_categories/#{@photo_category.id}/photos"
  end

  def edit
    @data[:h1] = 'Редактирование фотографии'
    @data[:controls] << { href: admin_photo_category_url, text: 'Отмена', icon: 'close-circle' }
    @data[:form] = @photo.admin_frontend
  end

  def create
    photo = @photo_category.photos.new(photo_params)
    photo.media_file_id = params[:photo][:media_file_id]

    if photo.save
      index_frontend
      @data[:success] = 'Фотография успешно добавлена'
      @data[:url] = admin_photo_category_photos_url
    else
      render json: { error: photo.errors.full_messages.join('<br/>') }
    end
  end

  def update
    @photo.attributes = photo_params
    @photo.media_file_id = params[:photo][:media_file_id]

    if @photo.save
      index_frontend
      @data[:success] = 'Фотография успешно обновлена'
      @data[:url] = admin_photo_category_photos_url
    else
      render json: { error: @photo.errors.full_messages.join('<br/>') }
    end
  end

  def destroy
    photo_category_id = @photo.photo_category.id
    if @photo.destroy
      index_frontend

      @data[:success] = 'Фотография успешно удалена'
      @data[:url] = admin_photo_category_photos_url
    else
      render json: { error: @photo.errors.full_messages.join('<br/>') }
    end
  end

  private

  def find_photo_category
    @photo_category = PhotoCategory.find(params[:photo_category_id])
    not_found if @photo_category.blank?
  end

  def set_view
    @data[:view] = 'AdminPhotosView'
  end

  def find_photo
    @photo = Photo.find(params[:id])
    not_found if @photo.blank?
  end

  def index_frontend
    find_photo_category
    @data[:h1] = "Фотогалерея \"#{@photo_category.name}\""
    @data[:action] = 'index'
    @data[:photos] = Photo.includes(:media_file).where("photo_category_id = #{params[:photo_category_id]}").order(:id).map(&:admin_frontend)

    @data[:controls] << { href: admin_photo_category_photos_new_url, text: 'Добавить фотографию', icon: 'plus-box' }
    @data[:controls] << { href: '/admin/photo_categories', text: 'В список категорий', icon: 'keyboard-return' }
  end

  def photo_params
    params.require(:photo).permit(
        :photo_category_id,
        :media_file_id,
        metadata: [:header, :text, :alt])
  end
end
