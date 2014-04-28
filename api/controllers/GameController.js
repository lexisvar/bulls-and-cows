var gameModes = {
  PvC: 'Player vs PC',
  BvC: 'Bot vs PC',
  CBvC: 'Co-op with Bot vs PC',
  CvC: 'Co-op with Player vs PC',
  PvP: 'Player vs Player'
}

var isValidGameMode = function (mode) {
  return undefined !== gameModes[mode];
}

module.exports = {

  getModes: function (req, res) {
    return res.json({
      modes: gameModes
    });
  }

};