class CreateMediaFiles < ActiveRecord::Migration[5.0]
  def change
    create_table :media_files do |t|
      t.integer :media_folder_id

      t.string :type
      t.string :name
      t.string :file
      t.string :checksum

      t.jsonb :metadata

      t.timestamps
    end
  end
end
