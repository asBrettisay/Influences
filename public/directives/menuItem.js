angular.module('influences')
.directive('menuItem', function() {
  return {
    restrict: 'A',
    scope: {},
    link: function(scope, elem, attrs) {
      elem.on('mouseenter', function() {
        elem.toggleClass('menu-item-hover')
      })
      elem.on('mouseleave', function() {
        elem.toggleClass('menu-item-hover')
      })

      elem.on('click', function() {
        scope.$emit('close menu');
      })
    }
  }
})
