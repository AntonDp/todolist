class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.belongs_to :project, index: true
      t.string :name
      t.boolean :status
      t.integer :project_id

      t.timestamps null: false
    end
  end
end
