(function ($) {

  $.errorMessages = {
    guess: 'Guess is not a valid "Bulls and Cows" number'
  }

  $.autoCreatedAt = false;
  $.autoUpdatedAt = false;

  $.attributes = {
    gameId: {
      type: 'integer',
      required: true,
    },

    geussUserId: {
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
  }

  $.types = {
    isValidGameNumber: function (number) {
      return GameService.isValidNumber(number);
    }
  }

  $.afterCreate = function () {
    $.updateCount(new Game(this.gameId));
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

})(module.exports);