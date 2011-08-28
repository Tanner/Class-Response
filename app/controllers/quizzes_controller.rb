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
        result['question_id'] = @current_question.id
        result['sort_index'] = @current_question.sort
        result['total_count'] = @quiz.questions.count
        result['type'] = "multiple-choice"
        result['value'] = @current_question.question

        choices = Array.new
        @current_question.answers.each do |answer|
            choices.push Hash["value" => answer.answer, "id" => answer.id]
        end
        result['choices'] = choices

        render :text => result.to_json 
    end

    def csv
        @quiz = Quiz.find(params[:id])
        @students = Student.all
        csv = CSV.generate do |csv|
            header = Array.new
            header.push("Student Identifier")
            @quiz.questions.each do |question|
                header.push(question.question)
            end
            csv << header

            @quiz.questions.each do |question|
                @students = Student.all

                @students.each do |student|
                    studentLine = Array.new
                    studentLine.push(student.identifier)

                    submissions = student.submissions.where(:quiz_id => @quiz.id, :question_id => question.id)
                    submissions.each do |submission|
                        studentLine.push(submission.answer.answer)
                    end

                    csv << studentLine
                end
            end 
        end

        render :text => csv
    end
end
