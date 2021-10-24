# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string           default(""), not null
#  password_digest        :string           default(""), not null
#  last_name              :string
#  first_name             :string
#  father_name            :string
#  phone                  :string
#  role                   :integer          default("user"), not null
#  access_token           :string
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  confirmation_token     :string
#  confirmation_sent_at   :datetime
#  confirmed_at           :datetime
#  failed_attempts        :integer          default(0), not null
#  unlock_token           :string
#  locked_at              :datetime
#  activated_at           :datetime
#  activated_by           :integer
#  blocked_at             :datetime
#  blocked_by             :integer
#  online                 :datetime
#  metadata               :jsonb            not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#

class User < ApplicationRecord
  include UserBase

  enum role: { user: 0, admin: 1 }

  validates_presence_of :last_name
  validates_presence_of :first_name
  validates_presence_of :email
  validates_presence_of :phone
  validates :password, presence: true, length: {
    minimum: 6,
    too_short: 'должен содержать минимум %{count} символов'
  }, if: :need_validate_password?
  validates :email, uniqueness: {
    case_sensitive: false,
    message: ' уже зарегистрирован в системе, восстановите пароль или войдите в систему'
  }

  before_save :format_phone

  def format_phone
    self.phone = phone.to_s.gsub(/[^0-9]/, '')
  end

  ROLES = { 1 => 'Администратор', 0 => 'Пользователь' }.freeze

  def phone_text
    if phone.length == 11 && %w(8 7).include?(phone[0])
      "+7 #{phone[1..3]} #{phone[4..6]} #{phone[7..8]} #{phone[9..10]}"
    elsif phone.length == 10
      "+7 #{phone[0..2]} #{phone[3..5]} #{phone[6..7]} #{phone[8..9]}"
    else
      phone
    end
  end

  def name
    "#{last_name} #{first_name} #{father_name}".squish
  end

  def reset_password(password)
    self.password = password
    self.reset_password_token = nil
    self.reset_password_sent_at = nil
    save
  end

  private

  def need_validate_password?
    new_record? || password.present?
  end
end
