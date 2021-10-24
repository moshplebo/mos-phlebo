class Admin::NoveltiesController < Admin::BaseController
  include Components

  before_action :set_view
  before_action :find_novelty, except: [:index, :new, :create]

  def index
    index_frontend
  end

  def new
    @data[:h1] = 'Создание новости'
    @data[:controls] << {href: '/admin/novelties', text: 'Отмена', icon: 'close-circle'}
    @data[:form] = Novelty.new.admin_frontend
  end

  def edit
    @data[:h1] = 'Редактирование новости'
    @data[:controls] << {href: '/admin/novelties', text: 'Отмена', icon: 'close-circle'}
    @data[:form] = @novelty.admin_frontend
  end

  def create
    novelty = Novelty.new(novelty_params)
    novelty.show_on_main = novelty_params[:show_on_main].present?
    unless params[:components].present?
      render json: {error: ('Необходимо добавить компоненты'), success: ''}
      return
    end
    create_components(novelty)

    if novelty.save
      index_frontend
      @data[:success] = 'Новость успешно создана'
      @data[:url] = admin_novelties_url
    else
      set_error(novelty)
    end
  end

  def update
    @novelty.attributes = novelty_params
    @novelty.show_on_main = novelty_params[:show_on_main].present?

    if @novelty.save
      unless params[:components].present?
        render json: {error: ('Необходимо добавить компоненты'), success: ''}
        return
      end
      set_components_attributes(@novelty)
      @data[:errors] = ''
      @data[:success] = 'Новость успешно обновлёна'

      if params[:apply] == 'true'
        @data[:h1] = 'Редактирование статьи'
        @data[:controls] << { href: '/admin/novelties', text: 'Отмена', icon: 'close-circle' }
        @data[:url] = "/admin/novelties/#{@novelty.id}/edit"
        @data[:action] = 'edit'
        @data[:form] = @novelty.admin_frontend
      else
        index_frontend
        @data[:url] = admin_novelties_url
      end
    else
      set_error(@novelty)
    end
  end

  def destroy
    if @novelty.destroy
      index_frontend
      @data[:success] = 'Новость успешно удалёна'
      @data[:url] = admin_novelties_url
    else
      set_error(@novelty)
    end
  end

  private

  def set_view
    @data[:view] = 'AdminNoveltiesView'
  end

  def find_novelty
    @novelty = Novelty.unscoped.find_by(id: params[:id])
    not_found if @novelty.blank?
  end

  def index_frontend
    @data[:action] = 'index'
    @data[:h1] = 'Новости'
    @data[:novelties] = []
    Novelty.unscoped.order(published_at: :desc).includes(:page, :media_file, :components).all.each do |nov|
      @data[:novelties] << nov.admin_frontend
    end

    @data[:controls] << {href: '/admin/novelties/new', text: 'Создать новость', icon: 'plus-box'}
  end

  def novelty_params
    params.require(:novelty).permit(:name, :published_at, :media_file_id, :show_on_main, :slug, :title,
                                    :meta_description, :meta_keywords)
  end
end
