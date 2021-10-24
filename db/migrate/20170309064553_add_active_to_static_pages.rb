class AddActiveToStaticPages < ActiveRecord::Migration[5.0]
  def change
    add_column :static_pages, :active, :boolean, default: true
  end
end
