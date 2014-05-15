'use strict';

(function () {
  var Front = function ($scope, Player, Location, Loading) {
    this.player = Player;
    this.location = Location;
    this.scope = $scope;

    this.scope.loading = Loading;
    this.scope.app = {
      init: false
    }

    this.player.getIdentity(function (response) {
      this.handleIdentity(response);
      this.scope.app.init = true;
      this.scope.$apply();
    }, this);
  }

  Front.$inject = ['$scope', 'Player', 'Location', 'Loading'];

  Front.prototype.handleIdentity = function (response) {
    if (this.player.hasId()) {
      var gameId = this.location.getGameIdFromRequest() || this.player.getGame();
      if (gameId) {
        return this.location.goToGame(gameId);
      }
    } else {
      this.location.goToHomepage();
    }
  }

  angular.module('BullsAndCows').controller('FrontController', Front);
})();