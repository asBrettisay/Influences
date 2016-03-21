angular.module('influences')
.service('genreService', function($http) {
  this.getGenre = function(genre) {
    return {
      genre: 'Jazz',
      founders: [
        {
          name: "Joe 'King' Oliver",
          proteges: [
            {
              name: "Louie Armstrong",
              proteges: [
                {
                  name: 'Duke Ellington',
                },
                {
                  name: 'Bing Crosby'
                }
              ]
            },
            {
              name: 'Tommy Ladnier'
            },
            {
              name: 'Paul Mares'
            },
            {
              name: ' Muggsy Spanier'
            },
            {
              name: 'Johnny Wiggs'
            },
            {
              name: 'Louis Panico'
            },
            {
              name: 'Frank Guarente'
            }
          ]
        },
        {
          name: 'Scott Joplin',
        },
        {
          name: "Charles 'Buddy' Bolden",
        },
        {
          name: 'Buddy Bolden',
          proteges: [
            {
              name: 'Sidney Bechet'
            },
            {
              name: 'Duke Ellington'
            }
          ]
        }
      ]
    }
  }
});
