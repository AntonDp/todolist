class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :name, :tasks

  def tasks
  	object.tasks.each do |task|
  	  TaskSerializer.new(task, scope: scope, root: false)
  	end
  end


end
