class AddMetaTags < ActiveRecord::Migration[5.0]
  def change
    add_column :static_pages, :title, :string
    add_column :static_pages, :meta_description, :string
    add_column :static_pages, :meta_keywords, :string

    add_column :articles, :title, :string
    add_column :articles, :meta_description, :string
    add_column :articles, :meta_keywords, :string

    add_column :healings, :title, :string
    add_column :healings, :meta_description, :string
    add_column :healings, :meta_keywords, :string

    add_column :novelties, :title, :string
    add_column :novelties, :meta_description, :string
    add_column :novelties, :meta_keywords, :string
  end
end
