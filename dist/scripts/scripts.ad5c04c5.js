!function(){"use strict";angular.module("projectManagementApplicationApp",["appRoutes","authService","mainService","appController","trNgGrid"]).constant("config",{appName:"Project Management Application",apiUrl:"https://polar-garden-16750.herokuapp.com/",roles:{manager:"ROLE_MANAGER",user:"ROLE_USER"},contentTypeConfig:{headers:{"Content-Type":"application/x-www-form-urlencoded;charset=utf-8;"}}})}(),function(){"use strict";angular.module("appController",[]).controller("MainCtrl",["Auth","$rootScope","Notification","$state","config",function(a,b,c,d,e){var f=this;b.checkIfManager=!1,b.userName="",f.login=function(){a.login(f.username,f.password).then(function(a){return void 0==a?void c.error("Invalid username and password!"):void(void 0!=a&&a.data.access_token&&(console.log("user data",a),b.userName=a.data.username,b.loggedInUserId=a.data.id,angular.forEach(a.data.roles,function(a){a.toString()==e.roles.manager.toString()&&(b.checkIfManager=!0)}),d.go("dashboard",{isManager:b.checkIfManager})))},function(a){c.error("Invalid username and password!")})},f.getProjects=function(){a.getProjects().then(function(a){},function(a){console.log(a)})},f.register=function(){a.register(f.username,f.password).then(function(a){200==a.data.status&&(c.success("User created"),d.go("login"))})}}]).controller("DashboardCtrl",["Auth","$scope","$state","$stateParams","MainService","Notification",function(a,b,c,d,e,f){var g=this;g.maxResultSet=7,g.offset=0,g.users=[],g.projectTasks=[],g.taskComments=[],g.projectId=null,g.taskId=null,d.projectId&&(g.projectId=d.projectId),g.getProjectTasks=function(a,b,c){e.getProjectTasks(g.projectId,b,c).then(function(a){g.projectTasks=[],angular.forEach(a.data.taskList,function(a,b){g.projectTasks.push({id:a.id,description:a.description})}),g.taskCount=a.data.taskCount})},d.taskId&&d.projectId&&(g.taskId=d.taskId,g.projectId=d.projectId),g.getTaskComments=function(a,b,c,d){var f={taskId:a,projectId:b,offset:c,maxResultSet:d};g.taskComments=[],e.getTaskComments(f).then(function(a){angular.forEach(a.data.commentList,function(a,b){g.taskComments.push({id:a.id,commentNote:a.commentNote})}),g.commentCount=a.data.commentCount})},g.saveTask=function(){var a={projectId:g.projectId,userId:g.user.id,description:g.description};e.saveTask(a).then(function(a){200==a.status&&(b.dismiss(),f.success("Task Saved "),g.projectTasks.push({id:a.data.task.id,description:a.data.task.description}))})},g.saveComment=function(){var a={userId:1,projectId:g.projectId,taskId:g.taskId,commentNote:g.commentNote};e.saveComment(a).then(function(a){200==a.status&&(b.dismiss(),f.success("Comment Saved "),g.taskComments.push({id:a.data.comment.id,commentNote:a.data.comment.commentNote}))})},g.getProjects=function(b,c){a.getProjects(b,c).then(function(a){g.projectData=a.data.projectList,g.projectCount=a.data.projectCount})},g.getUsers=function(){e.getUsers().then(function(a){angular.forEach(a.data,function(a,b){g.users.push({id:a.id,username:a.username})})})},g.getUsers(),g.createProject=function(){e.createProject(g.projectName,g.description).then(function(a){console.log(a),200==a.status&&(f.success("Project created! "),g.projectName="",g.description="")},function(a){console.log(a)})},g.addTask=function(a){c.go("dashboard.addTask",{projectId:a})},g.addComment=function(a){c.go("dashboard.addComment",{taskId:a,projectId:g.projectId})},g.removeProject=function(b){a.getProjects().then(function(a){console.log(a)})},g.logout=function(){a.logout(),c.go("/")},g.onServerSideItemsRequested=function(a,b,c,d,e,f){g.offset=7*+a,g.getProjects(g.offset,g.maxResultSet),g.projectId&&g.getProjectTasks(g.projectId,g.offset,g.maxResultSet),g.projectId&&g.taskId&&g.getTaskComments(g.taskId,g.projectId,g.offset,g.maxResultSet)},g.removeTask=function(a){e.deleteTask(g.projectId,a).then(function(b){console.log(b);var c=-1;200==b.status&&(angular.forEach(g.projectTasks,function(b,d){console.log("val",b),b.id==a&&(c=d)}),g.projectTasks.splice(c,1))})},g.removeComment=function(a){var b={commentId:a,projectId:g.projectId,taskId:g.taskId};e.deleteComment(b).then(function(b){var c=-1;200==b.status&&(angular.forEach(g.taskComments,function(b,d){console.log("val",b),b.id==a&&(c=d)}),g.taskComments.splice(c,1))})}}]).controller("LogoutCtrl",["Auth","$rootScope",function(a,b){a.logout(),b.isUserLoggedIn=!1}]).directive("myModal",function(){return{restrict:"A",link:function(a,b,c){a.dismiss=function(){b.modal("hide")}}}})}(),function(){"use strict";angular.module("appRoutes",["ui.router","ui-notification"]).config(["$stateProvider","$urlRouterProvider","NotificationProvider","$httpProvider",function(a,b,c,d){c.setOptions({delay:1e4,startTop:20,startRight:10,verticalSpacing:20,horizontalSpacing:20,positionX:"left",positionY:"bottom"}),a.state("home",{url:"/",templateUrl:"views/main.html",controller:"MainCtrl"}).state("login",{url:"/login",templateUrl:"views/login.html",controller:"MainCtrl"}).state("logout",{url:"/",templateUrl:"views/main.html",controller:"LogoutCtrl"}).state("register",{url:"/register",templateUrl:"views/register.html",controller:"MainCtrl"}).state("dashboard",{url:"/dashboard",params:{isManager:null},templateUrl:"views/dashboard.html",controller:"DashboardCtrl"}).state("dashboard.createProject",{url:"/createPost",templateUrl:"partials/createProject.html",controller:"DashboardCtrl"}).state("dashboard.viewProject",{url:"/viewPost",templateUrl:"partials/viewProject.html",controller:"DashboardCtrl"}).state("dashboard.addTask",{url:"/addTask",params:{projectId:null},templateUrl:"partials/createTask.html",controller:"DashboardCtrl"}).state("dashboard.addComment",{url:"/addComment",params:{taskId:null,projectId:null},templateUrl:"partials/create	Comment.html",controller:"DashboardCtrl"}),b.otherwise("/"),d.interceptors.push("AuthInterceptor")}]).run(["$state","$rootScope","Auth",function(a,b,c){b.$on("$stateChangeStart",function(d,e,f,g,h,i){b.isUserLoggedIn=c.isLoggedIn(),"home"!==e.name&&"login"!==e.name&&"register"!==e.name&&(c.isLoggedIn()||"login"==e.name||(d.preventDefault(),a.transitionTo("login",null,{notify:!1}),a.go("login")))})}])}(),function(){"use strict";angular.module("authService",[]).factory("Auth",["$http","$q","AuthToken","config",function(a,b,c,d){var e={};e.roles=[],e.isAdmin=!1;var f=d.apiUrl;return e.login=function(b,d){return a.post(f+"api/login",{username:b,password:d}).success(function(a){return c.setToken(a.access_token),a})},e.logout=function(){c.setToken()},e.register=function(b,c){var d=f+"register",e={headers:{"Content-Type":"application/x-www-form-urlencoded;charset=utf-8;"}};return a.post(d,$.param({username:b,password:c}),e).success(function(a){return a})},e.isLoggedIn=function(){return c.getToken()?!0:!1},e.getProjects=function(d,e){return c.getToken()?a({method:"GET",url:f+"api/project",params:{offset:d,maxResultSet:e}}):b.reject({message:"User has no token"})},e}]).factory("AuthToken",["$window",function(a){var b={};return b.getToken=function(){return a.localStorage.getItem("token")},b.setToken=function(b){b?a.localStorage.setItem("token",b):a.localStorage.removeItem("token")},b}]).factory("AuthInterceptor",["$q","$location","AuthToken","$window",function(a,b,c,d){var e={};return e.request=function(a){var b=c.getToken();return b&&(a.headers.Authorization="Bearer ".concat(b)),a},e.responseError=function(c){return console.log("error response",c),403==c.status&&(console.log("unauthorized error"),d.location="/403.html",a.reject(c)),401==c.status?a.reject(c):-1==c.status?a.reject(c):500==c.status?(b.path("/500.html"),a.reject(c)):void 0},e}])}(),function(){"use strict";angular.module("mainService",[]).factory("MainService",["$http","$q","AuthToken","config",function(a,b,c,d){var e={},f=d.apiUrl;return e.getUsers=function(){return a.get(f+"register",d.contentTypeConfig).success(function(a){return a})},e.getProjectTasks=function(b,c,d){var e={projectId:b,offset:c,maxResultSet:d},g=f.concat("api/project/").concat(b).concat("/task");return a({method:"GET",url:g,params:e}).success(function(a){return a})},e.getTaskComments=function(b){var c=f.concat("api/project/").concat(b.projectId).concat("/task/").concat(b.taskId).concat("/comment");return a({method:"GET",url:c,params:b}).success(function(a){return a})},e.createProject=function(b,c){return a.post(f+"api/project",$.param({projectName:b,description:c}),d.contentTypeConfig).success(function(a){return a})},e.deleteProject=function(){},e.saveTask=function(b){var c=f.concat("api/project/").concat(b.projectId).concat("/task");return a.post(c,$.param(b),d.contentTypeConfig).success(function(a){return a})},e.deleteTask=function(b,c){var e=f.concat("api/project/").concat(b).concat("/task/").concat(c);return a["delete"](e,d.contentTypeConfig).success(function(a){return a})},e.updateTask=function(){},e.saveComment=function(b){var c=f.concat("api/project/").concat(b.projectId).concat("/task/").concat(b.taskId).concat("/comment");return a.post(c,$.param(b),d.contentTypeConfig).success(function(a){return a})},e.deleteComment=function(b){var c=f.concat("api/project/").concat(b.projectId).concat("/task/").concat(b.taskId).concat("/comment/").concat(b.commentId);return a["delete"](c,d.contentTypeConfig).success(function(a){return a})},e.updateComment=function(){},e}])}(),angular.module("projectManagementApplicationApp").run(["$templateCache",function(a){"use strict";a.put("views/dashboard.html",'<div ng-controller="DashboardCtrl as dashboardVm"> <div class="col-xs-3"> <ul class="list-group"> <li class="list-group-item"> <a ui-sref="dashboard.createProject">Create New Project</a> </li> <li class="list-group-item"> <a ui-sref="dashboard.viewProject">View Projects</a> </li> </ul> </div> <div class="col-xs-9"> <div ui-view></div> </div> </div>'),a.put("views/login.html",'<div class="container"> <div class="wrapper"> <form name="loginForm" method="post" name="Login_Form" class="form-signin"> <h3 class="form-signin-heading">Welcome Back! Please Sign In</h3> <hr class="colorgraph"><br> <input type="text" class="form-control" name="Username" placeholder="Username" ng-model="mainVm.username" required autofocus> <input type="password" class="form-control" name="Password" placeholder="Password" ng-model="mainVm.password" required> <button class="btn btn-lg btn-primary btn-block" name="Submit" value="Login" ng-click="mainVm.login()">Login</button> </form> </div> </div>'),a.put("views/main.html",'<div class="jumbotron"> <h1>Welcome to the project management application</h1> </div>'),a.put("views/register.html",'<div class="container"> <div class="wrapper"> <form name="registerForm" method="post" name="Login_Form" class="form-signin"> <h3 class="form-signin-heading">Please Register</h3> <hr class="colorgraph"><br> <input type="text" class="form-control" name="Username" placeholder="Username" ng-model="mainVm.username" required autofocus> <input type="password" class="form-control" name="Password" placeholder="Password" ng-model="mainVm.password" required> <input type="password" class="form-control" name="confirmPassword" placeholder="Confirm Password" ng-model="mainVm.confirmPassword" required> <button id="registerBtn" class="btn btn-lg btn-primary btn-block" name="Submit" value="Login" ng-click="mainVm.register()">Register</button> </form> </div> </div>'),a.put("partials/createComment.html",'<div ng-controller="DashboardCtrl as dashboardVm"> <!-- Button trigger modal --> <button class="btn btn-primary btn-md pull-right" data-toggle="modal" data-target="#myModal" style="margin:20px">Add Comment </button> <!-- Modal --> <div class="modal fade" id="myModal" my-modal tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span> </button> <h4 class="modal-title" id="myModalLabel">Add Comment</h4> </div> <div class="modal-body"> <div class="row"> <div class="col-md-10"> <form role="form"> <div class="form-group"> <label for="comment" class="pull-left">Comment Note:</label> <textarea class="form-control" rows="5" ng-model="dashboardVm.commentNote" id="commentNote"></textarea> </div> </form> </div> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" ng-click="dashboardVm.saveComment()">Save</button> </div> </div> </div> </div> </div> <hr> <div style="margin-bottom:20px"></div> <table tr-ng-grid="" items="dashboardVm.taskComments" page-items="dashboardVm.maxResultSet" enable-filtering="false" total-items="dashboardVm.commentCount" on-data-required="dashboardVm.onServerSideItemsRequested(currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse)" fields="[\'id\',\'commentNote\']"> <thead> <tr> <th field-name="id" width="50%"></th> <th field-name="commentNote" width="50%"></th> <th field-name="" width="300px"></th> </tr> </thead> <tbody> <tr> <td> <button class="btn btn-primary btn-md adminAction" ng-click="dashboardVm.editComment(gridDisplayItem.id)"> Edit </button> | <button class="btn btn-primary btn-md adminAction" ng-if="checkIfManager" ng-click="dashboardVm.removeComment(gridDisplayItem.id)"> Delete </button> </td> </tr> </tbody> </table> </div>'),a.put("partials/createProject.html",'<div class="col-md-10"> <form> <fieldset class="form-group"> <label for="projectName" class="pull-left">Project</label> <input type="text" name="projectName" class="form-control" id="projectName" placeholder="Name" ng-model="dashboardVm.projectName"> </fieldset> <fieldset class="form-group"> <label for="description" class="pull-left">Description</label> <input type="text" name="description" class="form-control" id="description" placeholder="description" ng-model="dashboardVm.description"> </fieldset> <button type="submit" class="btn btn-primary" ng-click="dashboardVm.createProject()">Create</button> </form> </div>'),a.put("partials/createTask.html",'<div ng-controller="DashboardCtrl as dashboardVm"> <!-- Button trigger modal --> <button class="btn btn-primary btn-md pull-right" data-toggle="modal" data-target="#myModal" style="margin:20px">Add Task </button> <!-- Modal --> <div class="modal fade" id="myModal" my-modal tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span> </button> <h4 class="modal-title" id="myModalLabel">Create Task</h4> </div> <div class="modal-body"> <div class="row"> <div class="col-md-10"> <form role="form"> <div class="form-group"> <label for="comment" class="pull-left">Description:</label> <textarea class="form-control" rows="5" ng-model="dashboardVm.description" id="description"></textarea> </div> <div class="form-group"> <label for="category" class="pull-left control-label">Assign To User</label> <select ng-options="user as user.username for user in dashboardVm.users track by user.id" class="form-control" id="user" ng-model="dashboardVm.user"></select> </div> </form> </div> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary" ng-click="dashboardVm.saveTask()">Save</button> </div> </div> </div> </div> </div> <div style="margin-bottom:20px"></div> <table tr-ng-grid="" items="dashboardVm.projectTasks" page-items="dashboardVm.maxResultSet" enable-filtering="false" total-items="dashboardVm.taskCount" on-data-required="dashboardVm.onServerSideItemsRequested(currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse)" fields="[\'id\',\'description\']"> <thead> <tr> <th field-name="id" width="50%"></th> <th field-name="description" width="50%"></th> <th field-name="" width="300px"></th> </tr> </thead> <tbody> <tr> <td> <button class="btn btn-primary adminAction" ng-click="dashboardVm.addComment(gridDisplayItem.id)"> View Comment </button> <button class="btn btn-primary adminAction" ng-click="dashboardVm.editTask(gridDisplayItem.id)"> Edit </button> <button class="btn btn-primary adminAction" ng-if="checkIfManager" ng-click="dashboardVm.removeTask(gridDisplayItem.id)"> Delete </button> </td> </tr> </tbody> </table> </div>'),a.put("partials/viewProject.html",'<table tr-ng-grid="" items="dashboardVm.projectData" page-items="dashboardVm.maxResultSet" enable-filtering="false" total-items="dashboardVm.projectCount" on-data-required="dashboardVm.onServerSideItemsRequested(currentPage, pageItems, filterBy, filterByFields, orderBy, orderByReverse)" fields="[\'id\',\'projectName\',\'description\']"> <thead> <tr> <th field-name="id" width="50%"></th> <th field-name="projectName" width="50%"></th> <th field-name="description" width="50%"></th> <th field-name="" width="300px"></th> </tr> </thead> <tbody> <tr> <td> <button class="btn btn-primary adminAction" ng-click="dashboardVm.addTask(gridDisplayItem.id)"> View Task </button> <button class="btn btn-primary adminAction" ng-click="dashboardVm.editProject(gridDisplayItem.id)"> Edit </button> <button class="btn btn-primary adminAction" ng-if="checkIfManager" ng-click="dashboardVm.removeProject(gridDisplayItem.id)"> Delete </button> </td> </tr> </tbody> </table>')}]);