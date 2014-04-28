module.exports = {

  getModes: function (req, res) {
    return res.json({
      modes: GameModeService.getModes()
    });
  }

};