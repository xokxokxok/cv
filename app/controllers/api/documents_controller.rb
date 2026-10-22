module Api
  class DocumentsController < ApplicationController
    skip_before_action :verify_authenticity_token, raise: false
    before_action :set_document, only: [:show, :update, :destroy]

    rescue_from ActiveRecord::RecordNotFound do
      render json: { error: "Document not found" }, status: :not_found
    end

    rescue_from ActiveRecord::RecordInvalid, ActiveRecord::RecordNotDestroyed do |error|
      render json: { errors: error.record.errors.full_messages }, status: :unprocessable_entity
    end

    def index
      render json: Document.order(:id)
    end

    def show
      render json: @document
    end

    # Each write runs in a transaction together with the job enqueue: if the job
    # can't be enqueued (e.g. Redis is down) the database change is rolled back,
    # so the record and the published files don't drift apart.
    def create
      document = Document.new(document_params)
      Document.transaction do
        document.save!
        WriteDocumentFilesJob.perform_later(document.json_schema, document.json_data)
      end
      render json: document, status: :created
    end

    def update
      Document.transaction do
        @document.update!(document_params)
        WriteDocumentFilesJob.perform_later(@document.json_schema, @document.json_data)
      end
      render json: @document
    end

    def destroy
      Document.transaction do
        @document.destroy!
        DeleteDocumentFilesJob.perform_later
      end
      head :no_content
    end

    private

    def set_document
      @document = Document.find(params[:id])
    end

    # json_schema and json_data hold arbitrary JSON, so permit the whole
    # document payload and keep only the known top-level attributes.
    def document_params
      params.require(:document).permit!.to_h.slice("name", "language", "json_schema", "json_data")
    end
  end
end
