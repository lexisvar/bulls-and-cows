/**
 * ServerPlayer service - a Player object that is
 * used by the backend as the Computer user
 */
(function ($) {
  var ServerPlayer;

  /**
   * Init, executed during bootstrap to find the existing
   * or create a new Server Player
   */
  $.init = function () {
    if (undefined !== ServerPlayer)
      return;

    Player
      .findOne({
        isServer: true
      })
      .then(function (player) {
        if (undefined !== player) {
          return ServerPlayer = player;
        }

        Player
          .create({
            name: 'Computer',
            isServer: true
          })
          .done(function (errors, player) {
            ServerPlayer = player;
          });
      });
  }

  /**
   * Accessor for the ServerPlayer's properties by specifying a
   * specific ServerPlayer property and if found return it, otherwise
   * return the whole ServerPlayer object
   *
   * @param  {string} property Optional property identifier
   * @return {mixed}           ServerPlayer data
   */
  $.get = function (property) {
    if (undefined !== ServerPlayer[property])
      return ServerPlayer[property]

    return ServerPlayer;
  }

  return $;

})(module.exports)