angular.module('BullsAndCows').controller('LobbyController', [
  '$scope', '$rootScope', '$location', '$timeout', 'Server', 'PlayModes',
  function ($scope, $root, $location, $timeout, Server, PlayModes) {
    'use strict';

    /**
     * $rootScope aliases
     */
    $scope.getGames = $root.lobbyGetGames;
    $scope.hasGames = $root.lobbyHasGames;

    /**
     * Models
     */

    // scope config contains the play modes
    $scope.config = {
      modes: PlayModes.all,
    }

    // flags and state values for the lobby and the form
    $scope.lobby = {
      gameId: undefined,
      joinDisabled: true,
      isCooperative: true,
      errors: null,
      secret: ''
    }

    // flags and state values for the "new game" form
    $scope.game = {
      mode: undefined,
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
      Server.lobbyLeave();
    })

    /**
     * Resets the game errors
     * @return {void}
     */
    var resetGameErrors = function () {
      $scope.lobby.errors = null;
      $scope.game.errors = {}
    }

    /**
     * Sets a game error for the player mode
     * @return {void}
     */
    var playModeGameError = function () {
      $scope.game.errors = {
        mode: 'You need to select a valid game mode'
      };
    }

    /**
     * Additional functionality when a game from the game
     * menu is selected
     *
     * @param  {integer} gameId :: The id of the game
     * @return {void}
     */
    $scope.selectGame = function (gameId, isCooperative) {
      var sameGame = gameId === $scope.lobby.gameId;

      $scope.lobby.gameId = sameGame ? undefined : gameId;
      $scope.lobby.joinDisabled = sameGame ? true : false;
      $scope.lobby.isCooperative = sameGame ? false : isCooperative;
    }

    /**
     * Indicatetes if gameId matches the currently selected game.
     * Used to set a "currently-selected" class in the view
     *
     * @param  {integer}  gameId :: Selected game' id
     * @return {Boolean}
     */
    $scope.isCurrentGame = function (gameId) {
      return gameId === $scope.lobby.gameId;
    }

    /**
     * Indicates if the playMode matches the currently selected one.
     * Used for mode selection menu highlighting
     *
     * @param  {string}  playMode :: A valid PlayModes id
     * @return {Boolean}
     */
    $scope.isCurrentPlayMode = function (playMode) {
      return playMode === $scope.game.mode;
    }

    /**
     * Checks if the selected mode is a multiplayer one.
     * Used for toggling the display of the "new game" form
     *
     * @return {Boolean} [description]
     */
    $scope.isMultiplayerMode = function () {
      var mode = PlayModes.get($scope.game.mode);
      if (!mode)
        return false;

      return mode.isMultiplayer ? true : false;
    }

    /**
     * Toggle the state of the showForm flag
     * @return {void}
     */
    $scope.toggleGameForm = function () {
      var mode = PlayModes.get($scope.game.mode);
      if (mode && mode.isMultiplayer) {
        $scope.game.startDisabled = true;
        return $scope.game.mode = undefined;
      }

      $scope.game.showForm = !$scope.game.showForm;
    }

    /**
     * Checker for errors during game creation, also checks
     * if a model specific error is defined - used for setting
     * "error" class to the "new game" input fields
     *
     * @param  {string}  model :: Optional game.model id
     * @return {Boolean}
     */
    $scope.hasErrors = function (model) {
      if (undefined !== model && undefined !== $scope.game.errors[model])
        return true;

      return Object.keys($scope.game.errors).length > 0;
    }

    /**
     * Checks if there are any errors for the game join form
     * @return {boolean}
     */
    $scope.lobbyHasErrors = function () {
      return $scope.lobby.errors !== null;
    }

    /**
     * Inits a game creation or displays errors, if any. If
     * game is successfully created, redirect the player to
     * the game screen
     *
     * @return {void}
     */
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

    /**
     * Toggles the startDisabled, showTitleInput and showNumber
     * flags for the "new game" form based on the selected mode
     *
     * @return {void}
     */
    $scope.selectPlayMode = function () {
      var mode = PlayModes.get($scope.game.mode);
      resetGameErrors();

      $scope.game.startDisabled = false;
      $scope.game.showTitleInput = mode.isMultiplayer ? true : false;
      $scope.game.showNumberInput = (mode.isMultiplayer && !mode.isCooperative) ? true : false;
    }

    /**
     * Joins a player to an existing game or displays errors, if
     * any are produced by the server. If the palyer successufuly
     * joins the game, redirect them to the game screen
     *
     * @return {void}
     */
    $scope.joinGame = function () {
      var data = {
        id: $scope.lobby.gameId,
        secret: $scope.game.secret
      }

      resetGameErrors();
      Server.gameJoin(data,
        function joinGameSuccess(response) {
          $location.path('/game/' + data.id);
          $scope.$apply();
        },
        function joinGameFail(errors) {
          if (errors.guessSecret) {
            $scope.lobby.errors = errors.guestSecret;
          } else {
            $scope.lobby.errors = errors;
          }
        });
    }
  }
]);