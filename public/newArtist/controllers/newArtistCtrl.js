angular.module('influences')
.controller('newArtistCtrl', function($scope, artistService, $state, allArtists, allGenres) {
  this.createArtist = function(artist) {
    artistService.createArtist(artist)
    .then(function(res) {
      console.log('Res is', res, 'in artistService');
      $state.go('artist', {id: res.id})
    })
  }

  this.genreList = allGenres;
  this.artistList = allArtists;

})
