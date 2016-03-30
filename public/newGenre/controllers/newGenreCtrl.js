angular.module('influences')
.controller('newGenreCtrl', function($scope, artistList, genreList, genreService, $state) {

  this.artistList = artistList;

  this.genreList = genreList;

  this.createGenre = function(genre) {
    genreService.createGenre(genre)
    .then(function (genre) {
      $state.go('genre.show', {id: genre.id});
    })
  }
})
