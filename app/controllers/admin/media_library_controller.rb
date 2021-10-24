class Admin::MediaLibraryController < Admin::BaseController
  before_action :set_folder, except: [:index, :trash, :restore_file, :destroy_file]
  before_action :set_view

  def index
    @data[:root_folders] = MediaFolder.where(depth: 0).map(&:frontend)
    @data[:root_folders] << trash_frontend
  end

  def show
    @data[:folder] = @folder.frontend
  end

  def trash
    @data[:action] = 'show'
    @data[:h1] = 'Корзина'
    @data[:folder] = trash_frontend
  end

  def create
    params[:media_library][:files].each do |file_params|
      file_name = file_params.original_filename.gsub(/\.[^\.]*\Z/, '').first(39)
      mfs = MediaFile.trash.where(name: file_name, type: @folder.file_type)
      if mfs.any?
        mfs.each do |mf|
          mf.trash = false
          mf.media_folder = @folder
          @data[:error] = file.errors.full_messages.join('<br>') unless mf.save
        end
      else
        next if MediaFile.find_by(type: @folder.file_type, name: file_name, media_folder_id: @folder.id)
        file = MediaFile.new(type: @folder.file_type, file: file_params, media_folder_id: @folder.id)
        @data[:error] = file.errors.full_messages.join('<br>') unless file.save
      end
    end

    @data[:action] = 'show'
    @data[:folder] = @folder.frontend
  end

  def create_folder
    new_folder = @folder.initialize_child
    @data[:error] = new_folder.errors.full_messages.join('<br>') unless new_folder.save

    @data[:action] = 'show'
    @data[:folder] = @folder.frontend
    @data[:folder][:new_folder_id] = new_folder.id
  end

  def update_file
    file = MediaFile.find(params[:id])
    file.attributes = file_params

    @data[:error] = file.errors.full_messages.join('<br>') unless file.save
    @data[:action] = 'show'
    @data[:folder] = @folder.frontend
  end

  def update_folder
    child = MediaFolder.find(params[:id])

    child.attributes = folder_params

    @data[:error] = child.errors.full_messages.join('<br>') unless child.save
    @data[:action] = 'show'
    @data[:folder] = @folder.frontend
  end

  def delete_folder
    child = @folder.children.find(params[:id])

    @data[:error] = child.errors.full_messages.join('<br>') unless child.destroy

    @data[:action] = 'show'
    @folder.reload
    @data[:folder] = @folder.frontend
  end

  # Moves file to trash
  def delete_file
    file = @folder.media_files.find(params[:id])

    @data[:error] = file.errors.full_messages.join('<br>') unless file.update(trash: true)

    @data[:action] = 'show'
    @folder.reload
    @data[:folder] = @folder.frontend
  end

  def restore_file
    file = MediaFile.trash.find(params[:id])

    file.media_folder = MediaFolder.where(depth: 0).find_by(file_type: file.type) if file.media_folder.blank?

    @data[:error] = file.errors.full_messages.join('<br>') unless file.update(trash: false)
    trash
  end

  def destroy_file
    file = MediaFile.trash.find(params[:id])

    @data[:error] = file.errors.full_messages.join('<br>') unless file.destroy
    trash
  end

  private

  def set_folder
    @folder = MediaFolder.find_by(path: params[:path])
    unless @folder.blank?
      @data[:url] = @folder.src
      return
    end

    not_found
    default_render
  end

  def set_view
    @data[:view] = 'AdminMediaLibraryView'
    @data[:h1] = 'Медиа библиотека'
    @data[:urls] = {
        current: @data[:url],
        create_folder: admin_create_media_folder_path,
        update_file: admin_update_media_file_path,
        update_folder: admin_update_media_folder_path,
        delete_file: admin_delete_media_file_path,
        delete_folder: admin_delete_media_folder_path,
        restore_file: admin_restore_media_file_path,
        destroy_file: admin_destroy_media_file_path
    }
  end

  def trash_frontend
    {
        id: 0,
        name: 'Корзина',
        path: 'trash',
        src: '/admin/media_library/trash',
        icon: 'trash',
        files: MediaFile.library.trash.map(&:frontend),
        trash: true
    }
  end

  def file_params
    params.permit(:id, :name, :media_folder_id)
  end

  def folder_params
    params.permit(:id, :name, :parent_id)
  end
end
