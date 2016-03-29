angular.module('influences')
.controller('genreCtrl', function($scope, artistList, genre, genreList, genreService, $state) {
  this.genre = genre;

  this.genreList = genreList

  this.artistList = artistList


  this.updateGenre = function(genre) {
    console.log('GEnre in ctrl', genre);
    genreService.updateGenre(genre)
    .then(function(result) {
      $state.go('genre.show', {}, {reload: true});
    })
  }
})
