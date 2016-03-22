angular.module('influences')
.service('artistService', function() {
  this.getArtist = function(id) {
    return {
      name: 'Louie Armstrong',
      desc: 'Louis Armstrong (August 4, 1901 – July 6, 1971), nicknamed Satchmo or Pops, was an African American jazz trumpeter, composer and singer who became one of the pivotal and most influential figures in jazz music. His career spanned five decades, from the 1920s to the 1960s, and different eras in jazz.',
      proteges: [
        {
          name: 'Duke Ellington'
        },
        {
          name: 'Bing Crosby'
        }
      ]
    }
  }
});
