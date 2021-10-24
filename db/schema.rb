# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170426064203) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "articles", force: :cascade do |t|
    t.string   "name"
    t.string   "slug"
    t.jsonb    "metadata",         default: {}, null: false
    t.datetime "published_at"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.string   "title"
    t.string   "meta_description"
    t.string   "meta_keywords"
  end

  create_table "banners", force: :cascade do |t|
    t.text     "header"
    t.text     "text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "collections", force: :cascade do |t|
    t.string   "name"
    t.string   "slug"
    t.string   "collectionable_type"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
  end

  create_table "comments", force: :cascade do |t|
    t.string   "fio"
    t.text     "text"
    t.date     "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "components", force: :cascade do |t|
    t.integer  "componentable_id"
    t.string   "componentable_type"
    t.integer  "kind"
    t.integer  "position",           default: 0
    t.jsonb    "metadata",           default: {}, null: false
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.index ["metadata"], name: "index_components_on_metadata", using: :gin
  end

  create_table "contacts", force: :cascade do |t|
    t.jsonb    "metadata",   default: {}, null: false
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  create_table "healings", force: :cascade do |t|
    t.string   "name"
    t.string   "slug"
    t.jsonb    "metadata",         default: {}, null: false
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.string   "title"
    t.string   "meta_description"
    t.string   "meta_keywords"
  end

  create_table "media_files", force: :cascade do |t|
    t.integer  "media_folder_id"
    t.string   "type"
    t.string   "name"
    t.string   "file"
    t.string   "checksum"
    t.jsonb    "metadata"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.boolean  "trash",           default: false, null: false
  end

  create_table "media_folders", force: :cascade do |t|
    t.integer  "parent_id"
    t.integer  "lft",                           null: false
    t.integer  "rgt",                           null: false
    t.integer  "depth",             default: 0, null: false
    t.integer  "media_files_count", default: 0, null: false
    t.string   "name"
    t.string   "file_type"
    t.string   "slug"
    t.string   "path"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.index ["lft"], name: "index_media_folders_on_lft", using: :btree
    t.index ["parent_id"], name: "index_media_folders_on_parent_id", using: :btree
    t.index ["path"], name: "index_media_folders_on_path", unique: true, using: :btree
    t.index ["rgt"], name: "index_media_folders_on_rgt", using: :btree
  end

  create_table "media_references", force: :cascade do |t|
    t.integer  "media_file_id", null: false
    t.integer  "position"
    t.integer  "referrer_id"
    t.string   "referrer_type"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "novelties", force: :cascade do |t|
    t.string   "name"
    t.string   "slug"
    t.jsonb    "metadata",         default: {},    null: false
    t.datetime "published_at"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.boolean  "show_on_main",     default: false
    t.string   "title"
    t.string   "meta_description"
    t.string   "meta_keywords"
  end

  create_table "pages", force: :cascade do |t|
    t.boolean  "active",           default: false, null: false
    t.integer  "parent_id"
    t.integer  "lft",                              null: false
    t.integer  "rgt",                              null: false
    t.integer  "depth",            default: 0,     null: false
    t.string   "name"
    t.string   "slug"
    t.string   "material_path"
    t.string   "title"
    t.string   "h1"
    t.string   "meta_description"
    t.string   "meta_keywords"
    t.string   "meta_robots"
    t.string   "kind"
    t.jsonb    "metadata",         default: {},    null: false
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.integer  "main_object_id"
    t.string   "main_object_type"
    t.index ["lft"], name: "index_pages_on_lft", using: :btree
    t.index ["metadata"], name: "index_pages_on_metadata", using: :gin
    t.index ["parent_id"], name: "index_pages_on_parent_id", using: :btree
    t.index ["rgt"], name: "index_pages_on_rgt", using: :btree
  end

  create_table "photo_categories", force: :cascade do |t|
    t.integer  "position"
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "photos", force: :cascade do |t|
    t.integer  "photo_category_id"
    t.integer  "position"
    t.jsonb    "metadata",          default: {}, null: false
    t.datetime "created_at",                     null: false
    t.datetime "updated_at",                     null: false
    t.index ["metadata"], name: "index_photos_on_metadata", using: :gin
  end

  create_table "prices", force: :cascade do |t|
    t.integer  "position"
    t.integer  "cost"
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "static_pages", force: :cascade do |t|
    t.string   "slug"
    t.string   "name"
    t.string   "content"
    t.integer  "parent_id"
    t.integer  "lft",                             null: false
    t.integer  "rgt",                             null: false
    t.integer  "depth",            default: 0,    null: false
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.boolean  "active",           default: true
    t.string   "title"
    t.string   "meta_description"
    t.string   "meta_keywords"
    t.index ["lft"], name: "index_static_pages_on_lft", using: :btree
    t.index ["parent_id"], name: "index_static_pages_on_parent_id", using: :btree
    t.index ["rgt"], name: "index_static_pages_on_rgt", using: :btree
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "password_digest",        default: "", null: false
    t.string   "last_name"
    t.string   "first_name"
    t.string   "father_name"
    t.string   "phone"
    t.integer  "role",                   default: 0,  null: false
    t.string   "access_token"
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.string   "confirmation_token"
    t.datetime "confirmation_sent_at"
    t.datetime "confirmed_at"
    t.integer  "failed_attempts",        default: 0,  null: false
    t.string   "unlock_token"
    t.datetime "locked_at"
    t.datetime "activated_at"
    t.integer  "activated_by"
    t.datetime "blocked_at"
    t.integer  "blocked_by"
    t.datetime "online"
    t.jsonb    "metadata",               default: {}, null: false
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.index ["access_token"], name: "index_users_on_access_token", unique: true, using: :btree
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true, using: :btree
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["metadata"], name: "index_users_on_metadata", using: :gin
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true, using: :btree
  end

  create_table "visitors", force: :cascade do |t|
    t.datetime "online"
    t.jsonb    "metadata",   default: {}, null: false
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.index ["metadata"], name: "index_visitors_on_metadata", using: :gin
  end

end
