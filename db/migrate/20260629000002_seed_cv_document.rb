require "json"

# Initial data migration: stores the English curriculum vitae document, loading
# its JSON Schema and data from the files kept under public_backup/.
class SeedCvDocument < ActiveRecord::Migration[8.1]
  def up
    schema_path = Rails.root.join("public_backup", "data_schema.json")
    data_path = Rails.root.join("public_backup", "data.json")

    json_schema = JSON.parse(File.read(schema_path))
    json_data = JSON.parse(File.read(data_path))

    Document.reset_column_information
    Document.create!(
      name: "Curriculum Vitae",
      language: "en",
      json_schema: json_schema,
      json_data: json_data
    )
  end

  def down
    Document.where(name: "Curriculum Vitae", language: "en").delete_all
  end
end
