angular.module('BullsAndCows').run([
  '$rootScope',
  function ($root) {
    /**
     * The list of mulitplayer games, defaults to empty
     * @type {Object}
     */
    $root.games = {}

    $root.lobbyLoad = function (games) {
      $root.apply(function () {
        for (var i in games) {
          $root.games[games[i].id] = games[i];
        };
      })
    }

    $root.lobbyAddGame = function (data) {
      $root.apply(function () {
        $root.games[data.id] = data;
      })
    }

    $root.lobbyRemoveGame = function (game) {
      $root.apply(function () {
        if ($root.games[game.id]) {
          delete $root.games[game.id];
        }
      })
    }

    $root.lobbyReset = function () {
      $root.apply(function () {
        $root.games = {};
      })
    }
  }
])