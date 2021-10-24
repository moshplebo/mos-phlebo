class CreatePhotos < ActiveRecord::Migration[5.0]
  def change
    create_table :photos do |t|
      t.integer :photo_category_id
      t.integer :position

      t.jsonb :metadata, null: false, default: {}
      t.timestamps
    end

    add_index :photos, :metadata, using: :gin
  end
end
