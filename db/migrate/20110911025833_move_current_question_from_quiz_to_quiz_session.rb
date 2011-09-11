class MoveCurrentQuestionFromQuizToQuizSession < ActiveRecord::Migration
  def self.up
    remove_column :quizzes, :current_question_id
    add_column :quiz_sessions, :current_question_id, :integer
  end

  def self.down
    add_column :quizzes, :current_question_id, :integer
    remove_column :quiz_sessions, :current_question_id
  end
end
