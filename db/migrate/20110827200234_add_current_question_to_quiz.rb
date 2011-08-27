class AddCurrentQuestionToQuiz < ActiveRecord::Migration
  def self.up
    add_column :quizzes, :current_question_id, :integer
  end

  def self.down
    remove_column :quizzes, :current_question_id
  end
end
