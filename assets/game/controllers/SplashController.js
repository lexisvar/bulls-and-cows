angular.module('BullsAndCows').controller('SplashController', [
  '$scope', '$rootScope', '$location', '$timeout', 'Server',
  function ($scope, $root, $location, $timeout, Server) {
    'use strict';

    /**
     * $rootScope aliases
     */
    $scope.getName = $root.playerGetName;

    /**
     * Models
     */

    // state flags for the displayed dialogues and form errors
    $scope.state = {
      showWelcome: false,
      showNameForm: false,
      isReturning: false,
      animateWelcome: false,
      error: null,
      name: null
    };

    // timeout to redirect to lobby after recognizing the player
    var lobbyRedirectTimeout = 1200;
    var lobbyWelcomeTimeout = 500;
    var welcomeStarted = false;

    /**
     * Displays the Welcome message and schedules a redirect to the Lobby
     * @param  {Boolean} isReturning A flag that indicated if the player is newcomer
     *                               or a returning one
     */
    var displayWelcome = function (isReturning) {
      if (welcomeStarted)
        return false;

      $scope.state = {
        isReturning: isReturning ? true : false,
        showWelcome: true,
        animateWelcome: false,
        showNameForm: false,
        error: null
      }

      welcomeStarted = true;
      $timeout(function () {
        $scope.state.animateWelcome = true;
        $timeout(function () {
          $location.path('/lobby');
        }, lobbyWelcomeTimeout);
      }, lobbyRedirectTimeout);
    }

    /**
     * Checks if a player is ready to continu to the lobby, if they are
     * show them the Welcome screen, otherwise show the "Enter name" form
     * @return {void}
     */
    $scope.continueToLobby = function () {
      if (true === $root.playerHasId()) {
        displayWelcome(true);
      } else {
        $scope.state.showNameForm = true;
      }
    }

    /**
     * Register a player, show erros on fail and welcome message otherwise,
     * successful registration registers the player values in the $rootScope
     * @return {void}
     */
    $scope.registerPlayer = function () {
      var data = {
        name: $scope.state.name
      };

      $scope.state.error = null;

      Server.playerRegister(data,
        function onSuccess(response) {
          displayWelcome(false);
        },
        function onError(errors) {
          $scope.$apply(function () {
            $scope.state.error = errors.name;
          })
        });
    }

    /**
     * A state accessor returning true if there're errors to display
     * on the registration form
     *
     * @return {boolean}
     */
    $scope.showError = function () {
      return $scope.state.error === null ? false : true;
    }

  }
]);