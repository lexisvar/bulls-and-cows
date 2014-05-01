(function ($) {

  /**
   * Register a new player, a valid name would be required, otherwise
   * an error is dispatched to the user.
   *
   * If registration goes smoothly, register a new player session
   * and dispatch the session info back to the frontend
   */
  $.register = function (req, res) {
    if (Session.hasPlayerSession(req))
      return req.json(Session.getInfo(req));

    Player.create({
      name: req.param('name')
    }).done(
      function (errors, entity) {
        if (errors) {
          return res.json({
            errors: Errors.format(Player, errors)
          });
        }
        Session.setPlayerInfo(req, entity);
        return res.json(Session.getInfo(req));
      });
  }

  /**
   * Get the current player' session info, if any, the Session service
   * would handle empty session states and return them as null
   */
  $.get = function (req, res) {
    return res.json(Session.getInfo(req));
  }

  /**
   * Return the number of players online
   * @todo  add socket subscription
   */
  $.online = function (req, res) {
    Player.count({
      isOnline: true
    }).done(function (errors, result) {
      return res.json({
        count: result
      });
    })
  }

})(module.exports);