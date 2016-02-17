angular.module('todoApp', ['ngResource'])
  .controller('TodoListController', function($resource) {
    var todoList = this;
    //{id: , name: “”, project: {id: , name: “”}, project_id: , status: }
    var Tasks = $resource('/tasks/:taskId.json', {taskId:'@id'}, {
      'save': { method:'PUT' }
      });
    //var Tasks = $resource('/tasks.json');
    //Tasks.get({taskId:123}, function(user) {
    Tasks.get({}, function(tasks) {
      todoList.todos = tasks.tasks;
      console.log(todoList.todos);
    });

    var Projects = $resource('/projects/:projectId.json', {projectId:'@id'}, {
      'save': { method:'PUT' }
      });

     Projects.get({}, function(projects) {
      todoList.todos = projects.projects;
      console.log(todoList.todos);
    });
    
    //todoList.todos = [
      //{text:'learn angular', done:true},
      //{text:'build an angular app', done:false}];
 
    todoList.addTodo = function() {
      todoList.todos.push({text:todoList.todoText, done:false});
      todoList.todoText = '';
    };
 
    todoList.remaining = function() {
      var count = 0;
      angular.forEach(todoList.todos, function(todo) {
        count += todo.done ? 0 : 1;
      });
      return count;
    };
 
    todoList.archive = function() {
      console.log('archive');
      //var oldTodos = todoList.todos;
      //todoList.todos = [];
      angular.forEach(todoList.todos, function(todo) {
        //if (!todo.status) {
          Tasks.save(todo, function() {
            console.log('data saved');
          });
        //}
      });
    };
  });