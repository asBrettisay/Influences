'use strict'

angular.module('influences', [
                              'ui.router',
                              'ui.select',
                              'ngSanitize'
                            ])
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/main')

  $stateProvider
    .state('main', {
      url: '/main',
      templateUrl: './main/views/main.html',
      controller: 'mainCtrl',
      controllerAs: 'main',
      resolve: {
        genreList: function(genreService) {
          return genreService.getAllGenres();
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
        },
        genreList: function(genreService) {
          return genreService.getAllGenres();
        },
        artistList: function(artistService) {
          return artistService.getAllArtists();
        }
      }
    })
    .state('genre.show', {
      url: '/show',
      templateUrl: './genre/views/show.html'
    })
    .state('genre.edit', {
      url: '/edit',
      templateUrl: './genre/views/edit.html'
    })
    .state('newGenre', {
      url: '/genre/new',
      templateUrl: './newGenre/views/new.html',
      controller: 'newGenreCtrl',
      controllerAs: 'vw',
      resolve: {
        genreList: function(genreService) {
          return genreService.getAllGenres();
        },
        artistList: function(artistService) {
          return artistService.getAllArtists();
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
      resolve: {
        allArtists: function(artistService) {
          return artistService.getAllArtists();
        },
        allGenres: function(genreService) {
          return genreService.getAllGenres();
        }
      }
    })
    .state('profile', {
      url: '/user/profile',
      templateUrl: './user/views/profile.html',
      controller: 'userProfileCtrl',
      controllerAs: 'vw'
    })
    .state('admin', {
      url: '/admin/',
      templateUrl: './admin/views/admin.html',
      controller: 'adminCtrl',
      controllerAs: 'vw',
      resolve: {
        artistsList: function(artistService) {
          return artistService.getAllArtists();
        },
        genresList: function(genreService) {
          return genreService.getAllGenres();
        }
      }
    })
    .state('admin.artist', {
      templateUrl: './admin/views/artist.html'
    })
    .state('admin.genres', {
      templateUrl: './admin/views/genres.html'
    })


})
.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var match = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            match = true;
            break;
          }
        }

        if (match) {
          out.push(item);
        }
      });
    } else {
      out = items;
    }
    return out;
  };
});
