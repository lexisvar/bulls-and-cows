'use strict';

(function () {

  var _socket, _loading;

  var LobbyModel = function ($scope) {
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

  LobbyModel.prototype.addGame = function (game) {
    this.games[game.id] = game;
    this.total++;
  }

  LobbyModel.prototype.removeGame = function (gameId) {
    if (undefined !== this.games[gameId]) {
      delete this.games[gameId];
      this.total--;
    }
  }

  LobbyModel.prototype.destroy = function (callback) {
    this.io.socket.removeAllListeners('newGame');
    this.io.socket.removeAllListeners('removeGame');
    this.io.get('/lobby/leave', function (response) {
      callback.call(null, response);
    });
  }

  LobbyModel.prototype.create = function (data, success, fail, context) {
    var lobby = this;

    this.loading.show();
    this.io.post('/game/create', data, function (response) {
      console.debug('[SERVER] Game Create:', response);

      lobby.loading.hide();
      if (response.errors) {
        fail.call(context, response.errors);
      } else {
        success.call(context, response);
      }
      lobby.scope.$apply();
    })
  }

  LobbyModel.prototype.join = function (data, success, fail, context) {
    var lobby = this;
    this.loading.show();

    this.io.post('/game/join', data, function (response) {
      console.debug('[SERVER] Game Join:', response);

      lobby.loading.hide();
      if (response.errors) {
        fail.call(context, response.errors);
      } else {
        success.call(context, response);
      }
      lobby.scope.$apply();
    })
  }

  LobbyModel.$factory = function ($socket, Loading) {
    _socket = $socket;
    _loading = Loading;
    return LobbyModel;
  }

  LobbyModel.$factory.$inject = ['$socket', 'Loading'];

  angular.module('BullsAndCows').service('LobbyModel', LobbyModel.$factory);
})()