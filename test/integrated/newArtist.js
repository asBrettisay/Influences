'use strict'

const
  faker = require('faker'),
  makeFake = require('../helpers/fakers');

describe('angularjs homepage todo list', function() {
  it('should create an artist', function() {
    let newArtist = makeFake.Artist();

    browser.get('http://localhost:3000/');

    element(by.id('main-menu-button')).click();
    element(by.id('menu-log-in')).click();

    element(by.model('user.username')).sendKeys('Brett@brett.com');
    element(by.model('user.password')).sendKeys('dogs');
    element(by.id('log-in-button')).click();

    browser.wait(protractor.until.elementLocated(By.id("user-icon")), 5000);


    element(by.id('main-menu-button')).click();
    let button = browser.wait(
      protractor.until.elementLocated(By.id('menu-new-artist')), 10000);
    button.click();

    element(by.model('vw.artist.fullName')).sendKeys(newArtist.fullName)
    element(by.model('vw.artist.description')).sendKeys(newArtist.description)
    element(by.id('new-artist-submit')).click();

    expect(element(by.id('artist-bio-name')).getText())
      .toEqual(newArtist.fullName);

    expect(element(by.id('artist-bio-bio')).getText())
      .toEqual(newArtist.description);

  });
});
