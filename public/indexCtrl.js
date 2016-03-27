angular.module('influences')
.controller('indexCtrl', function($scope, userService) {

  userService.getCurrentUser().then(function(user) {
    console.log('User from userService is', user);
    if (user) this.currentUser = user;
  }.bind(this))

  this.active = {};




  $scope.$on('activateModal', function(s, modalType) {

    console.log('Activating modal!');

    this.active = {};
    this.active.modal = true;
    this.active[modalType] = true;
    console.log('this is', this);
    console.log('This active is', this.active);


  }.bind(this))

  $scope.$on('modal action complete', function(e, args) {
    var that = this;
    that.active = {};
    userService.getCurrentUser(function(user) {
      that.currentUser = user;
      console.log(that.currentUser)
    });
  }.bind(this))

  console.log('Current user is', this.currentUser);
})
