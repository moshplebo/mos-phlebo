class Admin::HealingsController < Admin::BaseController
  include Components

  before_action :set_view
  before_action :find_healing, except: [:index, :new, :create]

  def index
    index_frontend
  end

  def new
    @data[:h1] = 'Создание статьи'
    @data[:controls] << {href: '/admin/healings', text: 'Отмена', icon: 'close-circle'}
    @data[:form] = Healing.new.admin_frontend
  end

  def edit
    @data[:h1] = 'Редактирование статьи'
    @data[:controls] << {href: '/admin/healings', text: 'Отмена', icon: 'close-circle'}
    @data[:form] = @healing.admin_frontend
  end

  def create
    healing = Healing.new(healing_params)
    unless params[:components].present?
      render json: {error: ('Необходимо добавить компоненты'), success: ''}
      return
    end
    create_components(healing)

    if healing.save
      index_frontend
      @data[:success] = 'Статья успешно создана'
      @data[:url] = admin_healings_url
    else
      set_error(healing)
    end
  end

  def update
    @healing.attributes = healing_params

    if @healing.save
      unless params[:components].present?
        render json: {error: ('Необходимо добавить компоненты'), success: ''}
        return
      end
      set_components_attributes(@healing)
      @data[:errors] = ''
      @data[:success] = 'Статья успешно обновлёна'

      if params[:apply] == 'true'
        @data[:h1] = 'Редактирование статьи'
        @data[:controls] << { href: '/admin/healings', text: 'Отмена', icon: 'close-circle' }
        @data[:url] = "/admin/healings/#{@healing.id}/edit"
        @data[:action] = 'edit'
        @data[:form] = @healing.admin_frontend
      else
        index_frontend
        @data[:url] = admin_healings_url
      end
    else
      set_error(@healing)
    end
  end

  def destroy
    if @healing.destroy
      index_frontend
      @data[:success] = 'Статья успешно удалёна'
      @data[:url] = admin_healings_url
    else
      set_error(@healing)
    end
  end

  private

  def set_view
    @data[:view] = 'AdminHealingsView'
  end

  def find_healing
    @healing = Healing.unscoped.find_by(id: params[:id])
    not_found if @healing.blank?
  end

  def index_frontend
    @data[:action] = 'index'
    @data[:h1] = 'Методы лечения'
    @data[:healings] = []
    Healing.unscoped.includes(:page, :components).all.each do |heal|
      @data[:healings] << heal.admin_frontend
    end

    @data[:controls] << {href: '/admin/healings/new', text: 'Создать статью', icon: 'plus-box'}
  end

  def healing_params
    params.require(:healing).permit(:name, :slug, :title, :meta_description, :meta_keywords)
  end
end
