/**
 * This is the game controller that handles the functionality
 * on the /game/:gameId page
 */
'use strict';

(function () {

  /**
   * Constructor
   */
  var GameController = function ($scope, Location, GameModel, Engine, Player) {
    var gameId = Location.getGameIdFromRequest() || Player.getGame();
    var game = this;

    this.form = {
      error: false,
      guess: ''
    }

    this.session = {};
    this.scope = $scope;
    this.engine = Engine;
    this.player = Player;

    new GameModel(gameId, this, function (game) {
      this.session = game;
      this.pupulateSet();
      this.scope.$apply();
    });

    $scope.$on('$destroy', function () {
      game.session.destroy.call(game.session);
    })
  }

  GameController.prototype.pupulateSet = function () {
    if (!this.session.data.isOver && this.session.data.isWithBot) {
      this.secretSet = this.engine.getSetCopy();

      if (this.session.turns > 0) {
        var filter = this.engine.filterTurns;
        var guestTurns = this.session.guestTurns;
        this.secretSet = filter(this.secretSet, guestTurns);
      }
    }
  }

  GameController.prototype.playTurn = function () {
    if (this.session.data.isOver) {
      return false;
    }

    this.form.error = false;

    var botTurn = this.session.isBotTurn();
    var guess = this.form.guess;

    if (botTurn) {
      guess = this.engine.nextGuess(this.secretSet);
    }

    var data = {
      guess: guess,
      isBotTurn: botTurn
    }

    this.session.playTurn(data, this.turnSuccess, this.turnFail, this);
  }

  GameController.prototype.turnSuccess = function (response) {
    var score = this.engine.buildScore(response.bulls, response.cows);
    this.secretSet = this.engine.filterSet(this.secretSet, response.guess, score);
  }

  GameController.prototype.turnFail = function (errors) {
    if (errors.guess) {
      this.form.error = errors.guess;
    }
  }

  GameController.prototype.getSecret = function () {
    this.session.getSecret(alert);
  }

  GameController.$inject = ['$scope', 'Location', 'GameModel', 'Engine', 'Player'];
  angular.module('BullsAndCows').controller('GameController', GameController);
})();