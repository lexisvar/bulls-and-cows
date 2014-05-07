(function ($) {
  /**
   * Enter a game room and provide either errors if
   * the game is not found or full information about the
   * game and the turns played thus far.
   *
   * In addition, subscribe the user to game room events.
   *
   * This kind of functionality allows for users to join
   * as observers
   */
  $.enter = function (req, res) {
    var session = Session.get(req);
    var gameId = parseInt(req.param('id'));

    if (isNaN(gameId))
      gameId = session.game;

    // get game with turns and send them to user
    Game.getWithTurns(gameId, function (game, turns) {

      // if the game is not found
      if (null === game) {
        return res.json({
          error: 'Game not found'
        })
      }

      // if the game is over, remove the player session for it
      if (game.isOver) {
        Session.setGame(req, null);
      } else {
        // socket tasks
        SocketService
          .gameJoin(game.id, req.socket)
          .lobbyLeave(req.socket);
      }

      Game.secure(game);
      var response = {
        game: game,
        turns: turns
      }

      return res.json(response);
    })
  }

  /**
   * This action is called when a new game turn is played
   * It provides errors for Game.isOver state, not your
   * turn to play errors.
   *
   * On success emits the newly database saved turn to
   * all users subscribed to the game room
   */
  $.turn = function (req, res) {
    var session = Session.get(req);

    var data = {
      guess: req.param('guess'),
      isBotTurn: req.param('isBotTurn') || false,
      gameId: session.game,
      playerId: session.id,
      isHost: session.isHost
    }

    GameTurn.playTurn(data,
      function turnSuccess(game, turn) {
        var message = {
          game: {
            isOver: game.isOver,
            isHostTurn: game.isHostTurn
          },
          turn: turn
        }

        SocketService.gameTurn(game.id, message);

        if (turn.isWinning) {
          SocketService.gameUnsubscribeAll(game.id);
        }

        return res.json(turn);
      },
      function turnFail(game, errors) {
        if (true === game.isOver) {
          return res.json({
            error: 'The game is over!'
          })
        }

        if (session.isHost === game.hostTurn) {
          return res.json({
            error: 'It is your not your turn to play'
          })
        }

        return res.json({
          errors: Errors.format(GameTurn, errors)
        })
      });
  }

  /**
   * Thos actopm os ca;;ed wjem a mew ga,e os created/
   * Ot prevents users with existing games to create new
   * ones and sends a formal error message about it, which
   * should be handled by the frontend with a redirect to
   * the game screen
   */
  $.create = function (req, res) {
    // if already have game session, return error
    if (null !== Session.getGame(req)) {
      return res.json({
        error: {
          hasGame: 'You can play only one game at a time'
        }
      })
    }

    var data = {
      params: req.params.all(),
      playerId: Session.get(req, 'id')
    }

    Game.host(data, function (errors, game) {
      // output errors
      if (errors) {
        return res.json({
          errors: Errors.format(Game, errors)
        });
      }

      // set player session info about the game
      Session.setGame(req, game);

      // socket tasks
      SocketService
        .gameJoin(game.id, req.socket)
        .lobbyIntroduce(game)
        .lobbyLeave(req.socket);

      // secure output
      Game.secure(game);
      return res.json(game);
    });
  }

  /**
   * This action is called when a player joins a multiplayer
   * game instance. It handles errors as well as setting proper
   * Session info about the player's current game
   */
  $.join = function (req, res) {
    // if already have game session, return error
    if (null !== Session.getGame(req)) {
      return res.json({
        error: {
          hasGame: 'You can play only one game at a time'
        }
      })
    }

    var session = Session.get(req);
    var data = {
      id: req.param('id'),
      guestSecret: req.param('secret'),
      guestId: session.id
    }

    var guestInfo = {
      guestId: session.id,
      guest: session.name
    }

    Game.join(data, function (errors, game) {
      if (errors) {
        return res.json({
          errors: Errors.format(Game, errors)
        })
      }

      if (!game || session.id !== game.guestId) {
        return res.json({
          error: 'The game is not found or is already full'
        });
      }

      Session.setGame(req, game);
      Game.secure(game);
      return res.json(game);
    })
  }

  /**
   * This action is called when the frontend is trying to obtain
   * the game secret. This functionality is disabled in multiplayer
   * games
   */
  $.secret = function (req, res) {
    var gameId = req.param('id');

    Game.findOne(gameId).then(function (game) {
      console.log(arguments);
      if (!game || game.isMultiplayer) {
        return res.json({
          message: 'These are not the droids you are looking for!'
        })
      }

      return res.json({
        message: 'Hacker mode enabled!' + "\n" +
          'The secret number is ' + game.hostSecret
      })
    })
  }

  /**
   * Cleans up the player's game session data and unsubscribes
   * them from the game room
   */
  $.end = function (req, res) {
    var gameId = parseInt(req.param('id')),
      sessionGame = Session.getGame(req);

    SocketService.gameLeave(gameId || sessionGame, req.socket);

    if (sessionGame === gameId) {
      Session.setGame(req, null);
    }

    return res.json({
      message: 'Game left'
    })
  }


})(module.exports)