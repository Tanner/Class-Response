class RenameStateToFinished < ActiveRecord::Migration
  def self.up
      rename_column :questions, :state, :finished
  end

  def self.down
      rename_column :questions, :finished, :state
  end
end
