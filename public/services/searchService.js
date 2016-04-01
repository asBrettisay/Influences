angular.module('influences')
.service('searchService', function($http) {

  this.searchForName = function(query) {
    return $http({
      method: 'GET',
      url: '/api/search/?query=' + query
    })
    .then(function(data) {
      return data.data
    })
  }
})
