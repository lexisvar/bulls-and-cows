(function ($) {

  $.join = function (req, res) {
    var currentGame = Session.getGame(req);
    if (null !== currentGame) {
      return res.redirect('/game/enter');
    }

    Game.unsubscribe(req.socket);
    Game.subscribe(req.socket);

    Game.findOpenMultiplayerGames(function (games) {
      return res.json(games);
    })
  }

  $.leave = function (req, res) {
    Game.unsubscribe(req.socket);
    return res.json({});
  }

})(module.exports);