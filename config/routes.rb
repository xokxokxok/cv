require "sidekiq/web"

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Sidekiq dashboard (queues, processed/failed jobs). No authentication: the app
  # only runs locally in development.
  mount Sidekiq::Web => "/sidekiq"

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Read-only JSON access to stored documents.
  resources :documents, only: [:index, :show]

  # Full CRUD JSON API consumed by the React (antd + rjsf) frontend.
  namespace :api do
    # Questions always belong to a document: they are listed and created under
    # the parent document, and addressed directly once they exist (shallow).
    resources :documents do
      resources :questions, only: [:index, :create]
    end
    resources :questions, only: [:show, :update, :destroy]
  end

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
