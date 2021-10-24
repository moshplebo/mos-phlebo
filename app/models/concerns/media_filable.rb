module MediaFilable
  extend ActiveSupport::Concern

  included do
    def update_file_ids(file_ids:, field: '')
      return if file_ids.blank?

      field = field.try(:to_s)
      field_ids = field.blank? ? 'media_file_ids' : "#{field}_ids"

      file_ids.map!(&:to_i).select!(&:nonzero?)
      return if file_ids == send(field_ids)

      transaction do
        if field.blank?
          media_references.destroy_all
        else
          field_values = send(field.pluralize)
          mr_ids = []
          field_values.each { |fv| mr_ids += fv.media_references.pluck(:id) }
          MediaReference.where(id: mr_ids.uniq).destroy_all
        end

        file_ids.each_with_index do |file_id, position|
          MediaReference.create!(
              media_file_id: file_id,
              referrer_id: id,
              referrer_type: self.class.to_s,
              position: position
          )
        end

        save!
      end
    end
  end
end
