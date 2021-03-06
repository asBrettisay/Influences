angular.module('influences')
.service('userService', function($http) {
  this.getCurrentUser = function(cb) {
    return $http.get('/api/current/user').then(function(res) {
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
      return res;
    })
    .error(function(err) {
      console.log(err);
    })
  }

  this.logoutUser = function() {
    return $http({
      method: 'POST',
      url: '/logout',
    })
    .then(function(res) {
      return res;
    })
    .error(function(err) {
      console.log(err);
    })
  }

  this.getInviteToken = function() {
    console.log('in User service');
    return $http({
      method: 'POST',
      url: '/api/users/token'
    })
    .then(function(res) {
      console.log(res);
      return res.data;
    })
  }

})
