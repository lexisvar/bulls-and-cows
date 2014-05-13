var _ = require('lodash');

(function ($) {
  $.autoCreatedAt = false;
  $.autoUpdatedAt = false;

  var invalidNumberError = "The secret number must be 4 digits long, " +
    "not containg any duplicate digits and not starting with a zero";

  var validTitleRegex = /^[a-zA-Z 0-9]{4,}$/;

  $.errorMessages = {
    title: 'A valid game title is required, it should ' +
      'be alphanumeric and at least 4 characters long',
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
    isPrematureClosed: {
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
      if (!this.isMultiplayer || !this.guestId || this.isCooperative)
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

  $.host = function (data, callback) {
    var properties,
      params = data.params,
      playerId = data.playerId;

    // if a Multiplayer game
    if (params['isMultiplayer']) {
      properties = {
        title: params['title'] || -1, // some modifications to trigger title validator        
        hostId: playerId,
        hostSecret: !params['isCooperative'] ? params['secret'] : Engine.pickRandom(),
        isMultiplayer: true,
        isCooperative: params['isCooperative'] || false,
      }
    }
    // if a single player game vs Server
    else {
      properties = {
        hostId: ServerPlayer.get('id'),
        guestId: playerId,
        hostSecret: Engine.pickRandom(),
        isWithBot: params['isWithBot'] || false,
        isCooperative: params['isCooperative'] || false,
      }
    }

    return this.create(properties).done(callback);
  }

  $.join = function (data, callback) {
    var id = {
      id: data.id
    }

    // enforce validation, if value's not set
    data.guestSecret = data.guestSecret || -1;

    Game
      .findOne(id)
      .then(function (game) {
        // game not found or game has guest already
        if (!game || (game.guestId !== null)) {
          return callback.call(null, null, game);
        }

        // set the guest properties to the game object
        game.guestId = data.guestId;
        game.guestSecret = data.guestSecret;

        // save
        game
          .save(function (errors, game) {
            if (null !== errors) {
              return callback.call(null, errors, game);
            }

            // getWithNames doesn't return errors, so need to
            // extend the callback to set game at its proper
            // position for the controller method
            return Game.getWithNames(id, function (game) {
              callback.call(null, null, game)
            });
          })
      })
  }

  /**
   * Finds unique key values in a collection of objects
   * @param  {array|object} values One or multiple objects
   * @param  {array|string} keys   One or more keys to look for uniques
   * @return {[type]}        [description]
   */
  $.getUniqueKeys = function (objects, keys) {
    var uniques = [];

    if (!_.isArray(objects))
      objects = [objects];

    if (!_.isArray(keys))
      keys = [keys];

    _.forEach(objects, function (object) {
      var i, key;
      for (i in keys) {
        key = keys[i];
        if (!_.contains(uniques, object[key])) {
          uniques.push(object[key]);
        }
      }
    })

    return uniques;
  }

  $.secure = function (games) {
    if (!_.isArray(games))
      games = [games];

    for (var game in games) {
      delete games[game].hostSecret;
      delete games[game].guestSecret;
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
          games = _.map(games, function (game) {
            game.host = players[game.hostId];
            game.guest = players[game.guestId];
            Game.secure(game);
            return game;
          })

          return callback.call(null, single ? games[0] : games);
        })
      })
  }

  $.findOpenGames = function (callback) {
    var where = {
      isMultiplayer: true,
      isOver: false,
      guestId: null
    }
    return this.getWithNames(where, callback);
  }

  $.getWithTurns = function (gameId, callback) {
    var where = {
      id: gameId
    }

    return Game.getWithNames(where, function (game) {
      if (undefined === game) {
        return callback.call(null, null);
      }

      where = {
        gameId: game.id
      }

      GameTurn.find(where).exec(
        function (err, turns) {
          return callback.call(null, game, turns);
        })
    })
  }

  $.closeOpenGames = function (playerId) {
    var matching = {
      isOver: false,
      or: [{
        hostId: playerId
      }, {
        guestId: playerId
      }]
    }

    var withData = {
      isPrematureClosed: true,
      isOver: true
    }

    return Game
      .update(matching, withData)
      .then(function (games) {
        _.forEach(games, function (game) {
          SocketService
            .lobbyRemoveGame(game.id)
            .gamePrematureClose(game.id, withData)
            .gameUnsubscribeAll(game.id);
        })
      })
  }
})(module.exports);