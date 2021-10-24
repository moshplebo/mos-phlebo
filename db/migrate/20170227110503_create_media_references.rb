class CreateMediaReferences < ActiveRecord::Migration[5.0]
  def change
    create_table :media_references do |t|
      t.integer :media_file_id, null: false
      t.integer :position

      t.integer :referrer_id
      t.string  :referrer_type

      t.timestamps
    end
  end
end
