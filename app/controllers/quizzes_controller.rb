class QuizzesController < ApplicationController
    def show
        @quiz = Quiz.find(params[:id])
        render :json => @quiz
    end
end
