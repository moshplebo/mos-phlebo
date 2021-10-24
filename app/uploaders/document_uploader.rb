class DocumentUploader < MediaFileUploader
  def extension_whitelist
    %w(doc docx xls xlsx pdf odt ods csv rtf pptx txt)
  end
end
