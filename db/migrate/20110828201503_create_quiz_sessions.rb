class CreateQuizSessions < ActiveRecord::Migration
  def self.up
    create_table :quiz_sessions do |t|
      t.references :quiz

      t.timestamps
    end
  end

  def self.down
    drop_table :quiz_sessions
  end
end
