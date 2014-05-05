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
    $.player = {
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
    $root.hasPlayerId = function () {
      return $root.player.id ? true : false;
    }

    /**
     * Getter for the player name
     * @return {string} The value of $rootScope.player.name
     */
    $root.getPlayerName = function () {
      return $root.player.name;
    }

    /**
     * Getter for the player values of the $rootScope
     * @param  {Function} callback Optional callback to receive the player data
     * @return {void|object}       Passes player data to callback or returns it directly
     */
    $root.getPlayerData = function (callback) {
      return 'function' === typeof callback ? callback.call(null, $root.player) : $root.player;
    }

    /**
     * Applies the player data from a server call to the $rootScope
     * @param  {object}   data     Should contain session info about the user
     * @param  {Function} callback Optional callback to receive the data
     * @return {void|undefined}    Passes player data to callback, if any or undefined
     */
    $root.applyPlayerData = function (data, callback) {
      return $root.apply(function () {
        $root.playerD = data;
        return 'function' === typeof callback ? callback.call(null, data) : undefined;
      });
    }
  }
])