angular.module('BullsAndCows').controller('LobbyController', [
  '$scope', '$rootScope', '$location', '$timeout', 'Server', 'PlayModes',
  function ($scope, $root, $location, $timeout, Server, PlayModes) {

    $scope.config = {
      modes: PlayModes.all,
    }

    $scope.lobby = {
      gameId: undefined,
      joinDisabled: true,
      leave: true
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
      if (true === $scope.lobby.leave) {
        Server.lobbyLeave();
      }
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
     * @param  {integer}  gameId Selected game' id
     * @return {Boolean}         True if the currently selected id
     */
    $scope.isCurrentlySelectedGame = function (gameId) {
      return gameId === $scope.lobby.gameId;
    }

    /**
     * Toggle the state of the showForm flag
     * @return {void}
     */
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

      // send request to server
      return Server.gameCreate(data,

        // set game to $rootScope and redirect to game controller
        function onCreateSuccess(response) {
          Server.gameEnter(response.id, function () {
            $location.path('/game/' + response.id);
            $scope.$apply();
          })
        },

        // apply errors to $scope
        function onCreateFail(errors) {
          $scope.$apply(function () {
            $scope.game.errors = errors;

            // if error of type 'has game' -> redirect to game controller
            if (errors.hasGame) {
              $timeout(
                function redirectToGame() {
                  $location.path('/game/' + $root.playerGetGame());
                }, 2000);
            }
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
      return Object.keys($root.lobbyGetGames()).length > 0;
    }

    $scope.joinGame = function () {
      Server.gameJoin($scope.lobby.gameId);
    }
  }
]);