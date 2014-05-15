'use strict';

(function () {

  var Player = function ($socket, Loading) {
    this.data = {};
    this.socket = $socket;
    this.loading = Loading;
  }

  Player.$inject = ['$socket', 'Loading'];

  Player.prototype.set = function (data, callback) {
    this.data = data || {};
  }

  Player.prototype.register = function (name, success, fail, context) {
    var data = {
      name: name
    };

    this.loading.show();
    this.socket.post('/player/register', data, function (response) {
      console.debug('[PLAYER REGISTER]: ', response);

      this.loading.hide();
      if (response.errors && response.errors.name) {
        return fail.call(context, response.errors.name);
      }

      this.set(response);
      success.call(context, response);
    }, this);
  }

  Player.prototype.getIdentity = function (callback, context) {
    this.loading.show();
    this.socket.get('/player/get', function (response) {
      this.loading.hide();
      this.set(response);
      callback.call(context, response);
    }, this);
  }

  Player.prototype.getName = function () {
    return this.data.name;
  }

  Player.prototype.getId = function () {
    return this.data.id;
  }

  Player.prototype.getName = function () {
    return this.data.name;
  }

  Player.prototype.getGame = function () {
    return this.data.game;
  }

  Player.prototype.isHost = function () {
    return this.data.isHost || false;
  }

  Player.prototype.playHost = function () {
    return this.data.isHost = true;
  }

  Player.prototype.playGuest = function () {
    return this.data.isHost = false;
  }

  Player.prototype.hasId = function () {
    return this.data.id ? true : false;
  }

  angular.module('BullsAndCows').service('Player', Player);

})();