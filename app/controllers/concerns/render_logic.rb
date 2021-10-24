module RenderLogic
  extend ActiveSupport::Concern

  def default_render
    @answer_status ||= 200
    if @data[:lеgacy]
      render 'layouts/legacy', status: @answer_status
    else
      respond_to do |format|
        format.html do
          @data[:csrfToken] = cookies[:csrfToken]
          render 'layouts/application', status: @answer_status
        end
        format.json { render json: @data }
      end
    end
  end

  def not_found
    @data[:view] = 'ErrorView'
    @data[:title] = '404 / Страница не найдена'
    @data[:h1] = 'Ошибка 404'
    @data[:text] = 'Страница с таким адресом на сайте не найдена'
    @answer_status = 404
  end

  def forbidden
    @data[:view] = 'ErrorView'
    @data[:title] = '403 / Доступ запрещен'
    @data[:h1] = 'Ошибка 403'
    @data[:text] = 'Доступ запрещен'
    @answer_status = 403
  end
end
