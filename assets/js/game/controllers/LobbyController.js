var scope;
angular.module('BullsAndCows').controller('LobbyController', [
  '$scope', 'Server', '$location', 'PlayModes',
  function ($scope, Server, $location, Modes) {
    scope = $scope
    $scope.config = {
      playMode: undefined,
      gameId: undefined,
      showGameDialog: false,
      joinDisabled: true,
      startDisabled: true,
      showTitleInput: false,
      showNumberInput: false,
      playModes: Modes.all,
      title: '',
      secret: ''
    }

    $scope.games = {}

    Server.joinLobby(function (games) {
      $scope.games = games;
    });

    $scope.$on('$destroy', function () {
      Server.leaveLobby();
    })

    $scope.selectGame = function (gameId) {
      $scope.gameId = $scope.gameId === gameId ? undefined : gameId;
      $scope.config.joinDisabled = undefined === $scope.gameId ? true : false;
    }

    $scope.isCurrentlySelectedGame = function (gameId) {
      return gameId === $scope.config.gameId;
    }

    $scope.toggleGameDialogue = function () {
      $scope.config.showGameDialog = !$scope.config.showGameDialog;
    }

    $scope.startGame = function () {
      if (Modes.isValid($scope.config.playMode)) {
        alert('You need to select a valid game mode');
        return false;
      }

      Server.createGame($scope.config,
        function done() {
          $location.path('/game');
        })
    }

    $scope.selectPlayMode = function () {
      var mode = Modes.get($scope.config.playMode);

      $scope.config.startDisabled = false;
      $scope.config.showTitleInput = mode.isMultiplayer ? true : false;
      $scope.config.showNumberInput = (mode.isMultiplayer && !mode.isCooperative) ? true : false;
    }

    $scope.hasGames = function () {
      return $scope.games.length > 0;
    }

    $scope.joinGame = function () {

    }
  }
]);