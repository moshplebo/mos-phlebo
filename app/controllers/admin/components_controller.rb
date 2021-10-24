class Admin::ComponentsController < Admin::BaseController
  before_action :set_page, except: :index

  def index
    index_frontend
  end

  def move_up
    if Page.where(parent_id: @page.parent_id).where('lft<?', @page.lft).first
      unless @page.move_left
        render json: { error: @page.errors.full_messages.join('</br>') }
      end
    end

    index_frontend
    @data[:url] = admin_pages_url
  end

  def move_down
    if Page.where(parent_id: @page.parent_id).where('rgt>?', @page.rgt).first
      unless @page.move_right
        render json: { error: @page.errors.full_messages.join('</br>') }
      end
    end

    index_frontend
    @data[:url] = admin_pages_url
  end

  def update
    if @page.save
      index_frontend
      @data[:url] = admin_pages_url
    else
      render json: { error: @page.errors.full_messages.join('<br/>') }
    end
  end

  private

  def page_params
    params[:page].permit(:show_in_menu)
  end

  def set_page
    @page = Page.find_by(id: params[:id])
  end

  def index_frontend
    @data[:view] = 'AdminPagesView'
    @data[:pages] = Page.admin_menu.map(&:admin_frontend)
  end
end
