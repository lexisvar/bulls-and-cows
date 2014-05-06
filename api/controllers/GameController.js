(function ($) {

  var announceNewGame = function (game, socketExclude) {
    if (game.isMultiplayer) {
      Player.getNames(game.hostId,
        function (player) {
          game.host = player.name;
          return Game.publishCreate(Game.secure(game), socketExclude);
        })
    }
  }

  $.enter = function (req, res) {
    var session = Session.get(req);
    var gameId = parseInt(req.param('id'));
    if (isNaN(gameId))
      gameId = session.game;

    // unsubscribe from the global Game scope
    Game.unsubscribe(req.socket);

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
          //Session.setGame(req, null);
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
      function onSuccess(game, turn) {
        Game.publishUpdate(game.id, {
          action: 'turn',
          turn: turn
        });

        // if this is the winning turn, 
        // destroy the player session
        if (turn.isWinning) {
          Session.setGame(req, null);
        }

        return res.json(turn);
      },
      function onFail(game, turnErrors) {
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

    Game.newGame(
      req.params.all(),
      Session.get(req),
      function (errors, game) {
        // output errors
        if (errors) {
          return res.json({
            errors: Errors.format(Game, errors)
          });
        }

        // set session game
        Session.setGame(req, game);

        // unsubscribe from global listeners, subscribe to game only
        Game.unsubscribe(req.socket);
        Game.subscribe(req.socket, game);

        // announce to listening sockets
        announceNewGame(game);

        // secure output
        Game.secure(game);
        return res.json(game);
      });
  }

  $.join = function (req, res) {
    Game
      .findOne(req.param('id'))
      .then(function (errors, game) {
        if (!game || game.guestId) {
          return res.json({
            error: 'The game is not found or is already full'
          });
        }

        game.guestId = Session.get(req, 'id');
        game.guestSecret = param('secret');

        game.save(function (errors, game) {
          if (errors) {
            return res.json({
              errors: Errors.format(Game, errors)
            })
          }

          Session.setGame(req, game);
          return res.json(game);
        });
      });
  }

  $.secret = function (req, res) {
    Game
      .findOne(req.param('id'))
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