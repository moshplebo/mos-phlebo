class CreatePhotoCategories < ActiveRecord::Migration[5.0]
  def change
    create_table :photo_categories do |t|
      t.integer :position

      t.string :name
      t.string :slug

      t.timestamps
    end
  end
end
