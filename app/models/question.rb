class Question < ActiveRecord::Base
  belongs_to :quiz
  has_many :answers, :class_name => "Answer"
  has_one :correct_answer, :class_name => "Answer"
end
