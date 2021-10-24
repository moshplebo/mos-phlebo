class AddColumnTrashToMediaFile < ActiveRecord::Migration[5.0]
  def change
    add_column :media_files, :trash, :boolean, null: false, default: false
  end
end
