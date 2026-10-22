class CreateQuestions < ActiveRecord::Migration[8.1]
  def change
    create_table :questions do |t|
      t.references :document, null: false, foreign_key: true
      t.text :question, null: false
      t.text :answer

      t.timestamps
    end
  end
end
