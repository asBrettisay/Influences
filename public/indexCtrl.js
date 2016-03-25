angular.module('influences')
.controller('indexCtrl', function($scope, userService) {

  userService.getCurrentUser().then(function(user) {
    if (user) this.currentUser = user;
  })

  console.log(this.currentUser);
})
