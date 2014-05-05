module.exports = function (req, res, next) {
  if (Session.hasSession(req))
    return next();

  return res.json({
    error: 'A valid user player is required to perform this action'
  });
}