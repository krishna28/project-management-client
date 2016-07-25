'use strict';

angular.module("appRoutes",['ui.router','ui-notification'])

.config(function($stateProvider,$urlRouterProvider,NotificationProvider,$httpProvider){
	
	NotificationProvider.setOptions({
			delay: 10000
			, startTop: 20
			, startRight: 10
			, verticalSpacing: 20
			, horizontalSpacing: 20
			, positionX: 'left'
			, positionY: 'bottom'
		});
	$stateProvider
	        .state('home', {
				url: '/'
				, templateUrl: 'views/main.html'
				, controller: 'MainCtrl'
			})
	        .state('login', {
				url: '/login'
				, templateUrl: 'views/login.html'
				, controller: 'MainCtrl'
			})
		    .state('logout', {
				url: '/'
				, templateUrl: 'views/main.html'
				, controller: 'LogoutCtrl'
			})
	       .state('register', {
				url: '/register'
				, templateUrl: 'views/register.html'
				, controller: 'MainCtrl'
			})
			.state('dashboard', {
				url: '/dashboard',
		        params: {
					isManager: null
				}
				, templateUrl: 'views/dashboard.html'
				, controller: 'DashboardCtrl'
			})
	      .state('dashboard.createProject', {
				url: '/createPost'
				, templateUrl: 'partials/createProject.html'
				, controller: 'DashboardCtrl'
			})
	      .state('dashboard.viewProject', {
				url: '/viewPost'
				, templateUrl: 'partials/viewProject.html'
				, controller: 'DashboardCtrl'
			})
	      .state('dashboard.addTask', {
				url: '/addTask',
		        params:{
		        projectId:null	
		        }
				, templateUrl: 'partials/createTask.html'
				, controller: 'DashboardCtrl'
			})
	        .state('dashboard.addComment', {
				url: '/addComment',
		        params:{
		        taskId:null,
				projectId:null	
		        }
				, templateUrl: 'partials/create	Comment.html'
				, controller: 'DashboardCtrl'
			})
	        

	$urlRouterProvider.otherwise('/');
	
	$httpProvider.interceptors.push('AuthInterceptor');
})
.run(['$state', '$rootScope','Auth',function($state, $rootScope,Auth){

	
	$rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams, options){ 

		console.log($rootScope);
		$rootScope.isUserLoggedIn = Auth.isLoggedIn();
		if(toState.name === "home"){
             return;
          }
		// this should not be commented
        //event.preventDefault();
        // because here we must stop current flow.. .

		if(toState.name === "login" || toState.name === "register"){
			return;
		}
		if(!Auth.isLoggedIn() && toState.name!="login"){
			 event.preventDefault();
			 $state.transitionTo("login", null, {notify:false});
             $state.go('login');
		}
       
		
});
}])
