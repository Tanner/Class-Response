require 'json/add/rails'

class QuizzesController < ApplicationController
    def show
        @quiz = Quiz.find(params[:id])
        render :json => @quiz
    end

    def json
        @quiz = Quiz.find(params[:id])

        result = Hash.new
        result['quiz_name'] = @quiz.name

        render :text => result.to_json 
    end
end
