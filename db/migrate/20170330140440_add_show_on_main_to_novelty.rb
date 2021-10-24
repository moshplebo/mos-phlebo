class AddShowOnMainToNovelty < ActiveRecord::Migration[5.0]
  def change
    add_column :novelties, :show_on_main, :boolean, default: false
  end
end
