angular.module('influences')
.controller('genreCtrl', function($scope, genre) {
  this.genre = genre;
  console.log(this.genre);
  console.log("In genreCtrl");
})
