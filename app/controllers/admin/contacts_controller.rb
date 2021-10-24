class Admin::ContactsController < Admin::BaseController
  before_action :set_view
  before_action :find_contact

  def edit
    @data[:h1] = 'Главная страница'
    @data[:form] = @contact.admin_frontend
  end

  def update
    @contact.attributes = contact_params

    if @contact.save
      index_frontend
      @data[:success] = 'Главная страница обновлена'
      @data[:url] = '/admin/contacts'
      @data[:form] = @contact.admin_frontend
    else
      set_error(@contact)
    end
  end

  private

  def set_view
    @data[:view] = 'AdminContactsView'
  end

  def find_contact
    @contact = Contact.first
    not_found if @contact.blank?
  end

  def index_frontend
    @data[:h1] = 'Главная страница'
    @data[:action] = 'edit'
    @data[:contacts] = Contact.first.admin_frontend
  end

  def contact_params
    params.require(:contact).permit(metadata: [:first_url, :middle_url, :last_url, :main_url,
                                               :head1, :head2, :head3, :content, :social_vk, :social_fb, :social_ok, :social_ig])
  end
end
