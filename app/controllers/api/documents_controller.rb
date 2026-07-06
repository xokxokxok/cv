module Api
  class DocumentsController < ApplicationController
    skip_before_action :verify_authenticity_token, raise: false
    before_action :set_document, only: [:show, :update, :destroy]

    rescue_from ActiveRecord::RecordNotFound do
      render json: { error: "Document not found" }, status: :not_found
    end

    def index
      render json: Document.order(:id)
    end

    def show
      render json: @document
    end

    def create
      document = Document.new(document_params)
      if document.save
        render json: document, status: :created
      else
        render json: { errors: document.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @document.update(document_params)
        render json: @document
      else
        render json: { errors: @document.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @document.destroy
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
