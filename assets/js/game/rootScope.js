angular.module('BullsAndCows').run([
  '$rootScope', '$timeout',
  function ($root, $timeout) {
    /**
     * Contains session info about the player
     * @type {Object}
     */
    $root.playerData = {
      id: null,
      name: null,
      game: null,
      isHost: null
    }

    /**
     * $rootScope state flags
     * @type {Object}
     */
    $root.flags = {
      showLoading: true,
      appLoaded: false,
      waitingForPlayer: false
    }

    /**
     * The list of mulitplayer games, defaults to empty
     * @type {Object}
     */
    $root.games = {}

    /**
     * Container for an ongoing game's data
     * @type {Object}
     */
    $root.game = {
      data: {},
      turns: []
    }

    var hideLoadingTimeout = 500;

    /**
     * List of phases when NOT to use $apply
     * @type {Array}
     */
    var dontApplyWhen = ['$apply', '$digest'];

    /**
     * Save version of $apply, when not from callback
     * @param  {function} callback Apply callback
     * @return {void}
     */
    var apply = function (callback) {
      return dontApplyWhen.indexOf($root.$$phase) > -1 ? callback.call() : $root.$apply(callback);
    }

    /**
     * Tells the $rootScope to HIDE the loading message
     * @return {void}
     */
    $root.showLoading = function () {
      return apply(function () {
        $root.flags.showLoading = true
      });
    }

    /**
     * Tells $rootScope to HIDE the loading message
     * @return {[type]} [description]
     */
    $root.hideLoading = function () {
      return apply(function () {
        $root.flags.showLoading = false
      });
    }

    /**
     * Checks if the user has a playerId
     * @return {Boolean} True if they do, false otherwise
     */
    $root.hasPlayerId = function () {
      return $root.playerData.id ? true : false;
    }

    /**
     * Getter for the player name
     * @return {string} The value of $rootScope.playerData.name
     */
    $root.getPlayerName = function () {
      return $root.playerData.name;
    }

    /**
     * Getter for the playerData values of the $rootScope
     * @param  {Function} callback Optional callback to receive the player data
     * @return {void|object}       Passes player data to callback or returns it directly
     */
    $root.getPlayerData = function (callback) {
      return 'function' === typeof callback ? callback.call(null, $root.playerData) : $root.playerData;
    }

    /**
     * Applies the player data from a server call to the $rootScope
     * @param  {object}   data     Should contain session info about the user
     * @param  {Function} callback Optional callback to receive the data
     * @return {void|undefined}    Passes player data to callback, if any or undefined
     */
    $root.applyPlayerData = function (data, callback) {
      return apply(function () {
        $root.playerData = data;
        return 'function' === typeof callback ? callback.call(null, data) : undefined;
      });
    }

    /**
     * A method to set the application loaded state to true and
     * hide the loading message
     * @return {void}
     */
    $root.appIsLoaded = function () {
      return apply(function () {
        $root.flags.appLoaded = true;
        $root.hideLoading();
      });
    }

    $root.addGame = function (data) {
      apply(function () {
        $root.games[data.id] = data;
      })
    }

    $root.loadGames = function (games) {
      console.log(games);
      apply(function () {
        for (var i in games) {
          $root.games[games[i].id] = games[i];
        };
      })
    }

    $root.removeGame = function (data) {
      apply(function () {
        if ($root.games[data.id]) {
          delete $root.games[data.id];
        }
      })
    }

    $root.resetGames = function () {
      apply(function () {
        $root.games = {};
      })
    }

    $root.gameStart = function (data) {
      apply(function () {
        $root.flags.waitingForPlayer = false;
        $root.game = data;
      })
    }

    $root.addTurn = function (data) {
      $root.game.turns.push(data);
    }
  }
]);