angular.module('influences')
.controller('mainCtrl', function(genreList) {
  this.genreList = genreList
  console.log('In main ctrl, this genrelist', this.genreList);
});
