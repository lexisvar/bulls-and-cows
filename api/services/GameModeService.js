var gameModes = {
  PvC: {
    title: 'Player vs PC',
    isPublic: false,
    hasPlayer: true,
    hasBot: false
  },
  BvC: {
    title: 'Bot vs PC',
    isPublic: false,
    hasPlayer: false,
    hasBot: true
  },
  CBvC: {
    title: 'Co-op with Bot vs PC',
    isPublic: false,
    hasPlayer: true,
    hasBot: true
  },
  CvC: {
    title: 'Co-op with Player vs PC',
    isPublic: true,
    cooperative: true,
  },
  PvP: {
    title: 'Player vs Player',
    isPublic: true,
    cooperative: false
  }
}

var $ = {};
module.exports = $;

$.isValid = function (mode) {
  return undefined !== gameModes[mode];
}

$.getByModeType = function (mode) {
  return gameModes[mode];
}

$.isPublic = function (mode) {
  if (!$.isValid(mode))
    return null;

  return gameModes[mode].isPublic;
}

$.getModes = function () {
  return gameModes;
}