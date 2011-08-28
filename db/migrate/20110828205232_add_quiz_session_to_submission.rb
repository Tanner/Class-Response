class AddQuizSessionToSubmission < ActiveRecord::Migration
  def self.up
    add_column :submissions, :quiz_session_id, :integer
  end

  def self.down
    remove_column :submissions, :quiz_session_id
  end
end
