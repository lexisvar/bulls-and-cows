'use strict';

(function () {
  var LobbyController = function ($scope, LobbyModel, PlayModes, Player, Location) {

    this.scope = $scope;
    this.session = new LobbyModel($scope);
    this.play = PlayModes;
    this.player = Player;
    this.location = Location;

    this.join = {
      selected: false,
      form: false,
      error: false,
      secret: ''
    }

    this.create = {
      form: false,
      mode: false,
      errors: [],
      title: '',
      secret: ''
    }

    var lobby = this;
    $scope.$on('$destroy', function () {
      lobby.session.destroy.call(lobby.session, function (response) {
        delete lobby.session;
      });
    })
  }

  LobbyController.$inject = ['$scope', 'LobbyModel', 'PlayModes', 'Player', 'Location'];

  LobbyController.prototype.createCancel = function () {
    var mode = this.play.get(this.create.mode);
    if (mode && mode.isMultiplayer) {
      return this.create.mode = false;
    }

    this.create.form = false;
  }

  LobbyController.prototype.createGame = function () {
    this.create.errors = [];

    var mode = this.play.get(this.create.mode);
    var data = {
      title: this.create.title,
      secret: this.create.secret,
      isMultiplayer: mode.isMultiplayer,
      isWithBot: mode.isWithBot,
      isCooperative: mode.isCooperative
    }

    this.session.create(data, this.createSuccess, this.createFail, this);
  }

  LobbyController.prototype.createSuccess = function (response) {
    this.location.goToGame(response.id);
  }

  LobbyController.prototype.createFail = function (errors) {
    if (errors.hasGame) {
      alert(errors.hasGame);
      this.location.goToPlayerGame();
    } else {
      this.create.errors = errors;
    }
  }

  LobbyController.prototype.isPvP = function () {
    if (this.join.selected)
      return !this.session.games[this.join.selected].isCooperative;

    return false;
  }

  LobbyController.prototype.selectGame = function (id) {
    this.join.selected = this.join.selected === id ? false : id;
    if (this.isPvP()) {
      this.join.form = true;
    }
  }

  LobbyController.prototype.joinGame = function () {
    this.join.error = false;
    if (this.join.selected && this.isPvP() && !this.join.form) {
      return this.join.form = true;
    }

    var data = {
      id: this.join.selected,
      secret: this.join.secret
    }

    this.session.join(data, this.joinSuccess, this.joinFail, this);
  }

  LobbyController.prototype.joinCancel = function () {
    this.join.error = false;
    this.join.form = false;
    this.join.selected = false;
  }

  LobbyController.prototype.joinSuccess = function (response) {
    this.location.goToGame(response.id);
  }

  LobbyController.prototype.joinFail = function (errors) {
    if (errors.hasGame) {
      alert(errors.hasGame);
      this.location.goToPlayerGame();
    } else {
      this.join.error = _.first(errors);
    }

    this.scope.$apply();
  }

  angular.module('BullsAndCows').controller('LobbyController', LobbyController);
})();