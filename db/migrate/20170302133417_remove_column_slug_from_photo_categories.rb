class RemoveColumnSlugFromPhotoCategories < ActiveRecord::Migration[5.0]
  def change
    remove_column :photo_categories, :slug, :string
  end
end
