angular.module('BullsAndCows').service('Server', ['$socket', '$rootScope',
  function ($socket, $root) {
    var $ = {};

    /**
     * Handles success/error callback calling after a request to
     * the server. Commonly private method
     * @param  {object}   response     The server response
     * @param  {Function} callback     Success callback
     * @param  {function} errorHandler Error callback
     */
    var handleResponse = function (response, callback, errorHandler) {
      var errors = response.error || response.errors || null;
      if (errors) {
        if ('function' === typeof errorHandler) {
          return errorHandler.call(null, errors);
        }
        return;
      }

      return 'function' === typeof callback ? callback.call(null, response) : undefined;
    }

    /**
     * Grabs player info from the server and applies it to the
     * $rootScope, if the user is already identified, return
     * $root.getPlayerData with the success callback
     *
     * @param  {function} hasIdCallback Callback if identified user
     * @param  {function} noIdCallback  Callback if unidentified user
     */
    $.applyPlayerInfo = function (hasIdCallback, noIdCallback) {
      if (true === $root.hasPlayerId()) {
        return $root.getPlayerData(hasIdCallback);
      }

      return $.getPlayer(function (response) {
        if (null !== response.id) {
          return $root.applyPlayerData(response, hasIdCallback);
        } else {
          return 'function' === typeof noIdCallback ? noIdCallback.call(null, response) : undefined;
        }
      });
    }

    /**
     * Grabs player info from the server
     * @param  {Function} callback Callback after result is receinved
     */
    $.getPlayer = function (callback) {
      $root.showLoading();
      $socket.get('/player/get', {}, function (response) {
        $root.hideLoading();
        return handleResponse(response, callback);
      });
    }

    /**
     * Register a player with the provided data
     * @param  {object}   data         Player parameters (usually only name)
     * @param  {function} callback     Success callback
     * @param  {funciton} errorHandler Error callback
     */
    $.registerPlayer = function (data, callback, errorHandler) {
      $root.showLoading();
      $socket.post('/player/register', data, function (response) {
        $root.hideLoading();
        return handleResponse(response,
          function onSetPlayerSuccess() {
            return $root.applyPlayerData(response, callback);
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
     */
    $.joinLobby = function (callback) {
      $socket.get('/lobby/join', null, function (response) {
        callback.call(null, response);
      })
    }

    /**
     * Send a request to the backend to unsubscribe the user' socket
     * from any incoming lobby notifaictions
     */
    $.leaveLobby = function () {
      $socket.get('/lobby/leave');
    }

    return $;
  }
])