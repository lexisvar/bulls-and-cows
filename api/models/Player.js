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
    var single = 'number' === typeof where ? true : false;

    return Player
      .find({
        id: where
      })
      .exec(function (err, names) {
        var data = [];
        if (!(names instanceof Array)) {
          names = [names];
        }

        for (var i in names) {
          data[names[i].id] = names[id].name;
        }

        return callback.call(null, single ? data[i] : data);
      });
  }

})(module.exports)