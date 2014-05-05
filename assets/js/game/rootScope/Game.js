var root;
angular.module('BullsAndCows').run([
  '$rootScope',
  function ($root) {
    root = $root;
    /**
     * Container for an ongoing game's data in structure
     * @type {Object}
     */
    $root.game = {
      data: {},
      hostTurns: [],
      guestTurns: []
    }

    $root.gameStart = function (data) {
      $root.apply(function () {
        $root.flags.waitingForPlayer = false;
        $root.game.data = data;
      })
    }

    $root.gameAddTurn = function (turn) {
      return $root.setTurns([turn]);
    }

    $root.gameSet = function (game) {
      $root.apply(function () {
        $root.game.data = game;
      })
    }

    $root.gameSetTurns = function (turns) {
      $root.apply(function () {
        var i, turn;
        for (i in turns) {
          turn = turns[i];
          if (turn.playerId === $root.game.data.hostId) {
            $root.game.hostTurns.push(turn)
          } else {
            $root.game.guestTurns.push(turn)
          }
        }
      })
    }

    $root.gameGet = function () {
      return $root.game.data;
    }
  }
]);