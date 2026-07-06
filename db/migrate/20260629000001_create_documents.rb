class CreateDocuments < ActiveRecord::Migration[8.1]
  def change
    create_table :documents do |t|
      t.string :name
      t.string :language
      t.jsonb :json_schema
      t.jsonb :json_data

      t.timestamps
    end
  end
end
