# Removes the published files under ./deploy/public when a document is destroyed.
class DeleteDocumentFilesJob < ApplicationJob
  queue_as :default

  def perform
    FileUtils.rm_f([ Document::PUBLISHED_SCHEMA_PATH, Document::PUBLISHED_DATA_PATH ])
  end
end
