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

    Game.unsubscribe(req.socket);
    GameTurn.unsubscribe(req.socket);

    Game.getWithTurns(session.game,
      function (game) {
        console.log(game);
        Game.secure(game);
        GameTurn.subscribe(req.socket, game.id);
        return res.json(game)
      })
  }

  $.turn = function (req, res) {
    var session = Session.get(req);

    GameTurn.playTurn(param('guess'), session,
      function success(game, turn) {
        GameTurn.publishUpdate({
          id: game.id,
          action: 'turn',
          turn: turn
        }, req.socket)

        return res.json(turn);
      },
      function fail(game) {
        if (true === game.isOver) {
          return res.json({
            error_over: true
          })
        }

        if ((session.isHost && !game.hostTurn) || (!session.isHost && game.hostTurn)) {
          return res.json({
            error_turn: true
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

    Game.newGame(
      req.params.all(),
      Session.get(req),
      function (errors, game) {
        if (errors) {
          return res.json({
            errors: Errors.format(Game, errors)
          });
        }

        announceNewGame(game, req.socket);
        Session.setGame(req, game);
        Game.secure(game);

        return res.json(game);
      });
  }

  $.join = function (req, res) {
    Game
      .findOne(req.param('id'))
      .then(function (errors, game) {
        if (undefined === game || game.guestId) {
          return res.json({
            error_game: true
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
})(module.exports)