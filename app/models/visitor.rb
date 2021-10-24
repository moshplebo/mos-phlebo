# == Schema Information
#
# Table name: visitors
#
#  id         :integer          not null, primary key
#  online     :datetime
#  metadata   :jsonb            not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Visitor < ApplicationRecord
  include VisitorBase
end
