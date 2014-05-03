(function ($) {

  $.autoCreatedAt = false;
  $.autoUpdatedAt = false;

  var invalidNumberError = "The number must be 4 digits long, " +
    "not containg any duplicate digits and not starting with a 0";

  var validTitleRegex = /^[a-zA-Z 0-9]{5,}$/;

  $.errorMessages = {
    title: 'A valid game title is required, it should ' +
      'be alphanumeric and at least 5 characters long',
    hostSecret: invalidNumberError,
    guestSecret: invalidNumberError
  }

  $.attributes = {
    title: {
      type: 'string',
      isValidTitle: true
    },

    // PLAYERS ID
    hostPlayerId: {
      type: 'integer',
      required: true
    },
    guestPlayerId: {
      type: 'integer',
      defaultsTo: null
    },

    // SECRET NUMBERS
    hostSecret: {
      type: 'integer',
      required: true,
      isValidSecret: true
    },
    guestSecret: {
      type: 'integer',
      isValidGuestSecret: true
    },

    // STATE FLAGS
    isHostTurn: {
      type: 'boolean',
      defaultsTo: false
    },
    isMultiplayer: {
      type: 'boolean',
      defaultsTo: false
    },
    isCooperative: {
      type: 'boolean',
      defaultsTo: false
    },
    isWithBot: {
      type: 'boolean',
      defaultsTo: false
    },
    isOver: {
      type: 'boolean',
      defaultsTo: false
    }
  };

  $.types = {
    isValidTitle: function (title) {
      if (true === this.isMultiplayer)
        return validTitleRegex.test(title);

      return true;
    },

    isValidSecret: function (secret) {
      return Engine.isValidNumber(parseInt(secret));
    },

    isValidGuestSecret: function (secret) {
      if (!this.isMultiplayer || !this.guestPlayerId)
        return true;

      return Engine.isValidNumber(parseInt(secret));
    }
  };

  $.beforeCreate = function (values, next) {
    if (null !== values.title)
      values.title = values.title.trim();


    if (this.isMultiplayer)
      values.hostTurn = Math.random() > 0.5;

    next();
  };

  $.toggleTurn = function () {
    if (this.isMultiplayer)
      this.hostTurn = !this.hostTurn;
  };

  $.over = function () {
    this.isOver = true;
    this.save();
  }

  var formatNewGameData = function (req) {


    return {
      isMultiplayer: req.param('isMultiplayer') || false,
      isWithBot: req.param('isWithBot') || false,
      isCooperative: req.param('isCooperative') || false,
      hostPlayerId: hostPlayerId,
      title: title,
      hostSecret: hostSecret
    }
  }

  $.newGame = function (req, callback) {
    var multiplayer = req.param('isMultiplayer'),
      session = Session.get(req),
      data = {
        isMultiplayer: multiplayer || false,
        isWithBot: req.param('isWithBot') || false,
        isCooperative: req.param('isCooperative') || false,
        hostSecret: multiplayer ? req.param('secret') : Engine.pickRandom(),
        hostPlayerId: multiplayer ? ServerPlayer.get('id') : session.id,
        guestPlayerId: multiplayer ? null : session.id,
        title: multiplayer ? req.param('title') : null
      };

    Game
      .create(data)
      .done(callback);
  }

  $.findOpenMultiplayerGames = function (callback) {
    return Game.find({
      isMultiplayer: true,
      isOver: false,
      guestPlayerId: null
    }).then(function (games) {
      var x, game, data = [],
        name;

      for (x in games) {
        game = games[x];
        games[x].hostName = Player.getName(game.hostUserId);
      }

      callback.call(null, games);
    });
  }

})(module.exports);