class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|

      t.string :email, null: false, default: ""
      t.string :password_digest, null: false, default: ""

      t.string :last_name
      t.string :first_name
      t.string :father_name
      t.string :phone

      t.integer :role, default: 0, null: false

      # auth by token
      t.string :access_token

      # reset password
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      # email confirmation
      t.string   :confirmation_token
      t.datetime :confirmation_sent_at
      t.datetime :confirmed_at

      # brute force protection
      t.integer  :failed_attempts, default: 0, null: false
      t.string   :unlock_token
      t.datetime :locked_at

      # activate user
      t.datetime :activated_at
      t.integer :activated_by

      # block user
      t.datetime :blocked_at
      t.integer :blocked_by

      t.datetime :online

      t.jsonb :metadata, null: false, default: {}

      t.timestamps null: false

    end

    add_index :users, :email,                unique: true
    add_index :users, :reset_password_token, unique: true
    add_index :users, :confirmation_token,   unique: true
    add_index :users, :unlock_token,         unique: true
    add_index :users, :access_token,         unique: true
    add_index :users, :metadata, using: :gin

  end
end
