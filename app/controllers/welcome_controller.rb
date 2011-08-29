class WelcomeController < ApplicationController 
	def index
		render 'index', :layout => 'welcome_layout'
	end
end