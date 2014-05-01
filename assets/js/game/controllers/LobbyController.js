var scope;
angular.module('BullsAndCows').controller('LobbyController', ['$scope', '$socket', '$location', 'PlayModes',
  function ($scope, $socket, $location, Modes) {

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

    $scope.config = {
      modeSelected: null,
      showGameDialog: null,
      selectedGameId: null,
      playModes: Modes.all
    }


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


    $scope.selectGameToJoin = function (gameId) {
      $scope.selectedGameId = $scope.selectedGameId === gameId ? null : gameId;
    }

    $scope.isCurrentlySelectedGame = function (gameId) {
      return gameId === $scope.config.selectedGameId;
    }

    $scope.toggleGameDialogue = function () {
      $scope.config.showGameDialog = !$scope.config.showGameDialog;
    }

    $scope.getGameModes = function () {
      return $scope.config.playModes;
    }

    $scope.isJoinDisabled = function () {
      return $scope.config.selectedGameId === null;
    }

    $scope.setPlayMode = function (gameMode) {
      $scope.config.modeSelected = gameMode;
    }

    $scope.startGame = function () {
      if (undefined === $scope.gameModes[$scope.modeSelected]) {
        alert('You need to select a valid game mode');
        return false;
      }

      $location.path('/game');
    }

    $scope.isStartDisabled = function () {
      return $scope.modeSelected === null;
    }

    $scope.hasGames = function () {
      return $scope.games.length > 0;
    }

    $scope.joinGame = function () {

    }
  }
]);