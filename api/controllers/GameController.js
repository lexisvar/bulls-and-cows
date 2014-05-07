(function ($) {

  $.enter = function (req, res) {
    var session = Session.get(req);
    var gameId = parseInt(req.param('id'));

    if (isNaN(gameId))
      gameId = session.game;

    // get game with turns and send them to user
    Game.getWithTurns(gameId,
      function (game, turns) {
        // if the game is not found
        if (null === game) {
          return res.json({
            error: 'Game not found'
          })
        }

        Game.secure(game);

        // if the game is over, remove the player session for it
        if (game.isOver) {
          Session.setGame(req, null);
        }

        // subscribe for this game specifically
        else {
          Game.subscribe(req.socket, game);
        }

        return res.json({
          game: game,
          turns: turns
        })
      })
  }

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
        SocketService.gameTurn(game.id, turn);

        // if this is the winning turn -> destroy the player session
        if (turn.isWinning) {
          Session.setGame(req, null);
        }

        return res.json(turn);
      },

      function turnFail(game, turnErrors) {
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
          errors: Errors.format(GameTurn, turnErrors)
        })
      });
  }

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

  $.join = function (req, res) {
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
      if (!game || session.id !== game.guestId) {
        return res.json({
          error: 'The game is not found or is already full'
        });
      }

      if (errors) {
        return res.json({
          errors: Errors.format(Game, errors)
        })
      }

      Session.setGame(req, game);
      Game.secure(game);

      SocketService
        .gameJoin(game.id, req.socket)
        .lobbyLeave(req.socket)
        .gameGuestArrived(game.id, guestInfo, req.socket)

      return res.json(game);
    })
  }

  $.secret = function (req, res) {
    var gameId = req.param('id');

    Game.findOne(gameId)
      .then(function (game) {
        if (!game || game.isMultiplayer) {
          return res.json({
            message: 'These are not the droids you are looking for!'
          })
        }

        return res.json({
          message: 'Hacker mode enabled!' + "\n" + 'The secret number is ' + game.hostSecret
        })
      })
  }
})(module.exports)