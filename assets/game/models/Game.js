'use strict';

(function () {

  var Game = function (Player) {
    this.player = Player;
    this.ready = false;
    this.turns = 0;
  }

  Game.$inject = ['Player'];

  Game.prototype.setData = function (game, turns) {
    this.data = game || {};
    this.loadTurns(turns);

    if (!this.data.isMultiplayer || this.data.guestId)
      this.ready = true;
  }

  Game.prototype.loadTurns = function (turns) {
    var game = this;

    if (!_.isArray(turns))
      turns = [turns];

    _.each(turns, function (turn) {
      if (turn.playerId === this.data.hostId) {
        game.hostTurns.push(turn);
      } else {
        game.guestTurns.push(turn);
      }

      if (turn.isWinning) {
        game.data.isOver = true;
        game.winner = turn.playerId;
        game.winnerIsBot = turn.isBotTurn;
        Server.gameEnd(turn.gameId);
      }

      this.turns++;
    });
  }

  Game.prototype.addTurn = function (game, turn) {
    this.data.isOver = game.isOver;
    this.data.isHostTurn = game.isHostTurn;
    this.loadTurns(turn);
  }

  angular.module('BullsAndCows').factory('Game', Game);

})