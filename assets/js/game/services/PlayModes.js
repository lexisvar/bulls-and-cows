angular.module('BullsAndCows').service('PlayModes', function () {
  var $ = {};

  playMode = function (title, isMultiplayer, isCooperative, isWithBot) {
    return {
      title: title,
      isMultiplayer: isMultiplayer,
      isCooperative: isCooperative,
      isWithBot: isWithBot
    }
  }

  $.all = {
    singlePlayer: playMode('Play vs PC', false, false, false),
    singlePlayerCoopWithBot: playMode('Co-op with Bot vs PC', false, true, true),
    singlePlayerWithBot: playMode('Bot vs PC', false, false, true),
    multiplayerCoop: playMode('Co-op with Player vs PC', true, true, false),
    multiplayerPvP: playMode('Player vs Player', true, false, false)
  }

  $.getById = function (modeId) {
    return $.all[modeId] || {}
  }

  return $;
});