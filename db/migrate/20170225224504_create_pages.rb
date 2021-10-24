class CreatePages < ActiveRecord::Migration[5.0]
  def change
    create_table :pages do |t|
      t.boolean :active, null: false, default: false

      t.integer :parent_id, null: true, index: true
      t.integer :lft, null: false, index: true
      t.integer :rgt, null: false, index: true
      t.integer :depth, null: false, default: 0

      t.string :name
      t.string :slug
      t.string :material_path

      t.string :name
      t.string :title
      t.string :h1
      t.string :meta_description
      t.string :meta_keywords
      t.string :meta_robots

      t.string :kind

      t.jsonb :metadata, null: false, default: {}

      t.timestamps
    end

    add_index :pages, :metadata, using: :gin
  end
end
