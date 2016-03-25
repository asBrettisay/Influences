angular.module('influences')
.controller('artistCtrl', function($scope, artist, artistService, $state, allArtists, allGenres) {
  this.artist = artist;
  console.log(this.artist);

  this.artistList = allArtists;

  this.genreList = allGenres;

  this.groupArtists = function(item) {
    if (item.fullName >= 'A' && item.fullName <= 'M')
      return 'From A - M';

    if (item.fullName >= 'N' && item.fullName <= 'Z')
      return 'From N - Z';
  };

  this.updateArtist = function(artist) {
    artistService.updateArtist(artist)
    .then(function(result) {
      $state.go('artist.show', {}, {reload: true});
    })
  };

})
