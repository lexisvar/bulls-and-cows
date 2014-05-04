(function ($) {
  var announceNewGame = function (game, socketExclude) {
    if (game.isMultiplayer) {
      Player
        .findOne(game.hostPlayerId)
        .exec(function (errors, player) {
          Game.publishCreate({
            id: game.id,
            title: game.title,
            host: player.name,
            isCooperative: game.isCooperative
          }, socketExclude);
        });
    }
  }

  $.enter = function (req, res) {
    var gameId = Session.getGame(req);
    if (null === gameId) {
      return res.redirect('/lobby/join');
    }

    Game.unsubscribe(req.socket);
    Game
      .findOne(gameId)
      .then(function (errors, game) {
        if (true === game.isOver) {
          Session.setGame(null);
          return res.redirect('/lobby/join')
        }

        Game.subscribe(req.socket, game);
      })
  }

  $.turn = function (req, res) {
    var session = Session.getInfo(req),
      guess = param('guess');

    if (null === session.game) {
      return res.redirect('/lobby/join');
    }

    if (!Engine.isValidNumber(guess)) {
      return res.json({
        error: '"' + guess + '" is not a valid number!'
      });
    }

    GameTurn.playTurn(guess, session,
      function success(game, turn) {
        if (turn.bulls === 4) {
          return res.json({
            message: 'You won the game'
          })
        }
      },
      function fail(game) {
        if (true === game.isOver) {
          return res.json({
            message: 'The game is over',
            state: 'over'
          })
        }

        if (session.isHost === game.hostTurn) {
          return res.json({
            message: 'It is not your turn to play!',
            state: 'not_your_turn'
          })
        }
      });
  }

  $.create = function (req, res) {
    /*if (null !== Session.getGame(req)) {
      return res.json({
        error: 'You can play only one game at a time'
      })
    }*/

    Game.newGame(req.params.all(), Session.get(req),
      function (errors, game) {
        if (errors) {
          return res.json({
            errors: Errors.format(Game, errors)
          });
        }

        announceNewGame(game, req.socket);
        Session.setGame(req, game);
        return res.json(game.toJSON());
      });
  }

  $.join = function (req, res) {
    Game
      .findOne(req.param('id'))
      .then(function (errors, game) {
        if (undefined === game || game.guestPlayerId) {
          return res.json({
            error: 'The game was not found or is already full'
          });
        }

        game.guestPlayerId = Session.getPlayerId(req);
        game.guestSecret = param('secret');
        game.save(function (errors, result) {
          if (errors) {
            return res.json({
              errors: Errors.format(Game, errors)
            })
          }

          return res.json(result);
        });
      });
  }
})(module.exports)