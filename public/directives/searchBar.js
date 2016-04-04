angular.module('influences')
.directive('searchBar', function(artistService, genreService, $q) {

  return {
    restrict: 'AE',
    templateUrl: './directives/views/searchBar.html',
    scope: true,
    controllerAs: 'vw',
    controller: function($scope, artistService, genreService, searchService, $state) {
      var vw = this;
      vw.refreshItems = function(query) {
        searchService.searchForName(query)
        .then(function(data) {
          vw.items = data;
        })
      }

      vw.goTo = function(target) {
        $state.go(target.type, {id: target.id})
      }
      vw.test = "hello!";

    }
  }
