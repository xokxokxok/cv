class Question < ApplicationRecord
  belongs_to :document

  validates :question, presence: true
end
