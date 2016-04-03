angular.module('influences')
.controller('indexCtrl', function($scope, userService) {

  userService.getCurrentUser().then(function(user) {
    if (user) this.currentUser = user;
  }.bind(this))

  this.active = {};





  $scope.$on('activateModal', function(s, modalType) {


    this.active = {};
    this.active.modal = true;
    this.active[modalType] = true;


  }.bind(this))

  $scope.$on('modal action complete', function(e, args) {
    var that = this;
    that.active = {};
    userService.getCurrentUser(function(user) {
      that.currentUser = user;
    });
  }.bind(this))

})
