class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  include ActionController::Cookies
  include DataInit
  include RenderLogic
  include Csrf
  include Visitors
  include Users

  before_action :set_data

  def set_data
    set_menu
    @data[:slider] = Banner.all.map(&:frontend)
  end

  private

  def set_menu
    @data[:top_menu] = []
    @data[:footer_menu] = {}
    @data[:drawer_menu] = {}

    pages = {}

    Page.menu.each do |page|
      if page.slug == 'novelties'
        @data[:footer_menu][page.slug] = {id: page.id, text: page.name, href: page.material_path, childs: []}
        next
      end

      childs = []
      pages[page.id] = {href: page.material_path, text: page.name, childs: []}
      page.children.each do |ch|
        childs << {id: ch.id, text: ch.name, href: ch.material_path, childs: []}
        pages[page.id][:childs] << {href: ch.material_path, text: ch.name}
      end
      @data[:top_menu] << {id: page.id, text: page.name, href: page.material_path, childs: childs}
      @data[:footer_menu][page.slug] = {id: page.id, text: page.name, href: page.material_path,
                                        childs: childs}
    end

    @data[:drawer_menu] = pages.values
  end
end
