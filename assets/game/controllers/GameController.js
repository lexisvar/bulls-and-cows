angular.module('BullsAndCows').controller('GameController', [
  '$scope', '$rootScope', '$routeParams', 'Server', 'Game',
  function ($scope, $root, $routeParams, Server, Game) {
    'use strict';

    /**
     * $rootScope aliases
     */
    $scope.hostTurns = $root.gameGetHostTurns;
    $scope.guestTurns = $root.gameGetGuestTurns;
    $scope.hostName = $root.gameGetHostName;
    $scope.guestName = $root.gameGetGuestName;
    $scope.getWinnerName = $root.gameGetWinnerName;
    $scope.winnerIsBot = $root.gameIsWinnerBot;
    $scope.isOver = $root.gameIsOver;
    $scope.getTurnsCount = $root.gameGetTurnsCount;
    $scope.isPrematureClosed = $root.gameIsPrematureClosed;
    $scope.isMultiplayer = $root.gameIsMultiplayer;

    /**
     * Check if the game data is loaded, otherwise stop execution
     * and wait for FrontController to reload the path after
     * fetching the data from the server
     */
    if (!$root.gameIsLoaded()) {
      return false;
    }

    /**
     * Contains scope specific data
     * @type {Object}
     */
    $scope.data = {
      guess: '',
      lastGuess: '',
      secretSet: [],
      error: null
    }

    /**
     * Initialize $scope data in case the game is played with a bot
     */
    if (!$root.gameIsOver() && $root.gameIsWithBot()) {
      // load the complete range of possibilities from Game engine
      var range = Game.getSetCopy();

      // if there are turns played, apply to range and redice it
      if ($root.gameGetTurnsCount() > 0) {
        range = Game.filterTurns(range, $root.gameGetGuestTurns());
      }

      // apply range to scope
      $scope.data.secretSet = range;
    }

    /**
     * Returns the isWaiting state of the game based on
     * the game NOT being a multiplayer or having a guest
     * join the game
     *
     * @return {Boolean}
     */
    $scope.isWaiting = function () {
      if ($root.gameIsMultiplayer() && !$root.gameIsOver()) {
        return !$root.gameHasGuest();
      }

      return false;
    }

    /**
     * Checks if there's an error message to display
     * @return {Boolean}
     */
    $scope.hasError = function () {
      return $scope.data.error === null ? false : true;
    }

    /**
     * Checks if there're any turns played for this game
     * @return {Boolean}
     */
    $scope.hasTurns = function () {
      return $root.gameGetTurnsCount() > 0 ? true : false;
    }

    /**
     * Checks if a the player is the game host
     * @return {Boolean}
     */
    $scope.isHost = function () {
      return $root.playerGetId() === $root.gameGetHostId();
    }

    /**
     * Returns true if the bot should play this turn
     * @return {Boolean}
     */
    $scope.isBotTurn = function () {
      // if not a multiplayer and with bot
      if (!$root.gameIsMultiplayer() && $root.gameIsWithBot()) {
        // if is not cooperative -> bot turn
        if (!$root.gameIsCooperative()) {
          return true;
        }
        // if is cooperative and last turn was a bot turn
        else if ($root.gameLastTurnIsBot()) {
          return false;
        }
        // its the bot turn
        else {
          return true;
        }
      }

      // multiplayer game -> return false
      return false;
    }

    /**
     * Returns true if its the player's turn to play
     * @return {Boolean}
     */
    $scope.isPlayerTurn = function () {
      if ($root.gameIsMultiplayer()) {
        return $scope.isHost() === $root.gameIsHostTurn();
      } else {
        return true;
      }
    }

    /**
     * Submit a new game turn to the server, if an error occurs
     * output it to the user
     *
     * @return {void}
     */
    $scope.playTurn = function () {
      if ($scope.isOver())
        return false;

      var botTurn = $scope.isBotTurn(),
        guess = botTurn ? Game.nextGuess($scope.data.secretSet) : $scope.data.guess;

      $scope.data.lastGuess = guess;
      $scope.data.error = null;

      var data = {
        guess: guess,
        isBotTurn: botTurn
      }

      Server.gamePlayTurn(data,
        function onSuccess(response) {
          var score = Game.buildScore(response.bulls, response.cows);
          $scope.data.secretSet = Game.filterSet($scope.data.secretSet, guess, score);
          $scope.$apply();
        },
        function onError(error) {
          $scope.data.error = error.guess;
          $scope.$apply();
        });
    }

    /**
     * Request the game' secret number from the server and
     * alerts it to the screen
     *
     * @return {void}
     */
    $scope.getSecret = function () {
      Server.gameSecret($root.gameGetId(), function (message) {
        alert(message);
      })
    }
  }
])