angular.module('influences')
.service('genreService', function($http, $state) {
  this.getRandomGenre = function() {
    console.log('Going to get random genre...');
    return $http({
      method: 'GET',
      url: '/api/genre/random'
    })
    .success(function(res) {
      console.log('Going to genre id', res);
      $state.go('genre', {id: res.id});
    })
  },

  this.createGenre = function(genre) {
    return $http({
      method: 'POST',
      url: '/api/genre',
      data: genre
    })
    .then(function (response) {
      return response.data;
    })
  }

  this.getAllGenres = function() {
    return $http({
      method: 'GET',
      url: '/api/genre/'
    })
    .then(function(res) {
      return res.data;
    })
  },

  this.getGenre = function(id) {
    return $http({
      method: 'GET',
      url: '/api/genre/' + id
    })
    .then(function(res) {
      return res.data;
    })
  },


  this.updateGenre = function(genre) {
    genre = {
      name: genre.name,
      type: genre.type,
      founders: genre.founders,
      artists: genre.artists,
      id: genre.id
    }
    console.log('Genre going to http request', genre);
    return $http({
      method: 'PUT',
      url: '/api/genre/' + genre.id,
      data: genre
    })
    .then(function(data) {
      return data.data;
    })
  }
});
