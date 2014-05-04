var scope;
angular.module('BullsAndCows').controller('LobbyController', [
  '$scope', '$rootScope', '$location', 'Server', 'PlayModes',
  function ($scope, $root, $location, Server, PlayModes) {
    scope = $scope
    $scope.config = {
      modes: PlayModes.all,
    }

    $scope.lobby = {
      gameId: undefined,
      joinDisabled: true
    }

    $scope.game = {
      playMode: undefined,
      showForm: false,
      startDisabled: true,
      showTitleInput: false,
      showNumberInput: false,
      errors: {},
      title: '',
      secret: ''
    }

    Server.joinLobby($root.loadGames);

    $scope.$on('$destroy', function () {
      Server.leaveLobby();
    })

    var resetGameErrors = function () {
      $scope.game.errors = {}
    }

    var playModeGameError = function () {
      $scope.game.errors = {
        mode: 'You need to select a valid game mode'
      };
    }

    $scope.selectGame = function (gameId) {
      $scope.gameId = $scope.lobby.gameId === gameId ? undefined : gameId;
      $scope.lobby.joinDisabled = undefined === $scope.lobby.gameId ? true : false;
    }

    $scope.isCurrentlySelectedGame = function (gameId) {
      return gameId === $scope.lobby.gameId;
    }

    $scope.toggleGameForm = function () {
      $scope.game.showForm = !$scope.game.showForm;
    }

    $scope.hasErrors = function (model) {
      if (undefined !== model && undefined !== $scope.game.errors[model])
        return true;

      return Object.keys($scope.game.errors).length > 0;
    }

    $scope.startGame = function () {
      resetGameErrors();
      if (!PlayModes.isValid($scope.game.mode)) {
        return playModeGameError();
      }

      var data = PlayModes.formatGameObject(
        $scope.game.mode,
        $scope.game.title,
        $scope.game.secret
      );

      return Server.createGame(data,
        function success(response) {
          console.log('Success:', response)
        },
        function fail(errors) {
          console.log(errors);
          $scope.$apply(function () {
            $scope.game.errors = errors;
          })
        }
      )
    }

    $scope.selectPlayMode = function () {
      var mode = PlayModes.get($scope.game.mode);
      resetGameErrors();

      $scope.game.startDisabled = false;
      $scope.game.showTitleInput = mode.isMultiplayer ? true : false;
      $scope.game.showNumberInput = (mode.isMultiplayer && !mode.isCooperative) ? true : false;
    }

    $scope.hasGames = function () {
      return Object.keys($root.games).length > 0;
    }

    $scope.joinGame = function () {

    }
  }
]);