class DocumentsController < ApplicationController
  def index
    render json: Document.all
  end

  def show
    render json: Document.find(params[:id])
  end
end
