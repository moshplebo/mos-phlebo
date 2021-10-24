require_relative 'boot'

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module MosPhlebo
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true

    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Flash

    config.encoding = 'utf-8'
    config.i18n.enforce_available_locales = false
    config.i18n.default_locale = :ru
    config.time_zone = 'Moscow'

    config.company_name = 'Флеболог Калачев'

    config.cache_store = :redis_store, 'redis://localhost:6379/0/cache', { expires_in: 10.minutes }
    config.active_job.queue_adapter = :sidekiq

    config.action_mailer.perform_deliveries = true
    config.action_mailer.raise_delivery_errors = true

    config.action_mailer.delivery_method = :smtp

    config.action_mailer.smtp_settings = {
      tls: true,
      address: "smtp.yandex.ru",
      authentication: 'plain',
      port: 465,
      ssl: true,
      user_name: "no-reply@mos-phlebo.ru",
      password: "admin312",
    }
  end
end
