class MainMailer < ApplicationMailer

  def email(user, subject, message)

    @user = user
    @message = message
    mail(to: @user.email, subject: subject)

  end

  def back_email(email, subject, message)

    @message = message
    mail(to: email, subject: subject)

  end

end
