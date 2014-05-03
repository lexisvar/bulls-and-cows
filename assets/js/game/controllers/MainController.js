angular.module('BullsAndCows').controller('MainController', ['$scope', 'Server', '$location', '$rootScope',
  function ($scope, Server, $location, $root) {

    /**
     * Test to see if we can identify the user, otherwise
     * redirect to Splash Screen
     */
    return Server.applyPlayerInfo(
      function hasIdCallback(response) {
        if (null !== response.game) {
          $location.path('/game');
        }
        $root.appIsLoaded();
      },
      function noIdCallback(response) {
        $location.path('/');
        $root.appIsLoaded();
      });
  }
]);