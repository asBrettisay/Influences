angular.module('influences')
.controller('genreCtrl', function($scope, genre, genreList) {
  this.genre = genre;

  this.genreList = genreList
  console.log(genre);
})
