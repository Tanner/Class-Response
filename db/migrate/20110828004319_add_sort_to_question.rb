class AddSortToQuestion < ActiveRecord::Migration
  def self.up
    add_column :questions, :sort, :integer
  end

  def self.down
    remove_column :questions, :sort
  end
end
