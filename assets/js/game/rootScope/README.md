# A few words about the $rootScope code

The concept was to put every additional functionality that brings the app together
in **$rootScope**, because exporting certain functionality into a Service or a Factory
doesn't make it available into Angular's templates right off the bat.

You would need to inject the dependency in the controller and then have their data
binding linked through $scope in order to be available in the teamplte.

With **$rootScope**, that's not the case, as its contents are freely available to all
templates at all times.

In order for data encapsulation to stay as is, the Controllers wouldn't directly
apply properties to **$rootScope**, instead various helper getter and setter methods
are presented for ease of use.

The **$rootScope** functionality is devided accordingly in:

  * **Main.js** - required by all **$rootScope** submodules and the FrontController
  * **Loading.js** - for manipulating the "Loading..." message
  * **Player.js** - for Player data and state
  * **Lobby.js** - for Lobby data and state
  * **Game.js** - for Game data and state

If you look further, you will find that the **$rootScope** functionality is actually 
extended to create one larger data model with many getter/setter methods present,
whilst communication logic and end-point functionality is still kept in either a
service, factory or a controller.