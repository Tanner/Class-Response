class Submission < ActiveRecord::Base
  has_one :student
  has_one :question
  has_one :answer
end
