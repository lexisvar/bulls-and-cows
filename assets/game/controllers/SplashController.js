'use strict';

(function () {
  var Splash = function ($scope, Player, Location, $timeout) {
    this.player = Player;
    this.location = Location;
    this.timeout = $timeout;
    this.scope = $scope;

    this.welcome = {
      show: false,
      animate: false,
      returning: Player.hasId()
    }

    this.form = {
      name: '',
      show: false,
      error: false
    }
  }

  Splash.$inject = ['$scope', 'Player', 'Location', '$timeout'];

  Splash.prototype.toLobby = function () {
    if (this.player.hasId()) {
      return this.displayWelcome();
    }

    this.form.show = true;
  }

  Splash.prototype.displayWelcome = function () {
    if (this.welcome.show)
      return false;

    this.welcome.show = true;
    this.form.show = false;

    var splash = this;

    this.timeout(function () {
      splash.welcome.animate = true;
      splash.timeout(function () {
        splash.location.goToLobby();
      }, 1000)
    }, 2000)
  }

  Splash.prototype.register = function () {
    this.form.error = false;

    var splash = this;
    var success = function () {
      splash.displayWelcome.call(splash);
      splash.scope.$apply();
    }

    var fail = function (error) {
      splash.registerError.call(splash, error);
      splash.scope.$apply();
    }

    this.player.register(this.form.name, success, fail);
  }

  Splash.prototype.registerError = function (error) {
    this.form.error = error;
  }

  angular.module('BullsAndCows').controller('SplashController', Splash);
})()