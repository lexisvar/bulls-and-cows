var ErrorMessages = {
  guess: 'Guess is not a valid "Bulls and Cows" number'
}

module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  types: {
    gameNumber: function (number) {
      return GameService.isValidNumber(number);
    }
  },
  attributes: {
    gameId: {
      type: 'integer',
      required: true,
    },

    guessedBy: {
      type: 'string',
      required: true,
    },

    guess: {
      type: 'integer',
      gameNumber: true,
      required: true,
    },

    bulls: {
      type: 'integer',
      required: true
    },

    cows: {
      type: 'integer',
      required: true
    }
  },

  afterCreate: function () {
    GameTurn.countByGameId(this.gameId).done(
      function (errors, result) {
        Game.update({
          id: this.gameId
        }, {
          turnsPlayed: result
        }, function () {

        });
      });
  },

  errorMessages: function () {
    return ErrorMessages;
  },

  toJSON: function () {
    var json = this.toObject();
    delete json.id;
  }
}