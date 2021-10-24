class CreatePrices < ActiveRecord::Migration[5.0]
  def change
    create_table :prices do |t|
      t.integer :position
      t.integer :cost

      t.string :name

      t.timestamps
    end
  end
end
