class Admin::PhotoCategoriesController < Admin::BaseController
  before_action :set_view
  before_action :find_photo_category, except: [:index, :new, :create]

  def index
    index_frontend
  end

  def move_up
    old_position = @photo_category.position
    prev_category = @photo_category.prev_category

    if prev_category
      @photo_category.position = prev_category.position
      prev_category.position = old_position

      unless @photo_category.save && prev_category.save
        render json: {error: @photo_category.errors.full_messages.join('</br>')}
      end
    end

    index_frontend
    @data[:url] = admin_photo_categories_url
  end

  def move_down
    old_position = @photo_category.position
    next_category = @photo_category.next_category

    if next_category
      @photo_category.position = next_category.position
      next_category.position = old_position

      unless @photo_category.save && next_category.save
        render json: {error: @photo_category.errors.full_messages.join('</br>')}
      end
    end

    index_frontend
    @data[:url] = admin_photo_categories_url
  end

  def new
    @data[:h1] = 'Создание категории'
    @data[:controls] << { href: '/admin/photo_categories', text: 'Отмена', icon: 'close-circle' }
    @data[:form] = PhotoCategory.new.admin_frontend
  end

  def edit
    @data[:h1] = 'Редактирование категории'
    @data[:controls] << { href: '/admin/photo_categories', text: 'Отмена', icon: 'close-circle' }
    @data[:form] = @photo_category.admin_frontend

    @data[:photos] = @photo_category.photos.map(&:admin_frontend)
    @data[:controls] << { href: "/admin/photo_categories/#{@photo_category.id}/photos/new",
                          text: 'Добавить фотографию', icon: 'plus-box' }
  end

  def create
    photo_category = PhotoCategory.new(photo_category_params)
    photo_category.position = PhotoCategory.last.present? ? PhotoCategory.last.position + 1 : 1

    if photo_category.save
      index_frontend
      @data[:success] = 'Категория успешно создана'
      @data[:url] = admin_photo_categories_url
    else
      render json: { error: photo_category.errors.full_messages.join('<br/>') }
    end
  end

  def update
    @photo_category.attributes = photo_category_params

    if @photo_category.save
      index_frontend
      @data[:success] = 'Категория успешно обновлена'
      @data[:url] = admin_photo_categories_url
    else
      render json: { error: @photo_category.errors.full_messages.join('<br/>') }
    end
  end

  def destroy
    if @photo_category.destroy
      index_frontend
      @data[:success] = 'Категория успешно удалена'
      @data[:url] = admin_photo_categories_url
    else
      render json: { error: @photo_category.errors.full_messages.join('<br/>') }
    end
  end

  private

  def set_view
    @data[:view] = 'AdminPhotoCategoriesView'
  end

  def find_photo_category
    @photo_category = PhotoCategory.find(params[:id])
    not_found if @photo_category.blank?
  end

  def index_frontend
    @data[:h1] = 'Фотогалерея'
    @data[:action] = 'index'
    @data[:categories] = PhotoCategory.order(:id).map(&:admin_frontend)

    @data[:controls] << { href: '/admin/photo_categories/new', text: 'Создать категорию', icon: 'plus-box' }
  end

  def photo_category_params
    params.require(:photo_category).permit(:name)
  end
end
