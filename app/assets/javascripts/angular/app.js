var listModule = angular.module("listModule", ['ngResource']);
	
	listModule.factory('TodoList', ['$resource', function($resource) {
		return $resource('/projects/:projectId.:format', {
			projectId:'@projectId',
			format: 'json'
		}, {
			'query': { method: 'GET' },
		    'update':  { method: 'PUT' }
		});
		}
	]);

	listModule.factory('TaskList', ['$resource', function($resource) {
		return $resource('/projects/:projectId/tasks/:taskId.:format', {
			projectId:'@projectId',
			taskId:'@taskId',
			format: 'json'
		}, {
			'query': { method: 'GET' },
		    'update': { method: 'PUT' }
		});
		}
	]);

	listModule.controller("listCtrl", ['TodoList', 'TaskList', function(TodoList, TaskList) {
		var todoList = this;
		
		this.prjs = TodoList.query();
		console.log('this.prjs');
		console.log(this.prjs);
		this.prjs.$promise.then(function(data){
	    	this.projects = data.projects; 
			//console.log(this.projects[0].tasks.length);

		});

	        this.tumbler = [];
	        if (this.prjs.projects){
				for (var i = 0; i < this.prjs.projects.length; i++) {
					this.tumbler[i] = [];
					if (this.prjs.projects[i]){
						for (var j = 0; j < this.prjs.projects[i].tasks.length; j++) {
							this.tumbler[i].push(true);
						}
					}
				};
	        }


		this.addTask = function(arg) {
			var task = {
				name: this.taskText,
				status: false,
			    project_id: this.prjs.projects[arg].id
			};
			if (this.prjs.projects[arg]) {
			    this.prjs.projects[arg].tasks = this.prjs.projects[arg].tasks || [];	
				this.prjs.projects[arg].tasks.push(task); 
				TaskList.save({projectId: this.prjs.projects[arg].id}, task);
				this.taskText = "";				
			}
		}
		
		this.delTask = function(project_id, task_id) {
			var task = this.prjs.projects[project_id].tasks.splice(task_id, 1);
			console.log('task');
			console.log(task);
			TaskList.remove({
				projectId: this.prjs.projects[project_id].id,
				taskId: task[0].id
			});

		}
		
        this.saveLists = function() {
            this.prjs.projects = this.prjs.projects || [];
        	this.prjs.projects.push({name: '', tasks: []});
			angular.forEach(this.prjs.projects, function(project) {
			  console.log(project);
			  if(project.id){
			    TodoList.update({projectId: project.id}, project);
			  } else {
			    TodoList.save(project);
			  }
			  
			});
        }

		this.delList = function(arg) {
			console.log(arg);
			var project = this.prjs.projects.splice(arg, 1);
			console.log(project[0].id);
			TodoList.remove({projectId: project[0].id});
		}

		this.editName = function(arg) {
			this.prjs.projects[arg].name = this.listName;
			this.prjs.projects[arg].status = this.listName;
			angular.forEach(this.prjs.projects, function(project) {
			  console.log(project);
			  if(project.id){
			    TodoList.update({projectId: project.id}, project);
			  } else {
			    TodoList.save(project);
			  }
			  
			});

			this.tumbler[arg] = true;	
		}

		this.editListName = function(arg) {
			this.tumbler[arg] = false;
		}

		this.editTask = function(arg1, arg2) {
			this.tumbler[arg1][arg2] = true;
		}

		this.switchTask = function(arg1, arg2) {
			var task = this.prjs.projects[arg1].tasks[arg2]
			TaskList.update({
				projectId: this.prjs.projects[arg1].id,
				taskId: task.id}, task
			);
			this.tumbler[arg1][arg2] = true;
									 
			}

		this.tumblerTask = function(arg1, arg2) {
			this.tumbler[arg1][arg2] = false;
			
		}

		
	}	]);

