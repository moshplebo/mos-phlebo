class Admin::BaseController < ActionController::API
  include ActionController::MimeResponds
  include ActionController::Cookies
  include DataInit
  include RenderLogic
  include Csrf
  include Visitors
  include Users
  helper ApplicationHelper

  before_action :check_admin, :set_data

  def check_admin
    if current_user.blank?
      redirect_to '/login'
    elsif !current_user.admin?
      forbidden
      @data[:layout] = 'BlankLayout'
      @data[:text] = 'Ваших прав недостаточно для просмотра данной страницы'
      default_render
    else
      @data[:h1] = nil
      @data[:text] = nil
      @data[:link_text] = nil
    end
  end

  def set_data
    @data[:action] = params[:action]
    @data[:layout] = 'AdminLayout'
    @data[:user_name] = current_user.name
    @data[:title] = 'Панель администратора'
    @data[:logo_text] = 'Флеболог Калачев'

    @data[:controls] = []
    @data[:success] = ''

    @data[:left_menu] = []
    @data[:left_menu] << { text: 'Баннеры', href: '/admin/banners', icon: 'presentation' }
    @data[:left_menu] << { text: 'Главная страница', href: '/admin/contacts', icon: 'account-card-details' }
    @data[:left_menu] << { text: 'Статичные страницы', href: '/admin/static_pages', icon: 'book-open' }
    @data[:left_menu] << { text: 'Меню', href: '/admin/pages', icon: 'menu' }
    @data[:left_menu] << { text: 'Новости', href: '/admin/novelties', icon: 'calendar-text' }
    @data[:left_menu] << { text: 'Статьи о варикозе', href: '/admin/articles', icon: 'newspaper' }
    @data[:left_menu] << { text: 'Методы лечения', href: '/admin/healings', icon: 'ambulance' }
    @data[:left_menu] << { text: 'Отзывы', href: '/admin/comments', icon: 'comment-text-outline' }
    @data[:left_menu] << { text: 'Фотогалерея', href: '/admin/photo_categories', icon: 'image-filter' }
    @data[:left_menu] << { text: 'Цены', href: '/admin/prices', icon: 'currency-rub' }
    @data[:left_menu] << { text: 'Медиа библиотека', href: '/admin/media_library', icon: 'library-books' }
  end

  def default_render
    @answer_status ||= 200

    respond_to do |format|
      format.html do
        @data[:csrfToken] = cookies[:csrfToken]
        render 'layouts/admin', status: @answer_status
      end
      format.json { render json: @data }
    end
  end

  def set_error(object)
    render json: { error: object.errors.full_messages.join('</br>'), success: '' }
  end
end
