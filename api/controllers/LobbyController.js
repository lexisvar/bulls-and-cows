(function ($) {

  $.join = function (req, res) {
    var currentGame = Session.getGame(req);
    if (null !== currentGame) {
      // return res.redirect('/game/enter');
    }

    SocketService.lobbyJoin(req.socket);
    Game.findOpenGames(function (games) {
      return res.json(games);
    })
  }

  $.leave = function (req, res) {
    SocketService.lobbyLeave(req.socket);
    return res.json({
      success: 'Left lobby'
    });
  }

})(module.exports);