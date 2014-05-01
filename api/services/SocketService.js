(function ($) {

  /**
   * Socket service, private variables
   */
  var counter = {};
  var totalUsers = 0;

  /**
   * Count incoming socket connections by playerId. If the user is
   * connecting and the count equals 1, then count as an additional
   * online user. If the count equals 0, then remove one user from
   * the total, destroy the counter instance and close all open
   * games where the user was either a guest or a host
   *
   * @param  {object}   session The session object
   * @param  {boolean}  connect Count towards connect or disconnect
   */
  $.countConnections = function (session, connect) {
    var id = parseInt(session.playerId),
      count = counter[id] || 0;

    if (isNaN(id))
      return false;

    count += true === connect ? 1 : -1;

    if (1 === count && true === connect) {
      $.countOnline(true);
      counter[id] = 0;
    } else if (0 === count) {
      $.countOnline(false);
      delete counter[id];
      Player.closeOpenGames(id);
    }
  }

  /**
   * Counts the amount of total identified players in the game
   * @param  {boolean} increase Increase/Decrease => true/false
   */
  $.countOnline = function (increase) {
    totalUsers += true === increase ? 1 : -1;
  }

  /**
   * Return the number of online users
   * @return {integer}
   */
  $.getOnline = function () {
    return totalUsers;
  }


  return $;
})(module.exports)