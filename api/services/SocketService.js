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
   * @param  {object}   session :: The session object
   * @param  {boolean}  connect :: True if called onConnect
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
   * @param  {boolean} increase :: True if the amount should increase
   */
  $.countOnline = function (increase) {
    totalUsers += true === increase ? 1 : -1;
  }

  /**
   * Return the number of UNIQUE online users
   * @return {integer}
   */
  $.getOnline = function () {
    return totalUsers;
  }

  /*****************************************
  #
  #           Lobby event emitters
  #
  ******************************************/

  /**
   * Introduce a new game object to the lobby, after
   * selecting the player name that hosted it from
   * the database
   *
   * @param  {object} game :: A valid game object
   * @return {SocketSerice}
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

  /**
   * Remove a game from the lobby
   * @param  {integer} id :: the id of the game to be removed
   * @return {SocketService}
   */
  $.lobbyRemoveGame = function (gameId) {
    sails.io.sockets. in ('lobby')
      .emit('removeGame', gameId);
    return $;
  }

  /**
   * Subscribe a user to the lobby
   * @return {SocketService}
   */
  $.lobbyJoin = function (socket) {
    socket.join('lobby');
    return $;
  }

  /**
   * Unsubscribe a user from the lobby
   * @return {SocketService}
   */
  $.lobbyLeave = function (socket) {
    socket.leave('lobby');
    return $;
  }

  /*****************************************
  #
  #           Game event emitters
  #
  ******************************************/

  /**
   * Generate a game room name
   * @param  {integer} gameId
   * @return {string}
   */
  var gameRoom = function (gameId) {
    return 'game_' + gameId;
  }

  /**
   * Subscribes a user socket to a specific game room
   *
   * @param  {integer} gameId
   * @param  {io.socket} socket
   * @return {SocketService}
   */
  $.gameJoin = function (gameId, socket) {
    socket.join(gameRoom(gameId));
    return $;
  }

  /**
   * Unsubscribe a user socket from a specific game room
   *
   * @param  {integer} gameId
   * @param  {io.socket} socket
   * @return {SocketService}
   */
  $.gameLeave = function (gameId, socket) {
    socket.leave(gameRoom(gameId));
    return $;
  }

  /**
   * Notifies the host of a game that another player has
   * joined the game
   *
   * @param  {integer} gameId
   * @param  {object} data      :: Contains the guest' name and player Id
   * @param  {io.socket} socket :: Socket of the guest user
   * @return {SocketService}
   */
  $.gameGuestArrived = function (gameId, data, socket) {
    socket.broadcast.to(gameRoom(gameId))
      .emit('guestArrived', data);
    return $;
  }

  /**
   * Emits to all players in game that a new turn has been played out
   * @param  {integer} gameId
   * @param  {object} data   :: Contains current game state and the turn object
   * @return {SocketService}
   */
  $.gameTurn = function (gameId, data) {
    sails.io.sockets. in (gameRoom(gameId))
      .emit('turn', data);
    return $;
  }

  /**
   * Emits to players in the room that the other player has disconnected
   * and the game has closed prematurely
   *
   * @param  {integer} gameId
   * @param  {object} data   :: Contains current game state
   * @return {SocketService}
   
   */
  $.gamePrematureClose = function (gameId, data) {
    sails.io.sockets. in (gameRoom(gameId))
      .emit('prematureClose', data);

    return $;
  }

  /**
   * Unsubscribe all sockets from a game room. Called when a premature
   * game close is accomplished
   *
   * @param  {integer} gameId
   * @return {SocketService}
   */
  $.gameUnsubscribeAll = function (gameId) {
    var room = gameRoom(gameId)
    sails.io.clients(room).leave(room);
    return $;
  }


  return $;
})(module.exports)