class Answer < ActiveRecord::Base
  belongs_to :question

  validates_presence_of :answer, :question_id
end
