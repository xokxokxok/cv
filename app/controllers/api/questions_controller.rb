module Api
  class QuestionsController < ApplicationController
    skip_before_action :verify_authenticity_token, raise: false
    before_action :set_document, only: [:index, :create]
    before_action :set_question, only: [:show, :update, :destroy]

    rescue_from ActiveRecord::RecordNotFound do
      render json: { error: "Record not found" }, status: :not_found
    end

    # Questions are always scoped to a document, so there is no generic index.
    def index
      render json: @document.questions.order(:id)
    end

    def show
      render json: @question
    end

    def create
      question = @document.questions.new(question_params)
      if question.save
        render json: question, status: :created
      else
        render json: { errors: question.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      if @question.update(question_params)
        render json: @question
      else
        render json: { errors: @question.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
      @question.destroy
      head :no_content
    end

    private

    def set_document
      @document = Document.find(params[:document_id])
    end

    def set_question
      @question = Question.find(params[:id])
    end

    def question_params
      params.require(:question).permit(:question, :answer)
    end
  end
end
