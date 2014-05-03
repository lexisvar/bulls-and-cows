(function ($) {

  /**
   * Register a new player, a valid name would be required, otherwise
   * an error is dispatched to the user.
   *
   * If registration goes smoothly, register a new player session
   * and dispatch the session info back to the frontend
   */
  $.register = function (req, res) {
    if (Session.hasSession(req))
      return res.json(Session.get(req));

    Player.create({
      name: req.param('name')
    }).done(
      function (errors, entity) {
        if (errors) {
          return res.json({
            errors: Errors.format(Player, errors)
          });
        }
        Session.setInfo(req, entity);
        return res.json(Session.get(req));
      });
  }

  /**
   * Get the current player' session info, if any, the Session service
   * would handle empty session states and return them as null
   */
  $.get = function (req, res) {
    return res.json(Session.get(req));
  }

  /**
   * Return the number of players online
   * @todo  add socket subscription
   */
  $.online = function (req, res) {
    return res.json({
      online: SocketService.getOnline()
    });
  }

  $.server = function (req, res) {
    res.json(Engine);
  }

})(module.exports);