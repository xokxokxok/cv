class Document < ApplicationRecord
  # Files published to Firebase Hosting and read by ./deploy/public/index.html.
  PUBLISHED_SCHEMA_PATH = Rails.root.join("deploy", "public", "data_schema.json")
  PUBLISHED_DATA_PATH = Rails.root.join("deploy", "public", "data.json")

  has_many :questions, dependent: :destroy

  validates :name, presence: true
  validates :language, presence: true
end
