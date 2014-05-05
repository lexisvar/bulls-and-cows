angular.module('BullsAndCows').controller('SplashController', [
  '$scope', 'Server', '$location', '$timeout', '$rootScope',
  function ($scope, Server, $location, $timeout, $root) {
    'use strict';

    /**
     * Controller state params
     */
    $scope.state = {
      showWelcome: false,
      showNameForm: false,
      isReturning: false,
      error: null,
      name: null
    };

    var lobbyRedirectTimeout = 2000;

    /**
     * Displays the Welcome message and schedules a redirect to the Lobby
     * @param  {Boolean} isReturning A flag that indicated if the player is newcomer
     *                               or a returning one
     */
    var displayWelcome = function (isReturning) {
      $scope.state = {
        isReturning: isReturning ? true : false,
        showWelcome: true,
        showNameForm: false,
        error: null
      }

      $timeout(function () {
        $location.path('/lobby')
      }, lobbyRedirectTimeout);
    }

    /**
     * Checks if a player is ready to continu to the lobby, if they are
     * show them the Welcome screen, otherwise show the "Enter name" form
     */
    $scope.continueToLobby = function () {
      if (true === $root.hasPlayerId()) {
        displayWelcome(true);
      } else {
        $scope.state.showNameForm = true;
      }
    }

    /**
     * Register a player, show erros on fail and welcome message otherwise,
     * successful registration registers the player values in the $rootScope
     */
    $scope.registerPlayer = function () {
      var data = {
        name: $scope.state.name
      };

      $scope.state.error = null;

      Server.registerPlayer(data,
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
     * A state accessor returning true if there're errors to display on
     * the name form
     */
    $scope.showError = function () {
      return $scope.state.error === null ? false : true;
    }
  }
]);