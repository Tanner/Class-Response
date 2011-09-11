class QuizSession < ActiveRecord::Base
  belongs_to :quiz
  belongs_to :current_question, :class_name => "Question"
end
