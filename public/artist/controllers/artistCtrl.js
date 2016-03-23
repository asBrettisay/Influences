angular.module('influences')
.controller('artistCtrl', function($scope, artist, artistService, $state) {
  this.artist = artist;

  this.updateArtist = function(artist) {
    artistService.updateArtist(artist)
    .then(function(result) {
      $state.go($state.current, {}, {reload: true});
    })
  };

  
})
