'use strict';

(function () {

  var Player = function ($socket, Loading) {
    this.data = {};
    this.loading = Loading;
    this.socket = $socket;
  }

  Player.$inject = ['$socket', 'Loading'];

  Player.prototype.set = function (data, callback) {
    this.data = data || {};
  }

  Player.prototype.register = function (name, success, fail) {
    var player = this,
      data = {
        name: name
      };

    this.loading.show();
    this.socket.post('/player/register', data, function (response) {
      console.debug('[PLAYER REGISTER]: ', response);

      player.loading.hide();
      if (response.errors && response.errors.name) {
        return fail.call(null, response.errors.name);
      }

      player.set(response);
      success.call(null, response);
    })
  }

  Player.prototype.getIdentity = function (callback) {
    var player = this;

    this.loading.show();
    this.socket.get('/player/get', function (response) {
      player.loading.hide();
      player.set(response);
      callback.call(null, response);
    })
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

})()