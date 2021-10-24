# == Schema Information
#
# Table name: prices
#
#  id         :integer          not null, primary key
#  position   :integer
#  cost       :integer
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Price < ApplicationRecord
  default_scope { order('position') }

  def frontend
    data = {}
    data[:id] = id
    data[:name] = name
    data[:cost] = cost == 0 ? 'бесплатно' : "#{cost} р."
    data
  end

  def admin_frontend
    data = {}
    data[:id] = id
    data[:name] = name
    data[:cost] = cost
    data[:position] = position
    data[:control_url] = "/admin/prices/#{id}"
    data
  end

  def prev_price
    Price.where('position<?', position).last
  end

  def next_price
    Price.where('position>?', position).first
  end
end
