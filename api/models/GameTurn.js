(function ($) {

  $.autoCreatedAt = false;
  $.autoUpdatedAt = false;

  $.errorMessages = {
    guess: 'Your guess is not a valid "Bulls and Cows" number'
  }

  $.attributes = {
    gameId: {
      type: 'integer',
      required: true,
    },

    playerId: {
      type: 'integer',
      required: true,
    },

    guess: {
      type: 'integer',
      isValidGameNumber: true,
      required: true,
    },

    bulls: {
      type: 'integer',
      required: true
    },

    cows: {
      type: 'integer',
      required: true
    },

    isBotTurn: {
      type: 'boolean',
      defaultsTo: false
    },

    isWinning: {
      type: 'boolean',
      defaultsTo: false
    }
  }

  /**
   * Model validators
   * @type {Object}
   */
  $.types = {
    isValidGameNumber: function (number) {
      return Engine.isValidNumber(number);
    }
  }

  $.beforeCreate = function (values, next) {
    values.isWinning = values.bulls === 4 ? true : false;
    next();
  }

  /**
   * Save a game turn in the database, verify for errors before that,
   * call failCallback if there are any issues
   * @param  {object} data              Contains isHost, playerId, isBotTurn, guess, gameId
   * @param  {function} successCallback Called upon successful object creation
   * @param  {function} failCallback    Called when there's an issue with the data or turned played
   * @return {void}
   */
  $.playTurn = function (data, successCallback, failCallback) {
    Game
      .findOne(data.gameId)
      .exec(function (gameErrors, game) {
        if (game.isMultiplayer && data.isHost !== game.isHostTurn) {
          return failCallback.call(null, game, null);
        }

        if (game.isOver) {
          return failCallback.call(null, game, null);
        }

        var secret = data.isHost ? game.guestSecret : game.hostSecret;
        var result = Engine.findMatches(data.guess, secret);

        GameTurn
          .create({
            gameId: data.gameId,
            playerId: data.playerId,
            guess: data.guess,
            isBotTurn: data.isBotTurn,
            cows: result.c,
            bulls: result.b,
            isWinning: result.b === 4 ? true : false
          })
          .done(function (errors, turn) {
            if (null !== errors) {
              return failCallback.call(null, game, errors)
            }

            if (true === turn.isWinning) {
              game.isOver = true;
              return game.save(function (err) {
                successCallback.call(null, game, turn);
              });
            }
            successCallback.call(null, game, turn);
          })
      })
  }

})(module.exports);