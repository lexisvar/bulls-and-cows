'use strict';

(function () {

  var _socket, _loading;

  var LobbyModel = function ($scope) {
    this.socket = _socket;
    this.loading = _loading;

    this.scope = $scope;
    this.games = {};
    this.total = 0;

    this.loading.show();
    this.socket.get('/lobby/join', this.loadData, this);

    this.socket.on('newGame', function (game) {
      console.debug('[SOCKET] New game:', game);
      this.addGame(game);
      this.scope.$apply();
    }, this);

    this.socket.on('removeGame', function (id) {
      console.debug('[SOCKET] Remove game:', id);
      this.removeGame(id);
      this.scope.$apply();
    }, this);

    return this;
  }

  LobbyModel.prototype.loadData = function (response) {
    console.debug('[SERVER] Lobby Join:', response);
    this.loading.hide();

    _.each(response, function (game) {
      this.games[game.id] = game;
    }, this)

    this.total = Object.keys(this.games).length;
    this.scope.$apply();
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
    this.socket.off('newGame');
    this.socket.off('removeGame');
    this.socket.get('/lobby/leave', function (response) {
      callback.call(null, response);
    });
  }

  LobbyModel.prototype.create = function (data, success, fail, context) {
    this.loading.show();
    this.socket.post('/game/create', data, function (response) {
      console.debug('[SERVER] Game Create:', response);

      this.loading.hide();
      if (response.errors) {
        fail.call(context, response.errors);
      } else {
        success.call(context, response);
      }
      this.scope.$apply();
    }, this)
  }

  LobbyModel.prototype.join = function (data, success, fail, context) {
    this.loading.show();
    this.socket.post('/game/join', data, function (response) {
      console.debug('[SERVER] Game Join:', response);

      this.loading.hide();
      if (response.errors) {
        fail.call(context, response.errors);
      } else {
        success.call(context, response);
      }
      this.scope.$apply();
    }, this);
  }

  LobbyModel.$factory = function ($socket, Loading) {
    _socket = $socket;
    _loading = Loading;
    return LobbyModel;
  }

  LobbyModel.$factory.$inject = ['$socket', 'Loading'];

  angular.module('BullsAndCows').service('LobbyModel', LobbyModel.$factory);
})();