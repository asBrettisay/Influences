angular.module('influences')
.service('artistService', function($http) {
  // this.getArtist = function(id) {
  //   return {
  //     name: 'Louie Armstrong',
  //     description: 'Louis Armstrong (August 4, 1901 – July 6, 1971), nicknamed Satchmo or Pops, was an African American jazz trumpeter, composer and singer who became one of the pivotal and most influential figures in jazz music. His career spanned five decades, from the 1920s to the 1960s, and different eras in jazz.',
  //     proteges: [
  //       {
  //         name: 'Duke Ellington'
  //       },
  //       {
  //         name: 'Bing Crosby'
  //       }
  //     ]
  //   }
  // }

  this.getArtist = function(id) {
    return $http({
      method: 'GET',
      url: '/api/artist/' + id,
    })
    .then(function(res) {
      return res.data;
    })
  }

  this.updateArtist = function(artist) {
    return $http({
      method: 'PUT',
      url: '/api/artist/' + artist.id,
      data: artist
    })
    .then(function(res) {
      return res.data;
    })
  }

  this.getAllArtists = function() {
    return $http({
      method: 'GET',
      url: '/api/artist/',
    })
    .then(function(res) {
      return res.data;
    })
  }
});
