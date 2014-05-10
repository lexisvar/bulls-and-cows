/**
 * Extension of $rootScope for handling functionality on
 * the lobby screen
 */
angular.module('BullsAndCows').run([
  '$rootScope',
  function ($root) {
    /**
     * The list of mulitplayer games, defaults to empty
     * @type {Object}
     */
    $root.games = {}

    /**
     * Load games the lobby games, called after receiving
     * a list of games from the server on initial load
     *
     * @param  {array} games :: An array of game objects
     * @return {void}
     */
    $root.lobbyLoad = function (games) {
      $root.apply(function () {
        for (var i in games) {
          $root.games[games[i].id] = games[i];
        };
      })
    }

    /**
     * Add a game to the lobby. Called after a
     * socket.on('newGame') message is received
     *
     * @param  {object} game :: A game object
     * @return {void}
     */
    $root.lobbyAddGame = function (game) {
      $root.apply(function () {
        $root.games[game.id] = game;
      })
    }

    /**
     * Removes a game from the lobby. Called after a
     * socket.on('removeGame') message is received
     *
     * @param  {integer} gameId :: The id of the game to be removed
     * @return {void}
     */
    $root.lobbyRemoveGame = function (gameId) {
      $root.apply(function () {
        if ($root.games[gameId]) {
          delete $root.games[gameId];
        }
      })
    }

    /**
     * Empties the game list in the lobby
     * @return {void}
     */
    $root.lobbyReset = function () {
      $root.apply(function () {
        $root.games = {};
      })
    }

    /**
     * Returns the list of games in the lobby
     * @return {object}
     */
    $root.lobbyGetGames = function () {
      return $root.games;
    }

    /**
     * Checks if there are any games in the lobby
     * @return {boolean} :: True if there're games
     */
    $root.lobbyHasGames = function () {
      return Object.keys($root.games).length > 0;
    }
  }
])