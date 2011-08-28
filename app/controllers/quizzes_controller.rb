require 'json/add/rails'
require 'CSV'

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

    def results
        @quiz = Quiz.find(params[:id])
        @students = Student.all
        csv = CSV.generate do |csv|
            @students.each do |student|
                submissions = student.submissions.where(:quiz_id => @quiz.id)
                submissions.each do |submission|
                    csv << [student.identifier, @quiz.name, submission.question.question, submission.answer.answer]
                end
            end
        end

        render :text => csv
    end
end
