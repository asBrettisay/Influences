angular.module('influences')
.controller('adminCtrl', function($scope, artistsList, genresList, artistService, genreService, $state, userService) {
  this.artistsList = artistsList;
  this.genresList = genresList;

  this.deleteArtist = function(artist) {
    var that = this;
    artistService.deleteArtist(artist)
    .then(function (res) {
      artistService.getAllArtists()
      .then(function (artists) {
        that.artistsList = artists;
      });

    });
  }.bind(this);


  this.generateInviteToken = function() {
    console.log('Getting token');
    var that = this;
    userService.getInviteToken()
    .then(function(token) {
      console.log(token);
      that.inviteToken = token.inviteToken;
    });
  }.bind(this);


});
