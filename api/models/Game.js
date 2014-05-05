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
    hostId: {
      type: 'integer',
      required: true
    },
    guestId: {
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
    if (undefined !== values.title)
      values.title = values.title.trim();

    if (this.isMultiplayer)
      values.hostTurn = Math.random() > 0.5;

    next();
  };

  $.toggleTurn = function (doSave) {
    if (this.isMultiplayer)
      this.hostTurn = !this.hostTurn;

    if (true === doSave)
      this.save();
  };

  $.over = function () {
    this.isOver = true;
    this.save();
  }

  $.newGame = function (params, session, callback) {
    var data;

    // if a Multiplayer game
    if (params['isMultiplayer']) {
      data = {
        title: params['title'] || -1, // some modifications to trigger title validator        
        hostId: session.id,
        hostSecret: !params['isCooperative'] ? params['secret'] : Engine.pickRandom(),
        isMultiplayer: true,
        isCooperative: params['isCooperative'] || false,
      }
    }
    // if a single player game vs Server
    else {
      data = {
        hostId: ServerPlayer.get('id'),
        guestId: session.id,
        hostSecret: Engine.pickRandom(),
        isWithBot: params['isWithBot'] || false,
        isCooperative: params['isCooperative'] || false,
      }
    }

    return this
      .create(data)
      .done(callback);
  }

  $.getUniqueKeys = function (values, keys) {
    var value, key, value, uniques = [];

    if (!(values instanceof Array)) {
      values = [values];
    }

    for (var i in values) {
      for (var x in keys) {
        key = keys[x];
        value = values[i][key];
        if (uniques.indexOf(value) === -1)
          uniques.push(value);
      }
    }

    return uniques;
  }

  $.secure = function (games) {
    if (!(games instanceof Array)) {
      games = [games];
    }

    for (var x in games) {
      delete games[x].hostSecret;
      delete games[x].guestSecret;
    }

    return games;
  }

  $.getWithNames = function (where, callback) {
    var single = 'number' === typeof where.id ? true : false;

    return Game
      .find(where)
      .exec(function (err, games) {
        var ids = $.getUniqueKeys(games, ['hostId', 'guestId']);
        Player.getNames(ids, function (players) {
          var i, game;
          for (i in games) {
            game = games[i];
            game.host = players[game.hostId];
            game.guest = players[game.guestId];
          }

          return callback.call(null, single ? games[i] : games);
        })
      })
  }

  $.findOpenGames = function (callback) {
    var where = {
      isMultiplayer: true,
      isOver: false,
      guestPlayerId: null
    }
    return this.getWithNames(where, callback);
  }

  $.getWithTurns = function (gameId, callback) {
    return Game.getWithNames({
        id: gameId
      },
      function (game) {
        GameTurn
          .find({
            gameId: game.id
          })
          .exec(function (err, turns) {
            game.turns = turns;
            return callback.call(null, game);
          })
      })
  }
})(module.exports);