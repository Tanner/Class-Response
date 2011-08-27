class Submission < ActiveRecord::Base
  has_one :student
  has_one :question
  has_one :answer
  has_one :quiz

  validates_presence_of :student_id, :question_id, :answer_id
end
