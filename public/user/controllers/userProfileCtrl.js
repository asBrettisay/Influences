angular.module('influences')
.controller('userProfileCtrl', function($scope, userService) {
  userService.getCurrentUser().then(function(user) {
    this.user = user;
    console.log('user profile', this.user);
  }.bind(this))

  this.updateUser = function(user) {
    userService.updateUser(user)
  }
})
