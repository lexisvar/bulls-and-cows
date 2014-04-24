angular.module('BullsAndCows').config([
    '$routeProvider',
    function($routeProvider) {
        var route = function(Name, Template) { // controller
            return {
                controller: Name,
                templateUrl: Template
            }
        }

        $routeProvider
            .when('/home', route('Index', '/index.html'))
            .otherwise(redirect("/"));
    }
]);