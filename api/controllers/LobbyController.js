(function ($) {

  var formatGameData = function (req) {
    var hostSecret, hostPayerId, title = null;

    if (!req.param('isMultiplayer')) {
      hostSecret = Engine.pickRandom();
      hostPlayerId = ServerPlayer.get('id');
    } else {
      hostSecret = req.param('secret');
      hostPlayerId = req.session.playerId;
      title = req.param('title');
    }

    return {
      isMultiplayer: req.param('isMultiplayer') || false,
      isWithBot: req.param('isWithBot') || false,
      isCooperative: req.param('isCooperative') || false,
      hostPlayerId: hostPlayerId,
      title: title,
      hostSecret: hostSecret
    }
  }

  $.list = function (req, res) {
    Game.findOpenMultiplayerGames(function (games) {
      Game.subscribe(req.socket, games);
      return res.json(games);
    })
  }

  $.create = function (req, res) {
    Game
      .create(formatGameData(req))
      .done(function (errors, game) {
        if (errors) {
          return res.json({
            errors: Errors.format(errors)
          });
        }
      });
  }

  $.leave = function (req, res) {}

})(module.exports);