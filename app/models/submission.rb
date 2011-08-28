class Submission < ActiveRecord::Base
  belongs_to :student
  belongs_to :question
  belongs_to :answer
  belongs_to :quiz

  validates_presence_of :student_id, :question_id, :answer_id
end
