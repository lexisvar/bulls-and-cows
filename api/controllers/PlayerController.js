var nameRegex = /^(?![0-9])[A-Za-z0-9 ]{3,30}$/

var isValidName = function (name) {
  if (null === name || !nameRegex.test(name.trim())) {
    return "Name should be between 3-30 characters long, " +
      "containing alphanumeric characters, spaces " +
      "and not starting with a number";
  }

  return true;
}

module.exports = {
  setName: function (req, res) {
    var name = req.param('name'),
      state = isValidName(name);

    if (true === state) {
      req.session.playerName = name;
    }

    res.json({
      state: state,
      name: name
    });

  },

  getName: function (req, res) {
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