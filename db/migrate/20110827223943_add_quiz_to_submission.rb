class AddQuizToSubmission < ActiveRecord::Migration
  def self.up
    add_column :submissions, :quiz_id, :integer
  end

  def self.down
    remove_column :submissions, :quiz_id
  end
end
