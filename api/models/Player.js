(function ($) {

  $.autoCreatedAt = true;
  $.autoUpdatedAt = false;

  $.errorMessages = {
    name: "Player names should be between 3-30 characters, made of " +
      "only alphanumeric symbols, spaces and not starting with a digit"
  }

  $.attributes = {
    name: {
      type: 'string',
      required: true,
      isValidName: true
    },
    isServer: {
      type: 'boolean',
      defaultsTo: false
    }
  }

  var validNameRegex = /^(?![0-9])[A-Za-z0-9 ]{3,30}$/;
  $.types = {
    isValidName: function (name) {
      return validNameRegex.test(name.trim());
    }
  }

  $.beforeCreate = function (values, next) {
    values.name = values.name.trim();
    next();
  }

  $.toggleStatus = function () {
    this.isOnline = !this.isOnline;
    this.save();
  }

  $.getNames = function (where, callback) {
    return Player
      .find({
        id: where
      })
      .exec(function (err, players) {
        var data = [];
        if (!(players instanceof Array)) {
          players = [players];
        }

        for (var i in players) {
          data[players[i].id] = players[i].name;
        }

        return callback.call(null, data);
      });
  }
})(module.exports)