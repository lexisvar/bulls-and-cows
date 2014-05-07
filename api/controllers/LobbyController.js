(function ($) {

  /**
   * Subscribe the user to lobby events and game
   */
  $.join = function (req, res) {
    SocketService.lobbyJoin(req.socket);
    Game.findOpenGames(function (games) {
      return res.json(games);
    })
  }

  /**
   * Unsubscribe the user from lobby events
   */
  $.leave = function (req, res) {
    SocketService.lobbyLeave(req.socket);
    return res.json({
      success: 'Left lobby'
    });
  }

})(module.exports);