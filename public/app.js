'use strict'

angular.module('influences', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/main')

  $stateProvider
    .state('main', {
      url: '/main',
      templateUrl: './main/views/main.html',
      controller: 'mainCtrl',
      controllerAs: 'main',
      resolve: {
        genre: function(genreService) {
          return genreService.getGenre('jazz');
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
        }
      }
    })
})
