angular.module('influences')
.directive('signupModal', function() {
  return {
    restrict: 'AE',
    scope: true,
    templateUrl: './directives/views/signupModal.html',
    controller: function($scope, userService, $state) {
      $scope.signupUser = function(user) {
        userService.signupUser(user).then(function(res) {
          $state.go('/');
        })
      }

    }
  }
})
