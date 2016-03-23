angular.module('influences')
.controller('genreCtrl', function($scope, genre) {
  this.genre = genre;
  console.log(genre);
})
