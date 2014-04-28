var scope;
angular.module('BullsAndCows').controller('LobbyController', ['$scope', '$socket', '$location', '$rootScope',
  function ($scope, $socket, $location, $rootScope) {
    scope = $scope;
    $scope.games = [{
      id: 1,
      name: "Somebody's game",
      player: "Andrew",
      mode: "PvP"
    }, {
      id: 2,
      name: "Another game",
      player: 'Johnny',
      mode: "Co-op"
    }];

    $scope.root = $rootScope;
    $scope.modeSelected = null;

    //$scope.gameModes = $rootScope.gameModes;
    $scope.joinGameId = null;
    $scope.gameDialogue = false;

    /*
    // register/unregister listeners
    (function () {
      // update game list callback
      var updateGameList = function (res) {

      }

      // subscribe for listener and get current data
      $socket.get('/lobby/join', null, function (res) {
        // register listener
        $socket.on('update', updateGameList);
        updateGameList(res);
      });

      // unregister listener on $scope.$destroy
      $scope.$on('$destroy', function () {
        $socket.removeListener('update', updateGameList);
      });
    })();*/


    $scope.toggleJoinGame = function (gameId) {
      $scope.joinGameId = $scope.joinGameId === gameId ? null : gameId;
    }

    $scope.getGameModes = function () {
      return $scope.gameModes;
    }

    $scope.isCurrentJoinGame = function (gameId) {
      return gameId === $scope.joinGameId;
    }

    $scope.toggleGameDialogue = function () {
      $scope.gameDialogue = !$scope.gameDialogue;
    }

    $scope.joinGameDisabled = function () {
      return $scope.joinGameId === null;
    }

    $scope.setGameMode = function (gameMode) {
      $scope.modeSelected = gameMode;
    }

    $scope.startGameDisabled = function () {
      return $scope.modeSelected === null;
    }

    $scope.startGame = function () {
      if (undefined === $scope.gameModes[$scope.modeSelected]) {
        alert('You need to select a valid game mode');
        return false;
      }

      $location.path('/game');
    }

    $scope.hasGames = function () {
      return $scope.games.length > 0;
    }

    $scope.joinGame = function () {

    }
  }
]);