angular.module('BullsAndCows').controller('SplashController', ['$scope', '$socket', '$location',
  function ($scope, $socket, $location) {
    'use strict';

    $scope.player = {
      askName: false,
      name: ''
    };

    $scope.showWelcome = function (res) {
      // welcome logic
      setTimeout(2000, function () {
        $location.path('/lobby');
      });
    }

    $scope.continueToLobby = function () {
      $socket.get('/lobby/hasEntered', null, function (res) {
        if (true === res.state) {
          $scope.showWelcome(res);
        } else {
          $scope.$apply(function () {
            $scope.player.askName = true;
          });
        }
      });
    }

    $scope.enterName = function () {
      var data = {
        name: $scope.player.name
      };

      $scope.get('/lobby/enter', data, $scope.showWelcome);
    }
  }
]);