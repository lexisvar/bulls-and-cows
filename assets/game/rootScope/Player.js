/**
 * $rootScope Player API
 */
angular.module('BullsAndCows').run([
  '$rootScope',
  function ($root) {
    $root.flags.waitingForPlayer = false;

    /**
     * Contains session info about the player
     * @type {Object}
     */
    $root.player = {
      id: null,
      name: null,
      game: null,
      isHost: null,
      hasTurn: false
    }

    /**
     * Checks if the user has a playerId
     * @return {Boolean} True if they do, false otherwise
     */
    $root.playerHasId = function () {
      return $root.player.id ? true : false;
    }

    /**
     * @return {integer|null} The player' session id
     */
    $root.playerGetId = function () {
      return $root.player.id;
    }

    /**
     * Getter for the player name
     * @return {string} The value of $rootScope.player.name
     */
    $root.playerGetName = function () {
      return $root.player.name;
    }

    /**
     * Getter for the player values of the $rootScope
     * @param  {Function} callback Optional callback to receive the player data
     * @return {void|object}       Passes player data to callback or returns it directly
     */
    $root.playerGetData = function (callback) {
      return 'function' === typeof callback ? callback.call(null, $root.player) : $root.player;
    }

    /**
     * Change the player's game id, used when browsing games by Id, instead
     * of based on session
     * @param  {integer} gameId  GameId
     * @param  {boolean} setNull Indicates that the game Id can be set to null
     * @return {void}
     */
    $root.playerSetGame = function (gameId, setNull) {
      gameId = parseInt(gameId);
      if (setNull || (!isNaN(gameId) && gameId > 0)) {
        $root.apply(function () {
          $root.player.game = gameId;
        })
      }
    }

    /**
     * Sets the player's isHost flag
     * @param  {Boolean} isHost
     * @return {void}
     */
    $root.playerSetIsHost = function (isHost) {
      $root.apply(function () {
        $root.player.isHost = isHost;
      })
    }

    /**
     * @return {integer|null} The current player selected game Id
     */
    $root.playerGetGame = function () {
      return $root.player.game;
    }

    /**
     * Applies the player data from a server call to the $rootScope
     * @param  {object}   data     Should contain session info about the user
     * @param  {Function} callback Optional callback to receive the data
     * @return {void|undefined}    Passes player data to callback, if any or undefined
     */
    $root.playerApplyData = function (data, callback) {
      return $root.apply(function () {
        $root.player = data;
        return 'function' === typeof callback ? callback.call(null, data) : undefined;
      });
    }
  }
])