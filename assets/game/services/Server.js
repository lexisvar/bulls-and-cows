angular.module('BullsAndCows').service('Server', [
  '$socket', '$rootScope', '$location',
  function ($socket, $root, $location) {
    var $ = {};

    /**
     * Handles success/error callback calling after a request to
     * the server. Commonly private method
     * @param  {object}   response     The server response
     * @param  {Function} callback     Success callback
     * @param  {function} errorHandler Error callback
     * @return {void}
     */
    var handleResponse = function (response, callback, errorHandler) {
      var errors = response.error || response.errors || null;
      if (errors) {
        if ('function' === typeof errorHandler) {
          return errorHandler.call(null, errors);
        }
        return;
      }

      'function' === typeof callback ? callback.call(null, response) : undefined;
    }

    /**
     * Grabs player info from the server and applies it to the
     * $rootScope, if the user is already identified, return
     * $root.getPlayerData with the success callback
     *
     * @param  {function} hasIdCallback Callback if identified user
     * @param  {function} noIdCallback  Callback if unidentified user
     * @return {void}
     */
    $.playerApplyData = function (hasIdCallback, noIdCallback) {
      if (true === $root.playerHasId()) {
        return $root.playerGetData(hasIdCallback);
      }

      $.playerGet(function (response) {
        if (null !== response.id) {
          $root.playerApplyData(response, hasIdCallback);
        } else {
          'function' === typeof noIdCallback ? noIdCallback.call(null, response) : undefined;
        }
      });
    }

    /**
     * Grabs player info from the server
     * @param  {Function} callback Callback after result is receinved
     * @return {void}
     */
    $.playerGet = function (callback) {
      $root.loadingShow();
      $socket.get('/player/get', function (response) {
        $root.loadingHide();
        handleResponse(response, callback);
      });
    }

    /**
     * Register a player with the provided data
     * @param  {object}   data         Player parameters (usually only name)
     * @param  {function} callback     Success callback
     * @param  {funciton} errorHandler Error callback
     * @return {void}
     */
    $.playerRegister = function (data, callback, errorHandler) {
      $root.loadingShow();
      $socket.post('/player/register', data, function (response) {
        $root.loadingHide();
        handleResponse(response,
          function onSetPlayerSuccess() {
            $root.playerApplyData(response, callback);
          },
          errorHandler);
      });
    }

    /**
     * Sends a request to the backend to join the lobby and
     * subscribe the socket for newly created game notifications
     *
     * Also fetches and a list of existing games and passes them
     * to a the provided callback
     *
     * @param  {Function} callback
     * @return {void}
     */
    $.lobbyJoin = function (callback) {
      $root.loadingShow();
      $socket.get('/lobby/join', function (response) {
        $root.loadingHide();
        callback.call(null, response);
      })
    }

    /**
     * Send a request to the backend to unsubscribe the user' socket
     * from any incoming lobby notifaictions
     * @return {void}
     */
    $.lobbyLeave = function () {
      $socket.get('/lobby/leave');
    }

    /**
     * Sends a message to the server to create a game
     * @param  {object}   data            Properly formatted create game request data
     * @param  {function} successCallback A function to call on success
     * @param  {function} errorHandler    A function to call on error
     * @return {void}
     */
    $.gameCreate = function (data, successCallback, errorHandler) {
      $root.loadingShow();
      $socket.get('/game/create', data, function (response) {
        $root.loadingHide();
        handleResponse(response, successCallback, errorHandler)
      })
    }

    /**
     * Enter a game by grabbing its info from the server and apply it to
     * the $rootScope
     * @param  {function} callback An optional callback to be executed afterwords
     * @return {void}
     */
    $.gameEnter = function (gameId, callback, errorCallback) {
      $root.loadingShow();
      $socket.get('/game/enter/' + gameId, function (response) {
        $root.loadingHide();

        // if there's an error (e.g. game not found)
        if (response.error) {
          return errorCallback.call(null, response.error)
        }

        $root.gameSet(response.game);
        $root.gameSetTurns(response.turns);
        'function' === typeof callback ? callback.call() : undefined;
      })
    }

    /**
     * Submit game turn to the server
     * @param  {object} turn              Turn data, contains "guess" and "isBotTurn"
     * @param  {function} successCallback Callback on success
     * @param  {function} errorHandler    Error handler
     * @return {void}
     */
    $.gamePlayTurn = function (turn, successCallback, errorHandler) {
      $root.loadingShow();
      $socket.get('/game/turn', turn, function (response) {
        $root.loadingHide();
        handleResponse(response, successCallback, errorHandler);
      })
    }

    $.gameSecret = function (gameId, callback) {
      $root.loadingShow();
      $socket.get('/game/secret', {
        id: gameId
      }, function (response) {
        return callback.call(null, response.message);
      })
    }

    return $;
  }
])