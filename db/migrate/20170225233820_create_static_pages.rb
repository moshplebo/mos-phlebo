class CreateStaticPages < ActiveRecord::Migration[5.0]
  def change
    create_table :static_pages do |t|
      t.string :slug
      t.string :name
      t.string :content

      t.integer :parent_id, null: true, index: true
      t.integer :lft, null: false, index: true
      t.integer :rgt, null: false, index: true
      t.integer :depth, null: false, default: 0

      t.timestamps
    end
  end
end
