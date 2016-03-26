angular.module('influences')
.directive('loginModal', function() {
  return {
    restrict: 'AE',
    scope: {},
    templateUrl: './directives/views/loginModal.html',
    controller: function($scope, userService, $state) {
      $scope.loginUser = function(user) {
        userService.loginUser(
          {
            username: user.username,
            password: user.password,
          })
          .then(function(res) {
            console.log('Res is', res);
            $state.go('genre', {id: 2})
            $scope.$emit('modal action complete')
          })
      }
    }

  }
})
