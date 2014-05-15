'use strict';

(function () {

  var Loading = function () {
    this.isVisible = true;
  }

  Loading.prototype.show = function () {
    this.isVisible = true;
  }

  Loading.prototype.hide = function () {
    this.isVisible = false;
  }

  angular.module('BullsAndCows').service('Loading', Loading);

})();