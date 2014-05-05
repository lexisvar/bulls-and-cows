angular.module('BullsAndCows').controller('FrontController', [
  '$scope', '$rootScope', '$location', 'Server',
  function ($scope, $root, $location, Server) {

    /**
     * Test to see if we can identify the user, otherwise
     * redirect to Splash Screen
     */
    return Server.applyPlayerInfo(
      function hasIdCallback(response) {
        if (null !== response.game) {
          Server.gameEnter(function () {
            $location.path('/game');
          })
        }
        $root.appIsLoaded();
      },
      function noIdCallback(response) {
        $location.path('/');
        $root.appIsLoaded();
      });
  }
]);