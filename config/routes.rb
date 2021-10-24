Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  concern :rankable do
    post 'move_up', on: :member
    post 'move_down', on: :member
  end

  root 'pages#show'

  post '/register', to: 'backcall#register'
  post '/backcall', to: 'backcall#backcall'

  get 'registration', to: 'auth#registration'
  post 'registration', to: 'auth#registration'
  get 'login', to: 'auth#login', as: :login
  post 'login', to: 'auth#login'
  post 'logout', to: 'auth#logout'

  namespace :admin do
    get '/', to: 'static_pages#index'

    get 'contacts', to: 'contacts#edit'
    put 'contacts', to: 'contacts#update'
    patch 'contacts', to: 'contacts#update'

    get 'static_pages/new', to: 'static_pages#new'
    get 'static_pages/:id/edit', to: 'static_pages#edit'
    resources :static_pages, except: [:show], concerns: :rankable

    get 'prices/new', to: 'prices#new'
    get 'prices/:id/edit', to: 'prices#edit'
    resources :prices, except: [:show], concerns: :rankable

    resources :components, only: [:create, :update, :destroy]

    resources :pages, only: [:index, :update], concerns: :rankable

    get 'articles/new', to: 'articles#new'
    get 'articles/:id/edit', to: 'articles#edit'
    resources :articles, except: [:show]

    get 'novelties/new', to: 'novelties#new'
    get 'novelties/:id/edit', to: 'novelties#edit'
    resources :novelties, except: [:show]

    get 'healings/new', to: 'healings#new'
    get 'healings/:id/edit', to: 'healings#edit'
    resources :healings, except: [:show]

    controller :media_library do
      get '/media_library' => :index, as: :media_library
      get '/media_library/trash' => :trash
      get '/media_library/*path' => :show

      post '/media_library/update/file' => :update_file, as: :update_media_file
      post '/media_library/update/folder' => :update_folder, as: :update_media_folder

      post '/media_library/trash' => :restore_file, as: :restore_media_file

      post '/media_library/create_folder' => :create_folder, as: :create_media_folder
      post '/media_library/*path' => :create

      delete '/media_library/file' => :delete_file, as: :delete_media_file
      delete '/media_library/trash' => :destroy_file, as: :destroy_media_file
      delete '/media_library/folder' => :delete_folder, as: :delete_media_folder
    end

    get 'photo_categories/new', to: 'photo_categories#new'
    get 'photo_categories/:id/edit', to: 'photo_categories#edit'
    resources :photo_categories, except: [:show], concerns: :rankable do
      get 'photos/new', to: 'photos#new'
      get 'photos/:id/edit', to: 'photos#edit'
      get '/', to: 'photos#index'
      resources :photos, except: [:show]
    end

    get 'comments/new', to: 'comments#new'
    get 'comments/:id/edit', to: 'comments#edit'
    resources :comments, except: [:show]

    get 'banners/new', to: 'banners#new'
    get 'banners/:id/edit', to: 'banners#edit'
    resources :banners, except: [:show]
  end

  get '*path', to: 'pages#show'
end
