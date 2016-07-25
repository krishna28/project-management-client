'use strict';

/**
 * @ngdoc overview
 * @name projectManagementApplicationApp
 * @description
 * # projectManagementApplicationApp
 *
 * Main module of the application.
 */
angular
  .module('projectManagementApplicationApp', ['appRoutes','authService','mainService','appController','trNgGrid'])
 .constant('config',{
	       appName: 'Project Management Application',
		   apiUrl:'http://localhost:8080/project-management-application/',
	       roles:{
	       	manager:'ROLE_MANAGER',
			user:'ROLE_USER'   
	       },
	       contentTypeConfig:{
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
       }
});