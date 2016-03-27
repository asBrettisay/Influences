angular.module('influences')
.service('artistService', function($http) {


  this.getArtist = function(id) {
    return $http({
      method: 'GET',
      url: '/api/artist/' + id,
    })
    .then(function(res) {
      return res.data;
    })
  }

  this.updateArtist = function(artist) {
    return $http({
      method: 'PUT',
      url: '/api/artist/' + artist.id,
      data: artist
    })
    .then(function(res) {
      return res.data;
    })
  }

  this.getAllArtists = function() {
    return $http({
      method: 'GET',
      url: '/api/artist/',
    })
    .then(function(res) {
      return res.data;
    })
  }

  this.createArtist = function(artist) {
    return $http({
      method: 'POST',
      data: artist,
      url: '/api/artist/'
    })
    .then(function(artist) {
      console.log('Artist in artistService', artist);
      return artist.data;
    })
  }

  this.deleteArtist = function(artist) {
    return $http({
      method: "DELETE",
      url: '/api/artist/' + artist.id
    })
    .then(function(res) {
      return res.data;
    })
  }
});
