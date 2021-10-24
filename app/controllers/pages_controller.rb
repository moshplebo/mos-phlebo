class PagesController < ApplicationController

  def show
    page = page_by_material_path

    if page.nil?
      not_found
      return
    end

    @data.deep_merge!(page.frontend)
  end

  private

  def page_by_material_path
    url = @data[:url].gsub(/\?.*$/, '')
    url.gsub!(/\/+\Z/, '') unless url == '/'
    Page.find_by(material_path: url)
  end
end
