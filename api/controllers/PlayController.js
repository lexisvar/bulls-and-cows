module.exports = {

  getGames: function (req, res) {
    Game.find()
  },

  getModes: function (req, res) {
    return res.json({
      modes: GameModeService.getModes()
    });
  },

  newGame: function (req, res) {
    if (undefined !== req.session.currentGame) {
      return res.json({
        error: 'You have already started another game',
        error_type: 'another_game',
        gameId: req.session.currentGame
      });
    }

    return Game.create({
      mode: req.param('mode'),
      secretNumber: GameService.pickNewRandomNumber(),
      createdBy: req.session.playerName
    }).done(
      function (errors, game) {
        if (errors) {
          return res.json({
            error: ErrorService.get(Game, errors)
          })
        }

        req.session.isGameHost = true;
        req.session.currentGame = game.id;
        return res.json({
          gameId: game.id
        });
      });
  },

  guessNumber: function (req, res) {
    var gameId = req.param('gameId') || req.session.currentGame;

    return Game.findOneById(gameId).exec(
      function (errors, game) {
        var guess = req.param('guess'),
          isHost = req.session.isGameHost,
          guessedBy = game.getGuessedBy(req.param('guessedBy'), isHost),
          guessResult;

        if (!game.id || game.isOver) {
          return res.json({
            error: 'Invalid game'
          });
        }

        if (!game.ownsTurn(isHost, guessedBy)) {
          return res.json({
            error: 'It is not your turn to play'
          })
        }

        guessResult = GameService.findCowsAndBulls(guess, game.getSecretNumber(guessedBy));

        GameTurn.create({
          gameId: gameId,
          guessedBy: guessedBy,
          guess: guess,
          bulls: guessResult.bulls,
          cows: guessResult.cows
        }).done(
          function (errors, result) {
            if (errors) {
              return res.json({
                errors: ErrorService.get(GameTurn, errors)
              });
            }

            return res.json(result.toJSON());
          });
      });
  }

};