class CreateMediaFolders < ActiveRecord::Migration[5.0]
  def change
    create_table :media_folders do |t|
      # Awesome nested sets fields
      t.integer :parent_id, null: true, index: true
      t.integer :lft, null: false, index: true
      t.integer :rgt, null: false, index: true
      t.integer :depth, null: false, default: 0

      t.integer :media_files_count, null: false, default: 0

      t.string :name
      t.string :file_type
      t.string :slug
      t.string :path

      t.timestamps
    end

    add_index :media_folders, :path, unique: true
  end
end
