(function() {
  'use strict'

  angular.module('mainService', [])
    .factory('MainService', function($http, $q, AuthToken, config) {

      var mainFactory = {};

      var baseUrl = config.apiUrl;

      mainFactory.getUsers = function() {
        return $http.get(baseUrl + 'register', config.contentTypeConfig)
          .success(function(serviceResponse) {
            return serviceResponse;
          })

      };


      mainFactory.getProjectTasks = function(pId, offSet, max) {
        var data = {
          projectId: pId,
          offset: offSet,
          maxResultSet: max
        };

        var url = baseUrl.concat("api/project/").concat(pId).concat("/task");
        return $http({
          method: 'GET',
          url: url,
          params: data
        })
          .success(function(serviceResponse) {
            return serviceResponse;
          });

      };

      mainFactory.getTaskComments = function(data) {

        var url = baseUrl.concat("api/project/").concat(data.projectId).concat("/task/").concat(data.taskId).concat("/comment");
        return $http({
          method: 'GET',
          url: url,
          params: data
        })
          .success(function(serviceResponse) {
            return serviceResponse;
          });

      };



      mainFactory.createProject = function(projectName, description) {
        return $http.post(baseUrl + 'api/project', $.param({
          projectName: projectName,
          description: description
        }), config.contentTypeConfig)
          .success(function(serviceResponse) {
            return serviceResponse;
          })

      }

      mainFactory.deleteProject = function() {


      }

      mainFactory.saveTask = function(data) {
        var url = baseUrl.concat("api/project/").concat(data.projectId).concat("/task");

        return $http.post(url, $.param(data), config.contentTypeConfig)
          .success(function(serviceResponse) {
            return serviceResponse;
          })

      }

      mainFactory.deleteTask = function(projectId, taskId) {
        var url = baseUrl.concat("api/project/").concat(projectId).concat("/task/").concat(taskId);

        return $http.delete(url, config.contentTypeConfig)
          .success(function(serviceResponse) {
            return serviceResponse;
          })

      }

      mainFactory.updateTask = function() {

      }

      mainFactory.saveComment = function(data) {

        var url = baseUrl.concat("api/project/").concat(data.projectId).concat("/task/").concat(data.taskId).concat("/comment")

        return $http.post(url, $.param(data), config.contentTypeConfig)
          .success(function(serviceResponse) {
            return serviceResponse;
          })
      }

      mainFactory.deleteComment = function(data) {
        var url = baseUrl.concat("api/project/").concat(data.projectId).concat("/task/").concat(data.taskId).concat("/comment/").concat(data.commentId);

        return $http.delete(url, config.contentTypeConfig)
          .success(function(serviceResponse) {
            return serviceResponse;
          });

      }

      mainFactory.updateComment = function() {

      }

      return mainFactory;

    });
})();
