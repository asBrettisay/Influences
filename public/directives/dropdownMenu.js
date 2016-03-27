angular.module('influences')
.directive('dropdownMenu', function() {
  return {
    restrict: 'AE',
    templateUrl: './directives/views/dropdownMenu.html',
    scope: {
      currentUser: '='
    },
    controller: function($scope, userService, $state) {
      $scope.activateModal = function(modalType) {
        $scope.$emit('activateModal', modalType);
        $scope.menuActive = false;
      };

      $scope.logoutUser = function() {
        userService.logoutUser()
        $scope.menuActive = false;
        $state.go('main');
      }

      $scope.$on('close menu', function() {
        $scope.menuActive = false;
      })

    },
    link: function(scope, elem, attrs) {
      var menuButton = elem.find('div.menuButtonContainer');
      menuButton.on('mouseenter', function() {
        console.log('Mouse enter');
        menuButton.toggleClass('menuButtonContainerHover');
      })

      menuButton.on('mouseleave', function() {
        menuButton.toggleClass('menuButtonContainerHover')
      })
    }
  }
})
