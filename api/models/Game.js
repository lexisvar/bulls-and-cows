/**
 * Game
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

var ErrorMessages = {
  mode: 'Selected game mode is invalid',
  title: 'A valid game title is required, it should alphanumeric and at least 5 characters long'
}

var ValidTitle = /^[a-zA-Z 0-9]{5,}$/;
var privateGames = ['host', 'bot'];
var publicGames = ['host', 'guest'];

var nextPlayerTurn = function (current, mode) {
  var gameMode = GameModeService.getByMode(mode);

  // if a multiplayer game (e.g. public) - pick the other one
  if (gameMode.isPublic) {
    return publicGames.splice(publicGames.indexOf(current), 1)[0];
  }

  // if a private game with both bot and player - pick the other one
  if (gameMode.hasBot && gameMode.hasPlayer) {
    return privateGames.splice(privateGames.indexOf(current), 1)[0];
  }

  // if a private game with only one type of player - return the same
  return current;
}

module.exports = {
  types: {
    gameMode: function (mode) {
      return GameModeService.isValid(mode);
    },

    gameTitle: function (title) {
      var isPublic = GameModeService(this.mode);
      if (isPublic && !ValidTitle.test(title.trim()))
        return false;

      return true;
    }
  },

  attributes: {

    title: {
      type: 'string'
    },

    createdBy: {
      type: 'string',
      required: true
    },

    guestUser: {
      type: 'string'
    },

    secretNumber: {
      type: 'integer',
      required: true
    },

    hostSecret: {
      type: 'integer'
    },

    guestSecret: {
      type: 'integer'
    },

    isPublic: {
      type: 'boolean'
    },

    isBotGame: {
      type: 'boolean'
    },

    playerCount: {
      type: 'integer'
    },

    mode: {
      type: 'string',
      gameMode: true,
      required: true
    },

    nextTurn: {
      type: 'string',
    },

    isOpen: {
      type: 'boolean',
      defaultsTo: false
    },

    winnerName: {
      type: 'string'
    },

    isOver: {
      type: 'boolean',
      defaultsTo: false
    },

    turnsPlayed: {
      type: 'integer',
      defaultsTo: 0
    }

  },

  beforeCreate: function (values, cb) {
    var mode = GameModeService.getByMode(mode);

    // set public game status
    values.isPublic = mode.isPublic;

    // set the number of players (to estimate who has the next turn)
    if (mode.isPublic) {
      values.playerCount = 2;
    } else {
      values.playerCount = (mode.hasBot && mode.hasPlayer) ? 2 : 1;
    }

    // set game to open if a public/multiplayer game
    values.isOpen = values.isPublic;

    // trim game title
    values.title = values.title.trim();

    cb();
  },

  getSecretNumber: function (guessedBy) {
    if (!this.isPublic)
      return this.secretNumber;

    if ('host' === guessedBy)
      return this.guestSecret;

    return this.hostSecret;
  },

  ownsTurn: function (isHost, guessedBy) {
    if (1 === this.playerCount)
      return true;

    if ('bot' === guessedBy && 'bot' === this.nextTurn)
      return true;

    if (isHost && 'host' === this.nextTurn)
      return true;

    if (!isHost && 'guest' === this.nexTurn)
      return true;

    return false;
  },

  getGuessedBy: function (fromRequest, isHost) {
    if ('bot' === fromRequest)
      return fromRequest;

    return isHost ? 'host' : 'guest';
  },

  getNextPlayerTurn: function () {
    return nextPlayerTurn(this.nextTurn, this.mode);
  },

  errorMessages: function () {
    return ErrorMessages;
  }

};