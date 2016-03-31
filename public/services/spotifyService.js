angular.module('influences')
.service('spotifyService', function($http) {

  var base = {
    url: 'https://api.spotify.com/v1/search?q=',
    tag: '&type=artist&limit=1'
  };

  this.getArtistImage = function(artist) {
    artist = artist.split(' ').join('+');
    return $http({
      method: 'GET',
      url: base.url + artist + base.tag
    })
    .then(function(response) {
      console.log(response.data);
      return response.data.artists.items[0].images[0];
    })
  }
})
