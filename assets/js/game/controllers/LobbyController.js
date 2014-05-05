angular.module('BullsAndCows').controller('LobbyController', [
  '$scope', '$rootScope', '$location', 'Server', 'PlayModes',
  function ($scope, $root, $location, Server, PlayModes) {

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

    // join the lobby -> get current open games and subscribe
    // for changes
    Server.lobbyJoin($root.lobbyLoad);

    // on scope destroy, leave the lobby -> unsubscribe socket
    $scope.$on('$destroy', function () {
      Server.leaveLobby();
    })

    /**
     * Resets the game errors
     * @return {void}
     */
    var resetGameErrors = function () {
      $scope.game.errors = {}
    }

    /**
     * Sets a game error for the player mode
     * @return {[type]} [description]
     */
    var playModeGameError = function () {
      $scope.game.errors = {
        mode: 'You need to select a valid game mode'
      };
    }

    /**
     * Additional functionality when a game from the game menu is selected
     * @param  {integer} gameId The id of the game
     * @return {void}
     */
    $scope.selectGame = function (gameId) {
      $scope.gameId = $scope.lobby.gameId === gameId ? undefined : gameId;
      $scope.lobby.joinDisabled = undefined === $scope.lobby.gameId ? true : false;
    }

    /**
     *
     */
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

      return Server.gameCreate(data,
        function success(response) {
          $root.gameSet(response);
          $location.path('/game');
        },
        function fail(errors) {
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
      Server.joinGame($scope.lobby.gameId);
    }
  }
]);