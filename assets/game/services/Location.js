(function () {

  var Location = function ($location, $route, $routeParams, Player) {
    this.location = $location;
    this.route = $route;
    this.params = $routeParams;
    this.player = Player;
  }

  Location.prototype.redirect = function (path) {
    if (this.location.path() === path) {
      return this.route.reload();
    }

    return this.location.path(path);
  }

  Location.prototype.getGameIdFromRequest = function () {
    var gameIdRegex = /\/game\/([\d]+)/gm,
      path = this.location.$$path,
      parse = gameIdRegex.exec(path);

    return null !== parse ? parse[1] : null;
  }

  Location.prototype.goToHomepage = function () {
    return this.redirect('/');
  }

  Location.prototype.goToLobby = function () {
    return this.redirect('/lobby');
  }

  Location.prototype.goToGame = function (gameId) {
    return this.redirect('/game/' + gameId);
  }

  Location.prototype.goToPlayerGame = function () {
    return this.goToGame(this.player.getGame());
  }

  Location.$inject = ['$location', '$route', '$routeParams', 'Player'];
  angular.module('BullsAndCows').service('Location', Location);

})()