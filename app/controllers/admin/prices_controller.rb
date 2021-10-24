class Admin::PricesController < Admin::BaseController
  include Components

  before_action :set_view
  before_action :find_price, except: [:index, :new, :create]

  def move_up
    old_position = @price.position
    prev_price = @price.prev_price

    if prev_price
      @price.position = prev_price.position
      prev_price.position = old_position

      unless @price.save && prev_price.save
        render json: {error: @price.errors.full_messages.join('</br>')}
      end
    end

    index_frontend
    @data[:url] = admin_prices_url
  end

  def move_down
    old_position = @price.position
    next_price = @price.next_price

    if next_price
      @price.position = next_price.position
      next_price.position = old_position

      unless @price.save && next_price.save
        render json: {error: @price.errors.full_messages.join('</br>')}
      end
    end

    index_frontend
    @data[:url] = admin_prices_url
  end

  def index
    index_frontend
  end

  def new
    @data[:h1] = 'Добавление услуги'
    @data[:controls] << {href: '/admin/prices', text: 'Отмена', icon: 'plus-box'}
    @data[:form] = Price.new.admin_frontend
  end

  def edit
    @data[:h1] = 'Редактирование услуги'
    @data[:controls] << {href: '/admin/prices', text: 'Отмена', icon: 'close-circle'}
    @data[:form] = @price.admin_frontend
  end

  def create
    price = Price.new(price_params)
    price.position = Price.last.present? ? Price.last.position + 1 : 1

    if price.save
      index_frontend
      @data[:success] = 'Услуга успешно добавлена'
      @data[:url] = admin_prices_url
    else
      set_error(price)
    end
  end

  def update
    @price.attributes = price_params

    if @price.save
      index_frontend
      @data[:success] = 'Услуга успешно обновлена'
      @data[:url] = admin_prices_url
    else
      render json: {error: @price.errors.full_messages.join('<br/>')}
    end
  end

  def destroy
    if @price.destroy
      index_frontend
      @data[:success] = 'Новость успешно удалёна'
      @data[:url] = admin_prices_url
    else
      set_error(@price)
    end
  end

  private

  def set_view
    @data[:view] = 'AdminPricesView'
  end

  def find_price
    @price = Price.find_by(id: params[:id])
    not_found if @price.blank?
  end

  def index_frontend
    @data[:action] = 'index'
    @data[:h1] = 'Цены'
    @data[:prices] = Price.all.map(&:admin_frontend)

    @data[:controls] << {href: '/admin/prices/new', text: 'Добавить услугу', icon: 'plus-box'}
  end

  def price_params
    params.require(:price).permit(:cost, :name, :position)
  end
end
