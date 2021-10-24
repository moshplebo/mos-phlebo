module Visitors
  extend ActiveSupport::Concern

  included do
    before_action :init_visitor
  end

  def init_visitor
    cookies[:csrfToken] = { value: SecureRandom.uuid, expires: 1.year.from_now } unless cookies[:csrfToken]

    if request.user_agent
      browser = Browser.new(request.user_agent, accept_language: request.env['HTTP_ACCEPT_LANGUAGE'])
      if !browser.bot? && !(/(wget|slurp|bot|crawler|spider)/.match request.user_agent.downcase)

        create_visitor if @visitor.nil? && load_visitor.nil?
        set_cookie if @visitor.online < 1.day.ago

        @visitor.metadata['user_agent'] = request.user_agent
        @visitor.metadata['accept_language'] = request.env['HTTP_ACCEPT_LANGUAGE']

        @visitor.add_user(current_user.id) if current_user

        @visitor.online = Time.now if @visitor.online < 1.minute.ago

        @visitor.save if @visitor.changed?

      end
    end
  end

  def load_visitor
    unless cookies.encrypted[:visitor].nil?
      @visitor = Visitor.where(id: cookies.encrypted[:visitor].to_i).first
    end
    @visitor
  end

  def create_visitor
    @visitor = Visitor.new
    @visitor.online = Time.now
    @visitor.metadata['user_agent'] = request.user_agent
    @visitor.metadata['accept_language'] = request.env['HTTP_ACCEPT_LANGUAGE']
    @visitor.save!
    set_cookie
  end

  def set_cookie
    cookies.encrypted[:visitor] = { value: @visitor.id, expires: 1.year.from_now }
  end
end
