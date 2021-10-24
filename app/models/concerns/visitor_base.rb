module VisitorBase
  extend ActiveSupport::Concern

  def add_user(user_id)
    metadata['users'] ||= []
    metadata['users'] << user_id unless metadata['users'].include?(user_id)
  end
end
