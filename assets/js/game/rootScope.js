angular.module('BullsAndCows').run(['$rootScope', '$timeout',
  function ($root, $timeout) {
    $root.playerData = {
      id: null,
      name: null,
      game: null,
      isHost: null
    }

    $root.flags = {
      showLoading: true,
      appLoaded: false
    }

    $root.games = {}

    var hideLoadingTimeout = 500;
    var dontApplyWhen = ['$apply', '$digest'];
    var applyState = function (callback) {
      return dontApplyWhen.indexOf($root.$$phase) > -1 ? callback.call() : $root.$apply(callback);
    }

    var showLoading = function (state) {
      return applyState(function () {
        $root.flags.showLoading = true === state ? true : false;
      });
    }

    $root.showLoading = function () {
      return showLoading(true);
    }

    $root.hideLoading = function () {
      return $timeout(showLoading, hideLoadingTimeout);
    }

    $root.hasPlayerId = function () {
      return $root.playerData.id ? true : false;
    }

    $root.getPlayerName = function () {
      return $root.playerData.name;
    }

    $root.getPlayerData = function (callback) {
      return 'function' === typeof callback ? callback.call($root.playerData) : $root.playerData;
    }

    $root.applyPlayerData = function (data, callback) {
      return applyState(function () {
        $root.playerData = data;
        return 'function' === typeof callback ? callback.call(null, data) : undefined;
      });
    }

    $root.appIsLoaded = function () {
      return applyState(function () {
        $root.flags.appLoaded = true;
        $root.flags.showLoading = false;
      });
    }
  }
]);