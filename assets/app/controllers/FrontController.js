(function () {
  var Front = function ($scope, Player, Location, Loading) {
    this.player = Player;
    this.location = Location;

    $scope.loading = Loading;
    $scope.app = {
      init: false
    }

    var FC = this;
    this.player.getIdentity(function (response) {
      $scope.$apply(function () {
        FC.handleIdentity.call(FC, response);
        $scope.app.init = true;
      })
    });
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
})()