class RemoveColumnShortDescriptionFromArticles < ActiveRecord::Migration[5.0]
  def change
    remove_column :articles, :short_description, :text
  end
end
