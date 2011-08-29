class Quiz < ActiveRecord::Base
    has_many :questions
    belongs_to :current_question, :class_name => "Question"

    validates_presence_of :name
end
