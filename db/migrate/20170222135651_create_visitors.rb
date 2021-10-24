class CreateVisitors < ActiveRecord::Migration[5.0]
  def change

    create_table :visitors do |t|

      t.datetime :online
      t.jsonb :metadata, null: false, default: {}
      t.timestamps

    end

    add_index :visitors, :metadata, using: :gin

  end
end
