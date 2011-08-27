class Quiz < ActiveRecord::Base
    has_many :questions
    has_one :current_question, :class_name => "Question"

    validates_presence_of :name
end
