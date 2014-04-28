module.exports = function (req, res, next) {
  if (undefined !== req.session.playerName) {
    return next();
  }

  // User is not allowed
  return res.json({
    error: 'You are not permitted to perform this action.'
  });
};