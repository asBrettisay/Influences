angular.module('influences')
.service('genreService', function($http) {
  this.getGenre = function(genre) {
    console.log('Getting genre...');
    return {
      genre: 'Jazz',
      founders: [
        {
          name: "Joe 'King' Oliver",
        },
        {
          name: 'Scott Joplin',
        },
        {
          name: "Charles 'Buddy' Bolden",
        }
      ]
    }
  }
});
