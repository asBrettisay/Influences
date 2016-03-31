angular.module('influences')
.directive('artistHeader', function() {
  return {
    restrict: 'A',
    scope: {
      image: '='
    },
    link: function(scope, elem, attrs) {

      elem.append('<img src=' + scope.image.url + '>')

      elem.append('<div class="black"></div>')
      elem.append('<div class="red"></div>')
      elem.append('<div class="blue"></div>')


    }
  };
});
