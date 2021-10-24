module UserBase
  extend ActiveSupport::Concern

  included do
    attr_accessor :password
    before_save :setup_password
  end

  def setup_password
    return if password.nil?

    SCrypt::Engine.calibrate!(max_mem: 64 * 1024 * 1024, max_time: 0.5)
    self.password_digest = SCrypt::Password.create(password)
    self.password = nil
  end

  def active?
    blocked_at.nil? && locked_at.nil? # && !self.confirmed_at.nil?
  end

  def failed_attempt
    if failed_attempts < 10
      increment!(:failed_attempts)
    else
      self.failed_attempts += 1
      self.locked_at = Time.now
      self.unlock_token = User.generate_token
      save(validate: false)
    end
  end

  def set_reset_password_token
    self.reset_password_token = User.generate_token
    self.reset_password_sent_at = Time.now
    save(validate: false)
  end

  def reset_password
    return unless reset_password_sent_at.nil? || reset_password_sent_at > (Time.now - 30.minutes)

    set_reset_password_token

    message = []
    message << "Здравствуйте, #{first_name} #{father_name}!"
    message << ''
    message << 'Для того, чтобы войти в систему и задать новый пароль Вам необходимо перейти по указанной ссылке:'
    message << ''
    message << "#{Rails.application.config.default_host}/reset_password/#{reset_password_token}"
    message << ''
    message << 'Ссылка действует только 24 часа и может быть использована только один раз.'
    message << ''
    message << '--'
    message << Rails.application.config.company_name

    MainMailer.email(self, 'Восстановление пароля', message).deliver_now
  end

  module ClassMethods
    def auth(email, password)
      user = User.find_by(email: email)

      if !user.try(:active?)
        user = nil
      elsif SCrypt::Password.new(user.password_digest) != password
        user.failed_attempt
        user = nil
      else
        user.update_columns(failed_attempts: 0, online: Time.now)
      end

      user
    end

    def generate_token
      SecureRandom.hex(32)
    end
  end
end
