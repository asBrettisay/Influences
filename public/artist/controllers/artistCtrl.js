angular.module('influences')
.controller('artistCtrl', function($scope, artist, artistService, $state, allArtists, allGenres) {
  this.artist = artist;

  this.artistList = allArtists;

  this.genreList = allGenres;

  this.updateArtist = function(artist) {
    artistService.updateArtist(artist)
    .then(function(result) {
      $state.go('artist.show', {}, {reload: true});
    })
  };


})
