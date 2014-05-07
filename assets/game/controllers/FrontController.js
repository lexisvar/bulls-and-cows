angular.module('BullsAndCows').controller('FrontController', [
  '$scope', '$rootScope', '$location', '$route', '$routeParams', 'Server',
  function ($scope, $root, $location, $route, $routeParams, Server) {

    // extracts gameId from route
    var extractId = function (path) {
      var gameIdRegex = /\/game\/([\d]+)/gm;
      try {
        return gameIdRegex.exec(location)[1];
      } catch (e) {
        return null;
      }
    }

    /**
     * Goes to a location, if the location matches the current
     * one call $route.reload();
     * @param  {string} path Path URI to go to
     * @return {void}
     */
    var goTo = function (path) {
      if ($location.path() === path) {
        return $route.reload();
      }

      return $location.path(path);
    }

    /**
     * Test to see if we can identify the user, otherwise
     * redirect to Splash Screen
     */
    return Server.playerApplyData(

      // if the player is identified
      function hasIdCallback(response) {

        // set the player game from route params
        var _gameId = extractId($location.$$path);

        // store original game id, in case the game doesn't exist
        var originalGameId = $root.playerGetGame();

        // get value after set (e.g. if invalid, it will return session game if any)
        $root.playerSetGame(_gameId);

        // get gameId after setting it from parsing the location path
        var gameId = $root.playerGetGame();

        // if player is already in a game, get game info from
        // the server and redirect them to the GameController
        if (null !== gameId) {

          // enter the game -> subscribe for events
          return Server.gameEnter(gameId,

            // game is found callback
            function gameFound() {
              var gameLocation = '/game/' + gameId;

              // if already in the GameController reload location to
              // apply $rootScope.game changes to GameController
              goTo(gameLocation);
              $root.appLoadComplete();
              $root.$apply();
            },

            // error, game not found
            function gameNotFound(error) {
              alert(error);

              // set game id to the original
              $root.gameSet();
              $root.playerSetGame(originalGameId, true);

              // redirect to home page
              goTo('/');
              $root.appLoadComplete();
              $root.$apply();
            })
        }

        // no game
        goTo('/');
        $root.appLoadComplete();
      },
      // if the player is anonymouse -> redirect to Splash
      function noIdCallback(response) {
        goTo('/');
        $root.appLoadComplete();
      });
  }
]);