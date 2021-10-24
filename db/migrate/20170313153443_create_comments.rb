class CreateComments < ActiveRecord::Migration[5.0]
  def change
    create_table :comments do |t|
      t.string :fio
      t.text :text

      t.date :date

      t.timestamps
    end
  end
end
