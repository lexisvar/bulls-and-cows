(function ($) {

  $.autoCreatedAt = false;
  $.autoUpdatedAt = false;

  $.errorMessages = {
    guess: "The secret number must be 4 digits long, " +
      "not containg any duplicate digits and not starting with a zero"
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

        var secret;
        if (!game.isMultiplayer || game.isCooperative) {
          secret = game.hostSecret;
        } else {
          secret = data.isHost ? game.guestSecret : game.hostSecret;
        }

        var score = Engine.findMatches(data.guess, secret);
        var turnData = {
          gameId: data.gameId,
          playerId: data.playerId,
          guess: data.guess,
          cows: score.c,
          bulls: score.b,
          isBotTurn: data.isBotTurn,
          isWinning: score.b === 4 ? true : false
        };

        GameTurn
          .create(turnData)
          .done(function (errors, turn) {
            if (null !== errors) {
              return failCallback.call(null, game, errors)
            }

            game.isHostTurn = !game.isHostTurn;
            game.isOver = turn.isWinning;

            return game.save(function (err) {
              successCallback.call(null, game, turn);
            });

            successCallback.call(null, game, turn);
          })
      })
  }

})(module.exports);