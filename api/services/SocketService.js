(function ($) {

  /**
   * Socket service, private variables
   */
  var counter = {};
  var totalUsers = 0;

  /**
   * Count incoming socket connections by playerId. If the user is
   * connecting and the count equals 1, then count as an additional
   * online user. If the count equals 0, then remove one user from
   * the total, destroy the counter instance and close all open
   * games where the user was either a guest or a host
   *
   * @param  {object}   session The session object
   * @param  {boolean}  connect Count towards connect or disconnect
   */
  $.countConnections = function (session, connect) {
    var id = parseInt(session.playerId);

    if (isNaN(id))
      return false;

    if (undefined === counter[id])
      counter[id] = 0;

    // count multiple connections from the same user
    counter[id] += true === connect ? 1 : -1;

    // if first connection for user, increase total count by 1
    if (1 === counter[id] && true === connect) {
      $.countOnline(true);
    }

    // if count equals 0 (e.g. last disconnecting socket instance)
    else if (0 === counter[id]) {
      // reduce total count by 1
      $.countOnline(false);

      // delete counter for user
      delete counter[id];

      // unset game session
      Session.setGame({
        session: session
      }, null);
      session.save();

      // close all open games
      Game.closeOpenGames(id);
    }
  }

  /**
   * Counts the amount of total identified players in the game
   * @param  {boolean} increase Increase/Decrease => true/false
   */
  $.countOnline = function (increase) {
    totalUsers += true === increase ? 1 : -1;
  }

  /**
   * Return the number of online users
   * @return {integer}
   */
  $.getOnline = function () {
    return totalUsers;
  }

  /**
   * Lobby events
   */

  $.lobbyIntroduce = function (game) {
    if (!game.isMultiplayer)
      return $;

    Player
      .findOne(game.hostId)
      .then(function (player) {
        var message = {
          id: game.id,
          title: game.title,
          host: player.name,
          isCooperative: game.isCooperative
        }

        sails.io.sockets. in ('lobby')
          .emit('newGame', message)
      })

    return $;
  }

  $.lobbyRemoveGame = function (id) {
    sails.io.sockets. in ('lobby')
      .emit('removeGame', id);
    return $;
  }

  $.lobbyJoin = function (socket) {
    socket.join('lobby');
    return $;
  }

  $.lobbyLeave = function (socket) {
    socket.leave('lobby');
    return $;
  }

  /**
   * Game events
   */

  var gameRoom = function (gameId) {
    return 'game_' + gameId;
  }

  $.gameJoin = function (gameId, socket) {
    socket.join(gameRoom(gameId));
    return $;
  }

  $.gameLeave = function (gameId, socket) {
    socket.leave(gameRoom(gameId));
    return $;
  }

  $.gameGuestArrived = function (gameId, data, socket) {
    socket.broadcast.to(gameRoom(gameId))
      .emit('guestArrived', data);
    return $;
  }

  $.gameTurn = function (gameId, data) {
    sails.io.sockets. in (gameRoom(gameId))
      .emit('turn', data);
    return $;
  }

  $.gamePrematureClose = function (gameId, data) {
    sails.io.sockets. in (gameRoom(gameId))
      .emit('prematureClose', data);
  }


  return $;
})(module.exports)