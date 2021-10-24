class AddMainObjectToPages < ActiveRecord::Migration[5.0]
  def change
    add_column :pages, :main_object_id, :integer
    add_column :pages, :main_object_type, :string
  end
end
