'use strict';

(function () {

  var _player, _loading, _socket;

  var GameModel = function (gameId, context, constructCallback) {
    // resource bindings
    this.gameId = gameId;
    this.player = _player;
    this.loading = _loading;
    this.socket = _socket;

    // the context in which the object is used (e.g. GameController)
    this.context = context;
    this.scope = context.scope;

    // turn array containers & total counter
    this.hostTurns = [];
    this.guestTurns = [];
    this.turns = 0;

    // game state
    this.ready = false;

    // [socket listener] a guest joins the game
    this.socket.on('guestArrived', function (player) {
      console.debug('[SOCKET] Guest joined:', player);
      this.setGuest(player);
    }, this);

    // [socket listener] a turn is played
    this.socket.on('turn', function (data) {
      console.debug('[SOCKET] New turn is played:', data);
      this.addTurn(data.game, data.turn);
    }, this);

    // [socket listener] a game closes prematurely
    this.socket.on('prematureClose', function (data) {
      console.debug('[SOCKET] Game closed prematurely:', data);
      this.prematureClose(data);
    }, this);

    // [init] game data from the server
    this.loading.show();
    this.socket.get('/game/enter/' + gameId, function (response) {
      this.loadData(response, constructCallback);
    }, this);
  }

  /**
   * Loads data in the game object
   * @param  {Object}   response :: Response object from server
   * @param  {Function} callback :: Construct callback - receives the object
   */
  GameModel.prototype.loadData = function (response, callback) {
    console.debug('[SERVER] Game Enter:', response);
    this.loading.hide();

    this.data = response.game;
    if (this.data.hostId === this.player.getId()) {
      this.player.playHost();
    } else {
      this.player.playGuest();
    }

    this.loadTurns(response.turns);
    callback.call(this.context, this);
  }

  /**
   * Desotrys a game session by unregistering all event
   * listeners and sending a message to the server, that
   * unsubscribes the socket from it
   */
  GameModel.prototype.destroy = function () {
    this.socket.off('guestArrived');
    this.socket.off('turn');
    this.socket.off('prematureClose');
    this.socket.post('/game/end/' + this.gameId);
    this.scope.$apply();
  }

  /**
   * Load an array of turns
   * @param {Array|Object} turns :: Either a single or
   *                                an array of turn objects
   */
  GameModel.prototype.loadTurns = function (turns) {
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

    this.scope.$apply();
  }

  /**
   * Add a single turn to the game and updates the game
   * state, based on what the previous turn was
   * @param {object} game
   * @param {turn}   turn
   */
  GameModel.prototype.addTurn = function (game, turn) {
    _.merge(this.data, game);
    this.loadTurns(turn);
  }

  /**
   * Grabs an object
   * @param  {Function} callback [description]
   * @param  {[type]}   context  [description]
   * @return {[type]}            [description]
   */
  GameModel.prototype.getSecret = function (callback, context) {
    this.loading.show();
    this.socket.get('/game/secret/' + this.gameId, function (response) {
      console.debug('[SERVER] Game Secret:', response);

      this.loading.hide();
      callback.call(context, response.message);
      this.scope.$apply();
    }, this);
  }

  GameModel.prototype.playTurn = function (data, success, fail, context) {
    this.loading.show();
    this.socket.post('/game/turn', data, function (response) {
      console.debug('[SERVER] Game Play Turn:', response);

      this.loading.hide();
      if (response.errors) {
        fail.call(context, response.errors);
      } else {
        success.call(context, response);
      }

      this.scope.$apply();
    }, this);
  }

  GameModel.prototype.lastTurnIsBot = function () {
    var last = this.guestTurns.length - 1,
      turn = this.guestTurns[last];

    return turn ? turn.isBotTurn : false;
  }

  GameModel.prototype.getWinnerName = function () {
    if (this.winnerId === this.data.hostId) {
      return this.data.host;
    } else {
      return this.data.guest;
    }
  }

  GameModel.prototype.prematureClose = function (game) {
    _.merge(this.data, game);
    this.scope.$apply();
  }

  GameModel.prototype.setGuest = function (data) {
    _.merge(this.data, data);
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