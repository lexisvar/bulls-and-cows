/**
 * The Session service has a collection of session formatting
 * helpers that are used accross the API controllers
 */
(function ($) {

  /**
   * A getter for the current user' session info
   * @return {object}     A hash value
   */
  $.get = function (req, param) {
    var data = {
      id: req.session.playerId || null,
      name: req.session.name || null,
      game: req.session.game || null,
      isHost: req.session.isHost || null
    }

    return undefined !== data[param] ? data[param] : data;
  }

  /**
   * Setter for the session value from the ORM entity, register
   * socket count as well
   */
  $.setInfo = function (req, entity) {
    req.session.playerId = entity.id;
    req.session.name = entity.name;
    SocketService.countConnections(req.session, true);
  }

  /**
   * Returns true if a user has a valid Player session
   */
  $.hasSession = function (req) {
    return undefined === req.session.playerId ? false : true;
  }

  $.getGame = function (req) {
    return req.session.game || null;
  }

  $.setGame = function (req, game) {
    if (game === null) {
      return req.session.currentGame = req.session.isHost = null;
    }

    req.session.game = gameId;
    req.session.isHost = game.hostPlayerId === req.session.playerId
  }
})(module.exports)