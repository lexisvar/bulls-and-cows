'use strict';

(function () {
  var Lobby = function ($scope, Lobby, PlayModes, Player, Location) {

    this.scope = $scope;
    this.session = new Lobby($scope);
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

  Lobby.$inject = ['$scope', 'Lobby', 'PlayModes', 'Player', 'Location'];

  Lobby.prototype.createCancel = function () {
    var mode = this.play.get(this.create.mode);
    if (mode && mode.isMultiplayer) {
      return this.create.mode = false;
    }

    this.create.form = false;
  }

  Lobby.prototype.createGame = function () {
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

  Lobby.prototype.createSuccess = function (response) {
    this.location.goToGame(response.id);
    this.scope.$apply();
  }

  Lobby.prototype.createFail = function (errors) {
    if (errors.hasGame) {
      alert(errors.hasGame);
      return this.location.goToPlayerGame();
    }

    this.create.errors = errors;
    this.scope.$apply();
  }

  Lobby.prototype.isPvP = function () {
    if (this.join.selected)
      return !this.session.games[this.join.selected].isCooperative;

    return false;
  }

  Lobby.prototype.selectGame = function (id) {
    this.join.selected = this.join.selected === id ? false : id;
    if (this.isPvP()) {
      this.join.form = true;
    }
  }

  Lobby.prototype.joinGame = function () {
    this.join.error = false;
    if (this.join.selected && this.isPvP() && !this.join.form)
      return this.join.form = true;

    var data = {
      id: this.join.selected,
      secret: this.join.secret
    }

    this.session.join(data, this.joinSuccess, this.joinFail, this);
  }

  Lobby.prototype.joinCancel = function () {
    this.join.error = false;
    this.join.form = false;
    this.join.selected = false;
  }

  Lobby.prototype.joinSuccess = function (response) {
    this.location.goToGame(response.id);
    this.scope.$apply();
  }

  Lobby.prototype.joinFail = function (errors) {
    if (errors.guestSecret) {
      this.join.error = errors.guestSecret;
    } else if (errors.hasGame) {
      alert(errors.hasGame);
      return this.location.goToPlayerGame();
    } else {
      lobby.join.error = errors;
    }

    this.scope.$apply();
  }

  angular.module('BullsAndCows').controller('LobbyController', Lobby);
})();