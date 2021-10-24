class CreateHealings < ActiveRecord::Migration[5.0]
  def change
    create_table :healings do |t|
      t.string :name
      t.string :slug

      t.jsonb :metadata, null: false, default: {}

      t.timestamps
    end
  end
end
