angular.module('BullsAndCows').service('PlayModes', function () {
  var $ = {};

  /**
   * Static definition of all play modes with their
   * specific Game configuration
   * @type {Object}
   */
  $.all = {
    singlePlayer: {
      title: 'Play vs PC',
      isMultiplayer: false,
      isCooperative: false,
      isWithBot: false
    },
    singlePlayerCoopWithBot: {
      title: 'Co-op with Bot vs PC',
      isMultiplayer: false,
      isCooperative: true,
      isWithBot: true
    },
    singlePlayerWithBot: {
      title: 'Bot vs PC',
      isMultiplayer: false,
      isCooperative: false,
      isWithBot: true
    },
    multiplayerCoop: {
      title: 'Co-op with Player vs PC',
      isMultiplayer: true,
      isCooperative: true,
      isWithBot: false
    },
    multiplayerPvP: {
      title: 'Player vs Player',
      isMultiplayer: true,
      isCooperative: false,
      isWithBot: false
    }
  }

  /**
   * A mode accessor by Id
   * @param  {string} modeId The name of the play mode
   * @return {[type]}        [description]
   */
  $.get = function (modeId) {
    return $.all[modeId];
  }

  /**
   * Checks if a specific modeId is a valid play mode
   * @param  {string}  modeId The name of the play mode
   * @return {Boolean}        Return true if a valid mode
   */
  $.isValid = function (modeId) {
    return undefined !== $.all[modeId];
  }

  /**
   * Formats an object for a "new game" request
   * @param  {string} mode   The id of the play mode
   * @param  {string} title  Game title
   * @param  {string} secret Host secret
   * @return {object}       Formatted game request object
   */
  $.formatGameObject = function (mode, title, secret) {
    var mode = $.get(mode);
    return {
      title: title,
      secret: secret,
      isMultiplayer: mode.isMultiplayer,
      isWithBot: mode.isWithBot,
      isCooperative: mode.isCooperative
    }
  }

  return $;
});