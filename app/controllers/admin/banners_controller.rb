class Admin::BannersController < Admin::BaseController
  before_action :set_view
  before_action :find_banner, except: [:index, :new, :create]

  def index
    index_frontend
  end

  def new
    @data[:h1] = 'Создание баннера'
    @data[:controls] << {href: '/admin/banners', text: 'Отмена', icon: 'close-circle'}
    @data[:form] = Banner.new.admin_frontend
  end

  def edit
    @data[:h1] = 'Редактирование баннера'
    @data[:controls] << {href: '/admin/banners', text: 'Отмена', icon: 'close-circle'}
    @data[:form] = @banner.admin_frontend
  end

  def create
    banner = Banner.new(banner_params)

    if banner.save
      index_frontend
      @data[:success] = 'Баннер успешно создан'
      @data[:url] = admin_banners_url
    else
      render json: {error: banner.errors.full_messages.join('<br/>')}
    end
  end

  def update
    @banner.attributes = banner_params

    if @banner.save
      index_frontend
      @data[:success] = 'Баннер успешно обновлён'
      @data[:url] = admin_banners_url
    else
      render json: {error: @banner.errors.full_messages.join('<br/>')}
    end
  end

  def destroy
    if @banner.destroy
      index_frontend
      @data[:success] = 'Баннер успешно удалён'
      @data[:url] = admin_banners_url
    else
      render json: {error: @banner.errors.full_messages.join('<br/>')}
    end
  end

  private

  def set_view
    @data[:view] = 'AdminBannersView'
  end

  def find_banner
    @banner = Banner.find(params[:id])
    not_found if @banner.blank?
  end

  def index_frontend
    @data[:h1] = 'Баннеры'
    @data[:action] = 'index'
    @data[:banners] = Banner.includes(:media_file).all.map(&:admin_frontend)

    @data[:controls] << {href: '/admin/banners/new', text: 'Создать баннер', icon: 'plus-box'}
  end

  def banner_params
    params[:banner].permit(:header, :text, :media_file_id)
  end
end
