class Admin::ArticlesController < Admin::BaseController
  include Components

  before_action :set_view
  before_action :find_article, except: [:index, :new, :create]

  def index
    index_frontend
  end

  def new
    @data[:h1] = 'Создание статьи'
    @data[:controls] << {href: '/admin/articles', text: 'Отмена', icon: 'close-circle'}
    @data[:form] = Article.new.admin_frontend
  end

  def edit
    @data[:h1] = 'Редактирование статьи'
    @data[:controls] << {href: '/admin/articles', text: 'Отмена', icon: 'close-circle'}
    @data[:form] = @article.admin_frontend
  end

  def create
    article = Article.new(article_params)
    unless params[:components].present?
      render json: {error: ('Необходимо добавить компоненты'), success: ''}
      return
    end
    create_components(article)

    if article.save
      index_frontend
      @data[:success] = 'Статья успешно создана'
      @data[:url] = admin_articles_url
    else
      set_error(article)
    end
  end

  def update
    @article.attributes = article_params

    if @article.save
      unless params[:components].present?
        render json: {error: ('Необходимо добавить компоненты'), success: ''}
        return
      end
      set_components_attributes(@article)
      @data[:errors] = ''
      @data[:success] = 'Статья успешно обновлёна'

      if params[:apply] == 'true'
        @data[:h1] = 'Редактирование статьи'
        @data[:controls] << { href: '/admin/articles', text: 'Отмена', icon: 'close-circle' }
        @data[:url] = "/admin/articles/#{@article.id}/edit"
        @data[:action] = 'edit'
        @data[:form] = @article.admin_frontend
      else
        index_frontend
        @data[:url] = admin_articles_url
      end
    else
      set_error(@article)
    end
  end

  def destroy
    if @article.destroy
      index_frontend
      @data[:success] = 'Статья успешно удалёна'
      @data[:url] = admin_articles_url
    else
      set_error(@article)
    end
  end

  private

  def set_view
    @data[:view] = 'AdminArticlesView'
  end

  def find_article
    @article = Article.unscoped.find_by(id: params[:id])
    not_found if @article.blank?
  end

  def index_frontend
    @data[:action] = 'index'
    @data[:h1] = 'Статьи'
    @data[:articles] = []
    Article.unscoped.order(published_at: :desc).includes(:page, :media_file, :components).all.each do |art|
      @data[:articles] << art.admin_frontend
    end

    @data[:controls] << {href: '/admin/articles/new', text: 'Создать статью', icon: 'plus-box'}
  end

  def article_params
    params.require(:article).permit(:name, :published_at, :media_file_id, :slug, :title, :meta_description,
                                    :meta_keywords)
  end
end
