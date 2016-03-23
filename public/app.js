'use strict'

angular.module('influences', ['ui.router',
                              'ui.select',
                              'ngSanitize'])
.config(function($stateProvider, $urlRouterProvider) {
  // $urlRouterProvider.otherwise('/main')

  $stateProvider
    .state('main', {
      url: '/main',
      templateUrl: './main/views/main.html',
      controller: 'mainCtrl',
      controllerAs: 'main',
      resolve: {
        genre: function(genreService) {
          return genreService.getRandomGenre();
        }
      }
    })
    .state('genre', {
      url: '/genre/:id',
      templateUrl: './genre/views/genre.html',
      controller: 'genreCtrl',
      controllerAs: 'vw',
      resolve: {
        genre: function(genreService, $stateParams) {
          return genreService.getGenre($stateParams.id);
        }
      }
    })
    .state('artist', {
      url: '/artist/:id',
      templateUrl: './artist/views/artist.html',
      controller: 'artistCtrl',
      controllerAs: 'vw',
      resolve: {
        artist: function(artistService, $stateParams) {
          return artistService.getArtist($stateParams.id);
        },
        allArtists: function(artistService) {
          return artistService.getAllArtists();
        },
        allGenres: function(genreService) {
          return genreService.getAllGenres();
        }
      }
    })
    .state('artist.show', {
      templateUrl: './artist/views/show.html',
    })
    .state('artist.edit', {
      url: '/edit',
      templateUrl: './artist/views/edit-artist.html',
    })
    .state('newArtist', {
      url: '/artist/new',
      templateUrl: './newArtist/views/artist.html',
      controller: 'newArtistCtrl',
      controllerAs: 'vw',
    })
})
