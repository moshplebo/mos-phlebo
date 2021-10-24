class CreateArticles < ActiveRecord::Migration[5.0]
  def change
    create_table :articles do |t|
      t.string :name
      t.string :slug
      t.text :short_description

      t.jsonb :metadata, null: false, default: {}

      t.datetime :published_at
      t.timestamps
    end
  end
end
