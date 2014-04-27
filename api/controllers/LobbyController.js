module.exports = {
  enter: function (req, res) {
    req.session.playerName = req.param('name');

    // Games.find().subscribe(req.socket);
    res.json({
      state: true,
      name: req.param('name')
    });

  },

  hasEntered: function (req, res) {
    var state = false,
      name = req.session.playerName || null;

    if (null !== name) {
      state = true;
    }

    res.json({
      state: state,
      name: name
    });
  }
}