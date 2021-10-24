class CreateContacts < ActiveRecord::Migration[5.0]
  def change
    create_table :contacts do |t|
      t.jsonb :metadata, null: false, default: {}
      t.timestamps
    end
  end
end
