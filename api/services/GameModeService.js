var gameModes = {
  PvC: 'Player vs PC',
  BvC: 'Bot vs PC',
  CBvC: 'Co-op with Bot vs PC',
  CvC: 'Co-op with Player vs PC',
  PvP: 'Player vs Player'
}

module.exports = {
  isValid: function (mode) {
    return undefined !== gameModes[mode];
  },

  getModes: function () {
    return gameModes;
  }
}