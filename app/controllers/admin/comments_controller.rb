class Admin::CommentsController < Admin::BaseController
  before_action :set_view
  before_action :find_comment, except: [:index, :new, :create]

  def index
    index_frontend
  end

  def new
    @data[:h1] = 'Добавление отзыва'
    @data[:controls] << { href: '/admin/comments', text: 'Отмена', icon: 'close-circle' }
    @data[:form] = Comment.new.admin_frontend
  end

  def edit
    @data[:h1] = 'Редактирование отзыва'
    @data[:controls] << { href: '/admin/comments', text: 'Отмена', icon: 'close-circle' }
    @data[:form] = @comment.admin_frontend
  end

  def create
    comment = Comment.new(comment_params)
    comment.media_file_id = params[:comment][:media_file_id]

    if comment.save
      index_frontend
      @data[:success] = 'Отзыв успешно добавлен'
      @data[:url] = admin_comments_url
    else
      render json: { error: comment.errors.full_messages.join('<br/>') }
    end
  end

  def update
    @comment.attributes = comment_params
    @comment.media_file_id = params[:comment][:media_file_id]

    if @comment.save
      index_frontend
      @data[:success] = 'Отзыв успешно обновлен'
      @data[:url] = admin_comments_url
    else
      render json: { error: @comment.errors.full_messages.join('<br/>') }
    end
  end

  def destroy
    if @comment.destroy
      index_frontend
      @data[:success] = 'Отзыв успешно удален'
      @data[:url] = admin_comments_url
    else
      render json: { error: @commment.errors.full_messages.join('<br/>') }
    end
  end

  private

  def set_view
    @data[:view] = 'AdminCommentsView'
  end

  def find_comment
    @comment = Comment.find(params[:id])
    not_found if @comment.blank?
  end

  def index_frontend
    @data[:h1] = 'Отзывы'
    @data[:action] = 'index'
    @data[:comments] = Comment.includes(:media_file).order(:date).map(&:admin_frontend)
    @data[:controls] << { href: '/admin/comments/new', text: 'Добавить отзыв', icon: 'plus-box' }
  end

  def comment_params
    params.require(:comment).permit(:fio, :text, :date, :media_file_id)
  end
end
