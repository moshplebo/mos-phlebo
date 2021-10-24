class CreateCollections < ActiveRecord::Migration[5.0]
  def change
    create_table :collections do |t|
      t.string :name
      t.string :slug
      t.string :collectionable_type

      t.timestamps
    end
  end
end
