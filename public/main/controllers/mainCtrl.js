angular.module('influences')
.controller('mainCtrl', function(genre) {
  this.test = 'Hello world!';
  this.test2 = 'Directives online!';

  this.genre = genre;
});
