angular.module('influences')
.service('userService', function($http) {
  this.getCurrentUser = function(cb) {
    console.log('Getting current user...');
    return $http.get('/api/users/current').then(function(res) {
      console.log('Res data from get request is', res.data);
      return cb ? cb(res.data) : res.data;
    })
  }

  this.loginUser = function(user) {
    return $http({
      method: 'POST',
      data: user,
      url: '/login',
    })
    .then(function(response) {
      return response.data;
    })
  }

  this.signupUser = function(user) {
    return $http({
      method: 'POST',
      data: user,
      url: '/signup',
    })
    .then(function(res) {
      return res.data;
    })
  }

  this.updateUser = function(user) {
    return $http({
      method: 'PUT',
      data: user,
      url: '/api/users/' + user.id
    })
    .success(function(res) {
      return res.data;
    })
    .error(function(err) {
      console.log(err);
    })
  }

})
