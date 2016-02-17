class TaskSerializer < ActiveModel::Serializer
  attributes :id, :name, :status, :project_id

  has_one :project
end
