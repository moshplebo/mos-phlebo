# == Schema Information
#
# Table name: contacts
#
#  id         :integer          not null, primary key
#  metadata   :jsonb            not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Contact < ApplicationRecord
  def frontend
    data = {}
    data[:main_url] = metadata['main_url']
    data[:first_url] = metadata['first_url']
    data[:middle_url] = metadata['middle_url']
    data[:last_url] = metadata['last_url']
    data[:head1] = metadata['head1']
    data[:head2] = metadata['head2']
    data[:head3] = metadata['head3']
    data[:biography] = metadata['content']
    data[:social_vk] = metadata['social_vk']
    data[:social_fb] = metadata['social_fb']
    data[:social_ok] = metadata['social_ok']
    data[:social_ig] = metadata['social_ig']
    data
  end

  def admin_frontend
    data = {}
    data[:main_url] = metadata['main_url']
    data[:first_url] = metadata['first_url']
    data[:middle_url] = metadata['middle_url']
    data[:last_url] = metadata['last_url']
    data[:head1] = metadata['head1']
    data[:head2] = metadata['head2']
    data[:head3] = metadata['head3']
    data[:content] = metadata['content']
    data[:social_vk] = metadata['social_vk']
    data[:social_fb] = metadata['social_fb']
    data[:social_ok] = metadata['social_ok']
    data[:social_ig] = metadata['social_ig']
    data[:control_url] = '/admin/contacts'
    data
  end
end
