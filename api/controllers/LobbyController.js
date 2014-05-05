(function ($) {

  $.join = function (req, res) {
    var currentGame = Session.getGame(req);
    if (null !== currentGame) {
      // return res.redirect('/game/enter');
    }

    // unsubscribe first, to prevent double subscription
    Game.unsubscribe(req.socket);
    Game.subscribe(req.socket);

    Game.findOpenGames(function (games) {
      return res.json(games);
    })
  }

  $.leave = function (req, res) {
    Game.unsubscribe(req.socket);
    return res.json({});
  }

})(module.exports);