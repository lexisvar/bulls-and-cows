var root;
angular.module('BullsAndCows').run([
  '$rootScope',
  function ($root) {
    root = $root;
    /**
     * Container for an ongoing game's data in structure
     * @type {Object}
     */
    $root.game = {}

    $root.gameSet = function (game) {
      $root.apply(function () {
        var isGame = 'object' === typeof game;

        if (isGame) {
          $root.playerSetGame(game.id);
          $root.playerSetIsHost(game.hostId === $root.playerGetId());
        }

        $root.game = {
          isLoaded: isGame,
          data: isGame ? game : {},
          hostTurns: [],
          guestTurns: [],
          turnCount: 0,
          winner: null,
          winnerIsBot: false
        }
      })
    }

    // set defaults to object with by having no game specified
    $root.gameSet();

    $root.gameStart = function (data) {
      $root.apply(function () {
        $root.game.data = data;
      })
    }

    $root.gameAddTurn = function (data) {
      $root.apply(function () {
        $root.game.data.isOver = data.game.isOver;
        $root.game.data.isHostTurn = data.game.isHostTurn;
      });
      return $root.gameSetTurns([data.turn]);
    }

    $root.gameApplyGuestPlayer = function (data) {
      $root.apply(function () {
        $root.game.data.guest = data.guest;
        $root.game.data.guestId = data.guestId;
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

          if (turn.isWinning) {
            $root.playerSetGame(null, true);
            $root.game.data.isOver = true;
            $root.game.winner = turn.playerId;
            $root.game.winnerIsBot = turn.isBotTurn;
          }

          $root.game.turnCount++;
        }
      })
    }

    $root.gameLastTurnIsBot = function () {
      var last = $root.game.guestTurns.length - 1,
        turn = $root.game.guestTurns[last];

      return turn ? turn.isBotTurn : false;
    }

    /**
     * Multiple data accessors continue below!
     */
    $root.gameIsLoaded = function () {
      return $root.game.isLoaded;
    }

    $root.gameGetId = function () {
      return $root.game.data.id;
    }

    $root.gameIsPrematureClosed = function () {
      return $root.game.data.isPrematureClosed;
    }

    $root.gameGetHostName = function () {
      return $root.game.data.host;
    }

    $root.gameGetGuestName = function () {
      return $root.game.data.guest;
    }

    $root.gameGetHostTurns = function () {
      return $root.game.hostTurns;
    }

    $root.gameGetGuestTurns = function () {
      return $root.game.guestTurns;
    }

    $root.gameGetTurnsCount = function () {
      return $root.game.turnCount;
    }

    $root.gameGet = function () {
      return $root.game.data;
    }

    $root.gameIsMultiplayer = function () {
      return $root.game.data.isMultiplayer;
    }

    $root.gameHasGuest = function () {
      return $root.game.data.guestId > 0;
    }

    $root.gameIsCooperative = function () {
      return $root.game.data.isCooperative;
    }

    $root.gameIsWithBot = function () {
      return $root.game.data.isWithBot;
    }

    $root.gameGetHostId = function () {
      return $root.game.data.hostId;
    }

    $root.gameIsHostTurn = function () {
      return $root.game.data.isHostTurn;
    }

    $root.gameIsOver = function () {
      return $root.game.data.isOver;
    }

    $root.gameGetWinnerName = function () {
      return $root.game.winnerId === $root.game.data.hostId ? $root.game.data.host : $root.game.data.guest;
    }

    $root.gameIsWinnerBot = function () {
      return $root.game.winnerIsBot;
    }
  }
]);