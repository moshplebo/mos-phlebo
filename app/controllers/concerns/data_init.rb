module DataInit
  extend ActiveSupport::Concern

  included do
    before_action :init_data
  end

  def init_data
    @data = Hashie::Mash.new
    @browser = Browser.new(request.user_agent, accept_language: request.env['HTTP_ACCEPT_LANGUAGE'])
    @data[:lеgacy] = !!@browser.ie?(['<10'])
    @data[:layout] = 'PublicLayout'
    @data[:now] = Time.now.to_i.to_s
    @data[:url] = request.path.gsub(/^\/index\.json/, '/').gsub(/\.json/, '')
    @data[:url] += '?' + request.query_string unless request.query_string.blank?
    @data[:canonical_url] = Rails.application.config.default_host + @data[:url]
    @data[:error] = false

    if Rails.env.production?
      @data[:assets_version] = `cat #{Rails.root}/public/webpack/manifest.json | md5sum`.squish.gsub('  -', '')
    else
      @data[:assets_version] = File.mtime(Dir.glob("#{Rails.root}/app/views/**/*").max_by { |f| File.mtime(f) })
    end

    @data[:current_user] = nil
    @data[:title] = 'Флеболог Калачев'
    @data[:content] = nil
  end
end
