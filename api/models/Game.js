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

  $.newGame = function (params, session, callback) {
    var data;

    // if a Multiplayer game
    if (params['isMultiplayer']) {
      data = {
        isMultiplayer: true,
        isCooperative: params['isCooperative'] || false,
        hostSecret: !params['isCooperative'] ? params['secret'] : Engine.pickRandom(),
        hostPlayerId: session.id,
        title: params['title'] || -1 // some modifications to trigger title validator        
      }
    }
    // if a single player game vs Server
    else {
      data = {
        isWithBot: params['isWithBot'] || false,
        isCooperative: params['isCooperative'] || false,
        hostSecret: Engine.pickRandom(),
        hostPlayerId: ServerPlayer.get('id'),
        guestPlayerId: session.id
      }
    }

    return this
      .create(data)
      .done(callback);
  }

  $.findOpenMultiplayerGames = function (callback) {
    var i, match, hostId, hosts = [],
      findBy = {
        isMultiplayer: true,
        isOver: false,
        guestPlayerId: null
      }

    return this
      .find(findBy)
      .then(function (games) {
        for (i in games) {
          hostId = games[i].hostPlayerId;
          if (hosts.indexOf(hostId) === -1)
            hosts.push(hostId);
        }
        //console.log(games[0]);
        return Player
          .find({
            id: hosts
          })
          .then(function (players) {
            var game, sorted = [];

            // sort players data in an array based on their playerId
            for (i in players) {
              sorted[players[i].id] = players[i].name;
            }

            // premare games object by formatting a host name and
            // deleting values that are either not required or should be
            // hidden
            for (i in games) {
              game = games[i];
              game.host = sorted[game.hostPlayerId];
              delete game.hostSecret;
              delete game.hostPlayerId;
              delete game.guestPlayerId;
              delete game.hostTurn;
              delete game.hostTurn;
              delete game.isWithBot;
            }

            return callback.call(null, games);
          })
      });
  }

})(module.exports);