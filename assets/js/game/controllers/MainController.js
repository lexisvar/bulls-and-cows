angular.module('BullsAndCows').controller('MainController', ['$scope', '$rootScope', '$socket', '$location',
  function ($scope, $rootScope, $socket, $location) {

    /**
     * Test to see if we can identify the user, otherwise
     * redirect to Splash Screen
     */
    if (undefined === $rootScope.playerId) {
      // get name from API
      $socket.get('/player/getName', null, function (res) {
        if (true === res.state) {
          $rootScope.$apply(function () {
            $rootScope.playerId = res.name;
          });
        } else {
          $location.path('/');
        }
      });
    }

    /**
     * Get available game modes from server
     * @type {Object}
     */
    $rootScope.gameModes = {};
    $rootScope.gameModesLoaded = false;

    $socket.get('/game/getModes', null, function (res) {
      $rootScope.$apply(function () {
        $rootScope.gameModes = res.modes;
        $rootScope.gameModesLoaded = true;
      });
    });
  }
]);