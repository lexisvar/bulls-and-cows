'use strict';

(function () {

  var PlayModes = function () {
    this.modes = [];

    this.registerMode = function (title, multi, coop, bot) {
      this.modes.push({
        title: title,
        isMultiplayer: multi,
        isCooperative: coop,
        isWithBot: bot
      })

      return this;
    }

    this
      .registerMode('Play vs PC', false, false, false)
      .registerMode('Co-op with Bot vs PC', false, true, true)
      .registerMode('Bot vs PC', false, false, true)
      .registerMode('Co-op with Player vs PC', true, true, false)
      .registerMode('Player vs Player', true, false, false);
  }

  PlayModes.prototype.isValid = function (modeId) {
    return undefined !== this.modes[modeId];
  }

  PlayModes.prototype.get = function (modeId) {
    return this.modes[modeId];
  }

  angular.module('BullsAndCows').service('PlayModes', PlayModes);
})()