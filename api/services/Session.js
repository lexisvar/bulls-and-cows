(function ($) {
  $.getInfo = function (req) {
    return {
      id: req.session.playerId || null,
      name: req.session.playerName || null,
      currentGame: req.session.gameId || null
    }
  }

  $.setPlayerInfo = function (req, entity) {
    req.session.playerId = entity.id;
    req.session.playerName = entity.name;
  }

  $.hasPlayerSession = function (req) {
    return req.session.playerId || false;
  }
})(module.exports)