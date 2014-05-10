/**
 * Extension of the $rootScope for handling functionality
 * on the game screen
 */
angular.module('BullsAndCows').run([
  '$rootScope', 'Server',
  function ($root, Server) {
    /**
     * Container for an ongoing game's data in structure
     * @type {Object}
     */
    $root.game = {}

    /**
     * Sets $rootScope.game properties based on game object
     * passed to the method, if null, the default values
     * will be applied instead
     *
     * @param  {object} game Optional server provided game object
     * @return {void}
     */
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

    // gameSet with no arguments -> set defaults
    $root.gameSet();

    /**
     * Push a game turn into the turn queues, as well as updating
     * the game's isOver and isHostTurn states
     *
     * @param  {object} data Contains game and turn data
     * @return {void}
     */
    $root.gameAddTurn = function (data) {
      $root.apply(function () {
        $root.game.data.isOver = data.game.isOver;
        $root.game.data.isHostTurn = data.game.isHostTurn;
      });
      return $root.gameSetTurns([data.turn]);
    }

    /**
     * Adds information for a joined guest player, is triggered
     * by socket.on('guestArrived')
     *
     * @param  {object} data Contains guest name and player id
     * @return {void}
     */
    $root.gameApplyGuestPlayer = function (data) {
      $root.apply(function () {
        $root.game.data.guest = data.guest;
        $root.game.data.guestId = data.guestId;
      })
    }

    /**
     * Process an array of turns and apply them to the either the
     * host or guest turn queues based on turn player id and the
     * game's host id. In addition to that, set game isOver, winner
     * and winnerIsBot flag, when a winning turn is found
     *
     * @param  {array} turns  An array of turn objects
     * @return {void}
     */
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
            Server.gameEnd(turn.gameId);
          }

          $root.game.turnCount++;
        }
      })
    }

    /**
     * Checks if the last played turn in the guestTurns queue
     * was played by a bot
     *
     * @return {boolean} True if a bot turn
     */
    $root.gameLastTurnIsBot = function () {
      var last = $root.game.guestTurns.length - 1,
        turn = $root.game.guestTurns[last];

      return turn ? turn.isBotTurn : false;
    }

    /**
     * A getter for the name of the winner
     * @return {string}
     */
    $root.gameGetWinnerName = function () {
      return $root.game.winnerId === $root.game.data.hostId ? $root.game.data.host : $root.game.data.guest;
    }

    /**
     * Called when a game closes prematurely
     * @param  {object} game :: A minimal game data object
     * @return {void}
     */
    $root.gamePrematureClose = function (game) {
      $root.apply(function () {
        $root.game.data.isPrematureClosed = game.gameIsPrematureClosed;
        $root.game.data.isOver = game.isOver;
      })
    }

    /**
     * Multiple simple data accessors continue below!
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

    $root.gameIsWinnerBot = function () {
      return $root.game.winnerIsBot;
    }
  }
]);