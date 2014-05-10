'use strict';

(function () {

  var _player, _loading, _socket;

  var GameModel = function (gameId, context, constructCallback) {
    var game = this;

    this.player = _player;
    this.gameId = gameId;
    this.loading = _loading;
    this.io = _socket;

    this.context = context;
    this.scope = context.scope;

    this.hostTurns = [];
    this.guestTurns = [];

    this.ready = false;
    this.turns = 0;

    this.destroy = function () {
      this.io.socket.removeAllListeners('guestArrived');
      this.io.socket.removeAllListeners('turn');
      this.io.socket.removeAllListeners('prematureClose');
      this.io.post('/game/end/' + this.gameId);
      this.scope.$apply();
    }

    this.loadTurns = function (turns) {
      if (!_.isArray(turns))
        turns = [turns];

      _.each(turns, function (turn) {
        if (turn.playerId === this.data.hostId) {
          this.hostTurns.push(turn);
        } else {
          this.guestTurns.push(turn);
        }

        if (turn.isWinning) {
          this.data.isOver = true;
          this.winner = turn.playerId;
          this.winnerIsBot = turn.isBotTurn;
          this.destroy();
        }

        this.turns++;
      }, this);
      game.scope.$apply();
    }

    this.loading.show();
    this.io.get('/game/enter/' + gameId, function (response) {
      console.debug('[SERVER] Game Enter:', response);
      game.loading.hide();

      game.data = response.game;
      if (game.data.hostId === game.player.getId()) {
        game.player.playHost();
      } else {
        game.player.playGuest();
      }

      game.loadTurns(response.turns);
      constructCallback.call(game.context, game);
    });

    this.io.socket.on('guestArrived', function (player) {
      console.debug('[SOCKET] Guest joined:', player);
      game.setGuest.call(game, player);
    })

    this.io.socket.on('turn', function (data) {
      console.debug('[SOCKET] New turn is played:', data);
      game.addTurn.call(game, data.game, data.turn);
    })

    // when a game closes prematurely
    this.io.socket.on('prematureClose', function (data) {
      console.debug('[SOCKET] Game closed prematurely:', data);
      game.prematureClose.call(game, data);
    })
  }

  GameModel.prototype.addTurn = function (game, turn) {
    this.data.isOver = game.isOver;
    this.data.isHostTurn = game.isHostTurn;
    this.loadTurns(turn);
  }

  GameModel.prototype.getSecret = function (callback, context) {
    var game = this;
    this.loading.show();
    this.io.get('/game/secret/' + game.gameId, function (response) {
      console.debug('[SERVER] Game Secret:', response);
      game.loading.hide();
      callback.call(context, response.message);
      game.scope.$apply();
    })
  }

  GameModel.prototype.playTurn = function (data, success, fail, context) {
    var game = this;
    this.loading.show();
    this.io.post('/game/turn', data, function (response) {
      console.debug('[SERVER] Game Play Turn:', response);
      game.loading.hide();

      if (response.errors) {
        fail.call(context, response.errors);
      } else {
        success.call(context, response);
      }

      game.scope.$apply();
    })
  }

  GameModel.prototype.lastTurnIsBot = function () {
    var last = this.guestTurns.length - 1,
      turn = this.guestTurns[last];

    return turn ? turn.isBotTurn : false;
  }

  GameModel.prototype.getWinnerName = function () {
    return this.winnerId === this.data.hostId ? this.data.host : this.data.guest;
  }

  GameModel.prototype.prematureClose = function (game) {
    this.data.isPrematureClosed = game.isPrematureClosed;
    this.data.isOver = game.isOver;
    this.scope.$apply();
  }

  GameModel.prototype.setGuest = function (data) {
    this.data.guest = data.guest;
    this.data.guestId = data.guestId;
    this.scope.$apply();
  }

  GameModel.prototype.isPlayerTurn = function () {
    if (this.data.isMultiplayer) {
      return this.player.isHost() === this.data.isHostTurn;
    }

    return true;
  }

  GameModel.prototype.isBotTurn = function () {
    if (this.data.isMultiplayer || !this.data.isWithBot)
      return false;

    if (!this.data.isCooperative)
      return true;

    return !this.lastTurnIsBot();
  }

  GameModel.prototype.isWaiting = function () {
    if (this.data.isMultiplayer && !this.data.isOver)
      return !(this.data.guestId > 0);

    return false;
  }

  GameModel.$factory = function (Player, Loading, $socket) {
    _player = Player;
    _loading = Loading;
    _socket = $socket;
    return GameModel;
  }

  GameModel.$factory.$inject = ['Player', 'Loading', '$socket'];
  angular.module('BullsAndCows').factory('GameModel', GameModel.$factory);
})();