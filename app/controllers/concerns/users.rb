module Users
  extend ActiveSupport::Concern

  included do
    before_action :init_user
  end

  def init_user
    @data[:current_user] = {}
    if current_user
      @data[:current_user][:id] = current_user.id
      @data[:current_user][:email] = current_user.email
      @data[:current_user][:activated] = !!current_user.activated_at
      @data[:current_user][:role] = current_user.role
    end
  end

  def current_user
    return @current_user if defined?(@current_user)
    @current_user = nil
    if !@current_user && cookies.encrypted[:user]
      @current_user = User.find_by(id: cookies.encrypted[:user].to_i)
      if @current_user.try(:active?)
        @current_user.online = Time.now if !@current_user.online || @current_user.online < 1.minute.ago
        @current_user.save if @current_user.changed?
      end
    end

    @current_user
  end

  def create_user_session
    cookies.encrypted[:user] = { value: @current_user.id, expires: 1.year.from_now }
    init_user
  end

  def destroy_user_session
    cookies.delete :user
    @current_user = nil
    init_user
  end
end
