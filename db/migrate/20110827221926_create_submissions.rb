class CreateSubmissions < ActiveRecord::Migration
  def self.up
    create_table :submissions do |t|
      t.references :student
      t.references :question
      t.references :answer

      t.timestamps
    end
  end

  def self.down
    drop_table :submissions
  end
end
