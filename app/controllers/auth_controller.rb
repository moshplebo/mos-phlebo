class AuthController < ApplicationController
  before_action :set_auth_view, except: :logout

  def registration
    if @current_user
      @data.merge!AuthHelper::CurrentAndRegistration
      @answer_status = 403
    else
      @data[:action] = 'registration'
      @data[:form] = {
          email: params[:email],
          password: params[:password],
          last_name: params[:last_name],
          first_name: params[:first_name],
          phone: params[:phone]
      }

      if request.post?
        user = User.new(@data[:form].to_h)
        if user.save
          @current_user = user
          create_user_session
          redirect_to '/'
        else
          @data[:error] = user.errors.full_messages.join(' / ')
        end
      end
      @data[:form][:password] = ''
    end
  end

  def recovery
    if @current_user
      @data.merge!(AuthHelper::CurrentAndRecovery)
      @answer_status = 403
    else
      @data[:action] = 'recovery'
      @data[:form] = { login: params[:login] }
      if request.post? && params[:login].present?
        User.where(email: params[:login]).take.try(:reset_password)
        @data.merge!(AuthHelper::RecoveryInstr)
      end
    end
  end

  def reset_password
    user = User.where(reset_password_token: params[:token]).take
    if user && user.reset_password_sent_at > Time.now - 24.hours

      @data[:form] = { password_confirmation: params[:password_confirmation], password: params[:password] }
      @data[:action] = 'reset_password'

      if request.post?
        if params[:password_confirmation] == params[:password]
          @current_user = user.reset_password(params[:password])
          create_user_session
          redirect_to '/'
        else
          @data[:error] = 'Пароль и подтверждение не совпадают'
        end
      end
    else
      @data.merge!(AuthHelper::ResetPasswordError)
    end
  end

  def login
    if @current_user
      @data.merge!(AuthHelper::CurrentAndLogin)
      @answer_status = 403
    else
      @data[:action] = 'login'

      @data[:form] = {
          login: params[:login],
          password: '',
          remember_me: true,
          redirect_url: filter_redirect_url(params[:redirect_url])
      }

      if request.post? && params[:login].present? && params[:password].present?
        @current_user = User.auth(params[:login], params[:password])
        if @current_user
          create_user_session
          redirect_url = filter_redirect_url(params[:redirect_url])
          redirect_to redirect_url.present? ? redirect_url : '/admin'
        else
          @data[:form] = { login: params[:login], password: '', remember_me: !!params[:remember_me] }
          @data[:error] = 'Неверный логин или пароль'
        end
      end
    end
  end

  def logout
    destroy_user_session
    redirect_to '/'
  end

  private

  def filter_redirect_url(url)
    return '' if url.blank?
    default_host = Rails.application.config.default_host
    url =~ /\A#{default_host}.*/ ? url : ''
  end

  def set_auth_view
    @data[:view] = 'AuthView'
    @data[:error] = ''
  end
end
