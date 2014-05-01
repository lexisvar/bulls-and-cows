angular.module('BullsAndCows').service('Server', ['$socket', '$rootScope',
  function ($socket, $root) {
    var $ = {};

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

    $.applyPlayerInfo = function (hasIdCallback, noIdCallback) {
      if (true === $root.hasPlayerId()) {
        return $root.getPlayerData(hasIdCallback);
      }

      return $.getPlayer(function (response) {
        if (null !== response.playerId) {
          return $root.applyPlayerData(response, hasIdCallback);
        } else {
          return 'function' === typeof noIdCallback ? noIdCallback.call(null, response) : undefined;
        }
      });
    }

    $.getPlayer = function (callback) {
      $root.showLoading();
      $socket.get('/player/get', {}, function (response) {
        $root.hideLoading();
        return handleResponse(response, callback);
      });
    }

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

    return $;
  }
])