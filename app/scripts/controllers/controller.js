'use strict'

angular.module('appController', [])
  .controller('MainCtrl', function(Auth,$rootScope, Notification, $state, config) {

    var mainVm = this;

    $rootScope.checkIfManager = false;
    $rootScope.userName = "";
   
    mainVm.login = function() {

      Auth.login(mainVm.username, mainVm.password).then(function successHandler(serviceResponse) {

        if (serviceResponse == undefined) {
          Notification.error('Invalid username and password!');
          return;
        }
        if (serviceResponse != undefined && serviceResponse.data.access_token) {
			 $rootScope.userName = serviceResponse.data.username;
          angular.forEach(serviceResponse.data.roles, function(val) {
            if (val.toString() == config.roles.manager.toString()) {
              $rootScope.checkIfManager = true
			 
            }

          });
          $state.go('dashboard', {
            isManager: $rootScope.checkIfManager
          });
        }
      }, function errorHandler(error) {
        Notification.error('Invalid username and password!');

      });

    };

    mainVm.getProjects = function() {
      Auth.getProjects().then(function successcallback(serviceResponse) {
        console.log(serviceResponse)
      }, function errorCallback(err) {
        console.log(err);
      });
    }


    mainVm.register = function() {

      console.log("inside regiseter", mainVm);
      Auth.register(mainVm.username, mainVm.password).then(function(serviceResponse) {
        console.log(serviceResponse);
        if (serviceResponse.data.status == 200) {
          Notification.success('User created');
          $state.go('login');
        }

      });

    };

  })
  .controller('DashboardCtrl', function(Auth, $scope, $state, $stateParams, MainService, Notification) {
    console.log("DashboardCtrl controller");
    var dashboardVm = this;
    dashboardVm.maxResultSet = 7;
    dashboardVm.offset = 0;
    dashboardVm.users = [];
    dashboardVm.projectTasks = [];
    dashboardVm.taskComments = [];
    dashboardVm.projectId = null;
    dashboardVm.taskId = null;



    if ($stateParams.projectId) {
      dashboardVm.projectId = $stateParams.projectId;
      
    } else {
      console.log("no task id")
    }
	
	
	dashboardVm.getProjectTasks = function(projectId,offSet,maxResult){
		MainService.getProjectTasks(dashboardVm.projectId,offSet,maxResult).then(function(taskResponse) {
			console.log("task List",taskResponse);
			dashboardVm.projectTasks = [];
        angular.forEach(taskResponse.data.taskList, function(val, key) {
          dashboardVm.projectTasks.push({
            id: val.id,
            description: val.description
          });
        });
			dashboardVm.taskCount = taskResponse.data.taskCount;
      });
	}


    if ($stateParams.taskId && $stateParams.projectId) {
      dashboardVm.taskId = $stateParams.taskId;
      dashboardVm.projectId = $stateParams.projectId;

     


    } else {
      console.log("no project id")
    }
	
	
	
	//call to get task comments
	
	dashboardVm.getTaskComments = function(taskId,projectId,offSet,maxResult){
		     
		  var data = {
             taskId: taskId,
             projectId: projectId,
			 offset:offSet,
			 maxResultSet:maxResult 
      };
		
		dashboardVm.taskComments=[];
		MainService.getTaskComments(data).then(function(commentsResponse) {

        angular.forEach(commentsResponse.data.commentList, function(val, key) {
          dashboardVm.taskComments.push({
            id: val.id,
            commentNote: val.commentNote
          });
			
        });
		  dashboardVm.commentCount = commentsResponse.data.commentCount;
      });
		
	};


    dashboardVm.saveTask = function() {
      var data = {
        projectId: dashboardVm.projectId,
        userId: dashboardVm.user.id,
        description: dashboardVm.description
      }
      MainService.saveTask(data).then(function(response) {
        console.log(response);
        if (response.status == 200) {
          $scope.dismiss();
          Notification.success('Task Saved ');
          console.log(response)

          dashboardVm.projectTasks.push({
            id: response.data.task.id,
            description: response.data.task.description
          });
        }
      })

    }



    dashboardVm.saveComment = function() {
      var data = {
        userId: 1,
        projectId: dashboardVm.projectId,
        taskId: dashboardVm.taskId,
        commentNote: dashboardVm.commentNote
      }
      MainService.saveComment(data).then(function(response) {
        console.log(response);
        if (response.status == 200) {
          $scope.dismiss();
          Notification.success('Comment Saved ');
          dashboardVm.taskComments.push({
            id: response.data.comment.id,
            commentNote: response.data.comment.commentNote
          });
        }
      })

    }


    dashboardVm.getProjects = function(offset,max) {
		
      Auth.getProjects(offset,max).then(function(response) {
        console.log("respinse",response);
        dashboardVm.projectData = response.data.projectList;
        dashboardVm.projectCount = response.data.projectCount;
      })
    };

    dashboardVm.getUsers = function() {
      MainService.getUsers().then(function(usersResponse) {
        angular.forEach(usersResponse.data, function(val, key) {
          dashboardVm.users.push({
            id: val.id,
            username: val.username
          });
        })
      })
    };
    dashboardVm.getUsers();

    //pull the projects for display
//    dashboardVm.getProjects();


    dashboardVm.createProject = function() {
      console.log("yes you are inside cretae project");
      MainService.createProject(dashboardVm.projectName, dashboardVm.description).then(function successHandler(serviceResponse) {
        console.log(serviceResponse);
        if (serviceResponse.status == 200) {
          Notification.success('Project created! ');
          dashboardVm.projectName = "";
          dashboardVm.description = "";
        }
      }, function errorHnadler(err) {
        console.log(err);
      })
    }

    //redirect to addTask page
    dashboardVm.addTask = function(id) {
      console.log("About controller getProjects");

      $state.go('dashboard.addTask', {
        projectId: id
      });

    };


    //redirect to addComment page
    dashboardVm.addComment = function(id) {
      console.log("About controller getProjects");

      $state.go('dashboard.addComment', {
        taskId: id,
        projectId: dashboardVm.projectId
      });

    };


    //delete a post
    dashboardVm.removeProject = function(id) {
      console.log("About controller getProjects");
      Auth.getProjects().then(function(response) {
        console.log(response);
      })
    };



    dashboardVm.logout = function() {
      Auth.logout();
      $state.go('/')
    };


    dashboardVm.onServerSideItemsRequested = function(currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse) {
		console.log("called again",currentPage);
		 dashboardVm.offset = (+currentPage)*7;
		dashboardVm.getProjects(dashboardVm.offset,dashboardVm.maxResultSet);
		if(dashboardVm.projectId){
			console.log("hello inside project id getProjectTASK");
	   dashboardVm.getProjectTasks(dashboardVm.projectId,dashboardVm.offset,dashboardVm.maxResultSet);
		}
		if(dashboardVm.projectId && dashboardVm.taskId){
			console.log("hello inside project for task and project id");	dashboardVm.getTaskComments(dashboardVm.taskId,dashboardVm.projectId,dashboardVm.offset,dashboardVm.maxResultSet);
		}
    };


  })
  .controller('LogoutCtrl', ['Auth', '$rootScope',
    function(Auth, $rootScope) {
      Auth.logout();
      console.log("logged out");
      console.log($rootScope);
      $rootScope.isUserLoggedIn = false;
      console.log(Auth.isLoggedIn());
    }
  ])
  .directive('myModal', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        scope.dismiss = function() {
          element.modal('hide');
        };
      }
    }
  });