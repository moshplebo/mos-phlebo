module Csrf
  extend ActiveSupport::Concern

  included do
    before_action :control_csrf
  end

  def control_csrf
    if request.post? && params[:csrf_token] != cookies[:csrfToken]

      forbidden
      @data[:text] = 'Доступ запрещен из-за подозрения на межсайтовую подделку запроса — CSRF'
      default_render

    elsif request.get?
      cookies[:csrfToken] = { value: SecureRandom.uuid, expires: 1.year.from_now } unless cookies[:csrfToken]
    end
  end
end
