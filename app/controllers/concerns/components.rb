module Components
  extend ActiveSupport::Concern

  included do
    def create_components(object)
      return unless params[:components].present?

      params[:components].permit!
      params[:components].each do |_id, attrs|
        next if should_destroy(attrs)
        object.components << Component.new(attrs)
      end
    end

    def set_components_attributes(object)
      return if params[:components].blank?

      params[:components].permit!
      positions_ids = {}

      params[:components].each do |id, attrs|
        component = Component.find_by(id: id)
        if should_destroy(attrs)
          component.try(:destroy)
          next
        elsif component.nil?
          component = Component.new(attrs)

          object.components << component
        elsif attrs['kind'] == 'wrapper_block'
          component.update_file_ids(file_ids: attrs[:media_file_ids])
          component.attributes = attrs
          component.save if component.changed?
        elsif attrs.key?(:media_file_ids)
          component.update_file_ids(file_ids: attrs[:media_file_ids])
        else
          component.attributes = attrs
          component.save if component.changed?
        end

        positions_ids[component.id] = { position: attrs[:position] } if attrs.key?(:position)
      end
      Component.update(positions_ids.keys, positions_ids.values)
    end

  end

  private

  def should_destroy(attrs)
    attrs.key?(:_marked_for_destruction) ||
      (!attrs[:kind] || attrs[:kind].blank?) ||
      (attrs.key?(:metadata) && attrs[:metadata]['content'].blank? && attrs[:kind] == 'wysiwyg_block') ||
      (attrs.key?(:media_file_ids) && attrs[:media_file_ids].delete_if(&:blank?).blank? &&
        attrs[:kind] == 'gallery_block') ||
      (((attrs.key?(:metadata) && attrs[:metadata]['content'].blank?) || (attrs.key?(:media_file_ids) &&
        attrs[:media_file_ids].delete_if(&:blank?).blank?)) && attrs[:kind] == 'wrapper_block')
  end
end
