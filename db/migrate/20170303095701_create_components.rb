class CreateComponents < ActiveRecord::Migration[5.0]
  def change
    create_table :components do |t|
      t.integer :componentable_id
      t.string :componentable_type

      t.integer :kind
      t.integer :position, default: 0

      t.jsonb :metadata, null: false, default: {}

      t.timestamps
    end
    add_index :components, :metadata, using: :gin
  end
end
