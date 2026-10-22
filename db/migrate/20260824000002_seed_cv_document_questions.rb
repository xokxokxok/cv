require "json"

class SeedCvDocumentQuestions < ActiveRecord::Migration[8.1]
  def up
    Question.reset_column_information

    cv_document = Document.find_by(name: "Curriculum Vitae", language: "en")

    questions_path = Rails.root.join("db", "seeds", "questions.json")
    questions = JSON.parse(File.read(questions_path)).dig('questions') || []

    questions.each do |question|
      Question.create!(
        document: cv_document,
        question: question['question'],
        answer: question['answer']
      )
    end
  end

  def down
    Question.all.delete_all
    Question.reset_column_information
  end
end
