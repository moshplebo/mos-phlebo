class Admin::StaticPagesController < Admin::BaseController
  include Components

  before_action :set_view
  before_action :find_static_page, except: [:index, :new, :create]

  def index
    index_frontend
  end

  def move_up
    if StaticPage.where(parent_id: @static_page.parent_id).where('lft<?', @static_page.lft).first
      unless @static_page.move_left
        render json: { error: @static_page.errors.full_messages.join('</br>') }
      end
    end

    index_frontend
    @data[:url] = admin_static_pages_url
  end

  def move_down
    if StaticPage.where(parent_id: @static_page.parent_id).where('rgt>?', @static_page.rgt).first
      unless @static_page.move_right
        render json: { error: @static_page.errors.full_messages.join('</br>') }
      end
    end

    index_frontend
    @data[:url] = admin_static_pages_url
  end

  def new
    @data[:h1] = 'Создание статичной страницы'
    @data[:controls] << { href: '/admin/static_pages', text: 'Отмена', icon: 'close-circle' }
    @data[:form] = StaticPage.new.admin_frontend
  end

  def edit
    @data[:h1] = 'Редактирование статичной страницы'
    @data[:controls] << { href: '/admin/static_pages', text: 'Отмена', icon: 'close-circle' }
    @data[:form] = @static_page.admin_frontend
  end

  def create
    static_page = StaticPage.new(static_page_params)
    static_page.active = static_page_params[:active].present?
    static_page.parent_id = nil if static_page_params[:parent_id] == '0'
    unless params[:components].present?
      render json: { error: ('Необходимо добавить компоненты'), success: '' }
      return
    end
    create_components(static_page)

    if static_page.save!
      index_frontend
      @data[:success] = 'Статичная страница успешно создана'
      @data[:url] = admin_static_pages_url
    else
      set_error(static_page)
    end
  end

  def update
    @static_page.attributes = static_page_params
    @static_page.active = static_page_params[:active].present?
    @static_page.parent_id = nil if static_page_params[:parent_id] == '0'

    if @static_page.save
      unless params[:components].present?
        render json: { error: ('Необходимо добавить компоненты'), success: '' }
        return
      end
      set_components_attributes(@static_page)
      @data[:errors] = ''
      @data[:success] = 'Статичная страница успешно обновлена'

      if params[:apply] == 'true'
        @data[:h1] = 'Редактирование статичной страницы'
        @data[:controls] << { href: '/admin/static_pages', text: 'Отмена', icon: 'close-circle' }
        @data[:url] = "/admin/static_pages/#{@static_page.id}/edit"
        @data[:action] = 'edit'
        @data[:form] = @static_page.admin_frontend
      else
        index_frontend
        @data[:url] = admin_static_pages_url
      end
    else
      set_error(@static_page)
    end
  end

  def destroy
    if @static_page.destroy
      index_frontend
      @data[:success] = 'Статичная страница успешно удалена'
      @data[:url] = admin_static_pages_url
    else
      set_error(@static_page)
    end
  end

  private

  def set_view
    @data[:view] = 'AdminStaticPagesView'
  end

  def find_static_page
    @static_page = StaticPage.find_by(id: params[:id])
    not_found if @static_page.blank?
  end

  def index_frontend
    @data[:action] = 'index'
    @data[:h1] = 'Статичные страницы'
    @data[:static_pages] = []
    StaticPage.order('lft').each { |sp| @data[:static_pages] << sp.admin_frontend }
    @data[:controls] << { href: '/admin/static_pages/new', text: 'Создать статичную страницу', icon: 'plus-box' }
  end

  def static_page_params
    params[:static_page].permit(:name, :active, :parent_id, :slug, :title, :meta_description, :meta_keywords)
  end
end
