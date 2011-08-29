class Question < ActiveRecord::Base
  belongs_to :quiz
  has_many :answers, :class_name => "Answer"
  belongs_to :correct_answer, :class_name => "Answer"

  validates_presence_of :question, :quiz_id
end
