class BackcallController < ApplicationController

  def register
    message = []

    message << "ФИО: #{params[:register][:fio]}"
    message << "Телефон: #{params[:register][:phone]}"
    message << "E-mail: #{params[:register][:email]}" if params[:register][:email].present?
    message << "Дата и время записи: #{params[:register][:date]} #{params[:register][:time]}"
    if params[:register][:back_call_date] && params[:register][:back_call_time]
      message << "Дата и время для звонка: #{params[:register][:back_call_date]} #{params[:register][:back_call_time]}"
    else
      message << "Дата и время для звонка: В ближайшее время"
    end

    @data[:url] = request.referrer
    ['info@mos-phlebo.ru', 'mosphlebo@gmail.com'].each do |email|
      MainMailer.back_email(email, "Запись на прием", message).deliver_now
    end
  end

  def backcall
    message = []

    message << "Имя: #{params[:backcall][:name]}"
    message << "Телефон: #{params[:backcall][:phone]}"
    message << "E-mail: #{params[:backcall][:email]}" if params[:backcall][:email].present?
    message << "Сообщение: #{params[:backcall][:text]}"

    @data[:url] = '/kontakty'
    ['info@mos-phlebo.ru', 'mosphlebo@gmail.com'].each do |email|
      MainMailer.back_email(email, "Обратная связь", message).deliver_now
    end
  end

end
