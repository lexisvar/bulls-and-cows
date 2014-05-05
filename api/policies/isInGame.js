module.exports = function (req, res, next) {
  if (Session.getGame(req))
    return next();

  return res.json({
    error: 'You are not in a game'
  });
}