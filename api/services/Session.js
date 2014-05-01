/**
 * The Session service has a collection of session formatting
 * helpers that are used accross the API controllers
 */
(function ($) {

  /**
   * A getter for the current user' session info
   * @return {object}     A hash value
   */
  $.getInfo = function (req) {
    return {
      id: req.session.playerId || null,
      name: req.session.playerName || null,
      currentGame: req.session.gameId || null
    }
  }

  /**
   * Setter for the session value from the ORM entity, register
   * socket count as well
   */
  $.setPlayerInfo = function (req, entity) {
    req.session.playerId = entity.id;
    req.session.playerName = entity.name;
    SocketService.countConnections(req.session, true);
  }

  /**
   * Returns true if a user has a valid Player session
   */
  $.hasPlayerSession = function (req) {
    return req.session.playerId || false;
  }
})(module.exports)