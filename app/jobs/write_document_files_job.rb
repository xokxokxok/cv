# Overwrites the published files under ./deploy/public with a document's
# JSON Schema and data.
#
# The content is passed as arguments (instead of a document id) because the job
# is enqueued inside the controller transaction, before the commit: reading the
# record from the database here could return the previous version.
class WriteDocumentFilesJob < ApplicationJob
  queue_as :default

  def perform(json_schema, json_data)
    write_json(Document::PUBLISHED_SCHEMA_PATH, json_schema)
    write_json(Document::PUBLISHED_DATA_PATH, json_data)
  end

  private

  def write_json(path, content)
    FileUtils.mkdir_p(path.dirname)
    File.write(path, "#{JSON.pretty_generate(content)}\n")
  end
end
