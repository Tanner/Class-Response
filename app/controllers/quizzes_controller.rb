require 'json/add/rails'

class QuizzesController < ApplicationController
    def show
        @quiz = Quiz.find(params[:id])
        
        render 'show'
    end

    def json
        @quiz = Quiz.find(params[:id])
        @current_question = @quiz.current_question

        result = Hash.new
        result['value'] = @current_question.question

        choices = Array.new
        @current_question.answers.each do |answer|
            choices.push Hash["value" => answer.answer]
        end
        result['choices'] = choices

        render :text => result.to_json 
    end
end
