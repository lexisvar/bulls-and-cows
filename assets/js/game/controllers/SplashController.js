angular.module('BullsAndCows').controller('SplashController', ['$scope', '$socket', '$location', '$timeout', '$rootScope',
  function ($scope, $socket, $location, $timeout, $rootScope) {
    'use strict';

    $scope.welcomeScreen = false;
    $scope.player = {
      enterName: false,
      isReturning: false,
      name: null,
      nameError: false,
      nameErrorMessage: ''
    };

    $scope.continueToLobby = function () {
      var name = $rootScope.playerId;
      if (undefined !== name) {
        $scope.displayWelcomeMessage(name, true);
      } else {
        $scope.player.enterName = true;
      }
    }

    $scope.setPlayerName = function () {
      var data = {
        name: $scope.player.name
      };

      $socket.get('/player/setName', data, function (res) {
        if (true === res.state) {
          $scope.displayWelcomeMessage(res.name, false, true);
        } else {
          console.log(res);
          $scope.$apply(function () {
            $scope.player.nameError = true;
            $scope.player.nameErrorMessage = res.state;
          });
        }
      });
    }

    $scope.getNameError = function () {
      return $scope.player.nameErrorMessage;
    }

    $scope.displayWelcomeMessage = function (name, isReturning, cb) {
      var apply = function () {
        $scope.player.enterName = false;
        $scope.player.isReturning = isReturning;
        $scope.player.name = $rootScope.playerId = name;
        $scope.welcomeScreen = true;
      };

      true === cb ? $scope.$apply(apply) : apply();

      $timeout(function () {
        $location.path('/lobby');
      }, 2000);
    }
  }
]);