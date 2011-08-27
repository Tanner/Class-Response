class Student < ActiveRecord::Base
    has_many :submissions
end
