module Frontend
  extend ActiveSupport::Concern

  included do
    include ActionView::Helpers::NumberHelper

    def format_price(price)
      number_to_currency(price, unit: '', separator: ',', precision: 2, delimiter: ' ')
    end
  end

  def self.format_time(time)
    time ||= Time.now
    time.strftime('%Y-%m-%d %H:%M')
  end
end
