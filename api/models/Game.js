(function ($) {

  $.titleRegex = /^[a-zA-Z 0-9]{5,}$/;
  $.errorMessages = {
    title: 'A valid game title is required, it should ' +
      'be alphanumeric and at least 5 characters long'
  }

  $.attributes = {
    title: {
      type: 'string',
      required: true,
      isValidTitle: true
    },

    // PLAYERS ID
    hostPlayerId: {
      type: 'integer',
      required: true
    },
    guestPlayerId: {
      type: 'integer',
      required: true
    },

    // SECRET NUMBERS
    hostSecret: {
      type: 'integer',
      required: true
    },
    guestSecret: {
      type: 'integer',
      required: true
    },

    // STATE FLAGS
    hostTurn: {
      type: 'boolean',
      defaultsTo: false
    },
    isMultiplayer: {
      type: 'boolean',
      defaultsTo: false
    },
    isCooperative: {
      type: 'boolean',
      defaultsTo: false
    },
    isWithBot: {
      type: 'boolean',
      defaultsTo: false
    },
    isOver: {
      type: 'boolean',
      defaultsTo: false
    }
  };

  $.types = {
    isValidTitle: function (title) {
      return this.isMultiplayer && ValidTitle.test(this.title)
    }
  };

  $.beforeCreate = function (values, next) {
    values.title = values.title.trim();
    next();
  };

  $.toggleTurn = function () {
    if (this.isMultiplayer)
      this.hostTurn = !this.hostTurn;
  };
})(module.exports);