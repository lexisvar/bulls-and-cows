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
      type: 'string',
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

    isWinning: {
      type: 'boolean',
      defaultsTo: false
    }
  }

  $.types = {
    isValidGameNumber: function (number) {
      return GameService.isValidNumber(number);
    }
  }

  $.beforeCreate = function (values, next) {
    values.isWinning = values.bulls === 4 ? true : false;
    next();
  }

  $.afterCreate = function (record, next) {
    $.updateCount(new Game(record.gameI));
    next();
  }

  $.toJSON = function () {
    var json = this.toObject();
    delete json.id;
  }

  $.updateCount = function (game) {
    this.countByGameId(game.id, function (error, count) {
      game.update({
        turnCount: count
      });
    });
  }

  $.playTurn = function (guess, player, successCallback, failCallback) {
    Game
      .findOne(player.game)
      .exec(function (errors, game) {
        if (player.isHost !== game.isHostTurn) {
          return failCallback.call(null, game);
        }

        var secret = player.isHost ? game.guestSecret : game.hostSecret;
        var result = Engine.findMatches(guess, secret);

        GameTurn
          .create({
            gameId: game.id,
            playerId: player.id,
            guess: guess,
            cows: result.c,
            bulls: result.b
          })
          .done(function (errors, turn) {
            if (turn.bulls === 4) {
              game.isOver = true;
              game.save();
            }
            successCallback.call(null, game, turn);
          })
      })
  }

})(module.exports);