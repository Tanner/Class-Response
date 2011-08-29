require 'json/add/rails'
require 'CSV'

class QuizzesController < ApplicationController
    def show
        @quiz_session = QuizSession.find(params[:id])
        @quiz = @quiz_session.quiz
        
        render 'quiz'
    end

    def json
        @quiz_session = QuizSession.find(params[:id])
        @quiz = @quiz_session.quiz
        @current_question = @quiz.current_question

        time = [@quiz.updated_at, @current_question.updated_at].max

        if (time > Time.at(params[:time].to_i))
            result = Hash.new
            result['type'] = "question"
            result['question_id'] = @current_question.id
            result['sort_index'] = @current_question.sort
            result['total_count'] = @quiz.questions.count
            result['format'] = "multiple-choice"
            result['timestamp'] = [@quiz.updated_at, @current_question.updated_at].max.to_time.to_i
            result['state'] = @current_question.state
            result['value'] = @current_question.question

            # Question is finished if state is true and pending if not
            if (@current_question.state)
                result['answer'] = @current_question.correct_answer.id
            end

            totalSubmissions = Submission.where("question_id" => @current_question.id).count
            result["total"] = totalSubmissions

            choices = Array.new
            @current_question.answers.each do |answer|
                answerHash = Hash["value" => answer.answer, "id" => answer.id]

                if (@current_question.state)
                    answerHash["percent"] = Submission.where("question_id" => @current_question.id, "answer_id" => answer.id).count / totalSubmissions;
                end

                choices.push answerHash
            end
            result['choices'] = choices

            render :text => result.to_json 
        else
            head :ok 
        end
    end

    def submit
        parsed_json = ActiveSupport::JSON.decode(params[:json]);

        quiz_session_id = parsed_json["quiz_session_id"]
        question_id = parsed_json["question_id"]
        answer_id = parsed_json["answer_id"]
        student_identifier = parsed_json["student_identifier"]

        if (question_id && answer_id && student_identifier)
            # JSON is valid
            student_id = Student.where("identifier" => student_identifier)
            if (student_id)
                old_submission = Submission.where("quiz_session_id" => quiz_session_id, "question_id" => question_id, "student_id" => student_id)
                if (old_submission != nil)
                    old_submission.delete
                end

                submission = Submission.new
                submission.quiz_session_id = quiz_session_id
                submission.question_id = question_id
                submission.answer_id = answer_id
                submission.quiz_id = params[:id]
                submission.student_id = Student.where("identifier" => student_identifier)
                submission.save
            else
                head :bad_request
            end

            render :text => [question_id, answer_id, student_identifier]
        else
            head :bad_request
        end
    end

    def csv
        @quiz_session = QuizSession.find(params[:id])
        @quiz = @quiz_session.quiz
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
