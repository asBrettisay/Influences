angular.module('influences')
.service('userService', function($http) {
  this.getCurrentUser = function() {
    return $http.get('/api/users/current').then(function(res) {
      return res.data;
    })
  }
})
