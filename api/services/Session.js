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
      isHost: req.session.isHost ? true : false
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

  /**
   * Returns the id of the current game saved in the session
   * @param  {requestObject} req
   * @return {integer|null}
   */
  $.getGame = function (req) {
    return req.session.game || null;
  }

  /**
   * Set session game params from game entity
   * @param {object} req  Request object
   * @param {object} game Optional game entity
   */
  $.setGame = function (req, game) {
    // if game is null -> destroy game params
    if (game === null) {
      return req.session.game = req.session.isHost = null;
    }

    req.session.game = game.id;
    req.session.isHost = game.hostId === req.session.playerId ? true : false;
  }
})(module.exports)