angular.module('influences')
.service('genreService', function($http) {
  this.getRandomGenre = function() {
    return $http({
      method: 'GET',
      url: '/api/genre/random'
    })
    .then(function(res) {
      if (res.status === 200) {
        return res.data;
      }
    })
    .catch(function(err) {
      throw err;
    })
  }
});
