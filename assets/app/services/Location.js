'use strict';

(function () {

  var Location = function ($location, $routeParams, Player) {
    this.location = $location;
    this.params = $routeParams;
    this.player = Player;
  }

  Location.prototype.getGameIdFromRequest = function () {
    var gameIdRegex = /\/game\/([\d]+)/gm,
      path = this.location.$$path,
      parse = gameIdRegex.exec(path);

    return null !== parse ? parse[1] : null;
  }

  Location.prototype.goToHomepage = function () {
    return this.location.path('/');
  }

  Location.prototype.goToLobby = function () {
    return this.location.path('/lobby');
  }

  Location.prototype.goToGame = function (gameId) {
    return this.location.path('/game/' + gameId);
  }

  Location.prototype.goToPlayerGame = function () {
    return this.goToGame(this.player.getGame());
  }

  Location.$inject = ['$location', '$routeParams', 'Player'];
  angular.module('BullsAndCows').service('Location', Location);

})();