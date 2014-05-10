'use strict';

(function () {

  var _socket,
    _loading;

  var Lobby = function ($scope) {
    this.io = _socket;
    this.loading = _loading;
    this.scope = $scope;
    this.games = {};
    this.total = 0;

    var lobby = this;

    this.loading.show();
    this.io.get('/lobby/join', function (response) {
      console.debug('[SERVER] Lobby Join:', response);
      lobby.loading.hide();

      _.each(response, function (game) {
        lobby.games[game.id] = game;
      })

      lobby.total = Object.keys(lobby.games).length;

      $scope.$apply();
    })

    this.io.socket.on('newGame', function (game) {
      console.debug('[SOCKET] New game:', game);
      lobby.addGame.call(lobby, game);
      $scope.$apply();
    })

    this.io.socket.on('removeGame', function (id) {
      console.debug('[SOCKET] Remove game:', id);
      lobby.removeGame.call(lobby, id);
      $scope.$apply();
    });

    return this;
  }

  Lobby.$factory = function ($socket, Loading) {
    _socket = $socket;
    _loading = Loading;
    return Lobby;
  }

  Lobby.$factory.$inject = ['$socket', 'Loading'];

  Lobby.prototype.addGame = function (game) {
    this.games[game.id] = game;
    lobby.total++;
  }

  Lobby.prototype.removeGame = function (gameId) {
    if (undefined !== this.games[gameId]) {
      delete this.games[gameId];
      lobby.total--;
    }
  }

  Lobby.prototype.leave = function (callback) {
    this.io.socket.removeAllListeners('newGame');
    this.io.socket.removeAllListeners('removeGame');
    this.io.get('/lobby/leave', function (response) {
      callback.call(null, response);
    });
  }

  Lobby.prototype.create = function (data, success, fail, context) {
    var lobby = this;

    this.loading.show();
    this.io.post('/game/create', data, function (response) {
      console.debug('[SERVER] Game Create:', response);

      lobby.loading.hide();
      if (response.errors) {
        return fail.call(context, response.errors);
      }

      success.call(context, response);
    })
  }

  Lobby.prototype.join = function (data, success, fail, context) {
    var lobby = this;
    this.loading.show();

    this.io.post('/game/join', data, function (response) {
      console.debug('[SERVER] Game Join:', response);

      lobby.loading.hide();
      if (response.errors) {
        return fail.call(context, response.errors);
      }

      success.call(context, response);
    })
  }

  angular.module('BullsAndCows').service('Lobby', Lobby.$factory);
})()