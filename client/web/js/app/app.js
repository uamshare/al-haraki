'use strict';

define(['services/routeResolver'], function () {

    var app = angular.module('alHaraki', 
            [
                'ngTouch',
                'ngRoute', 
                'ngAnimate', 
                'routeResolverServices', 
                'ui.bootstrap', 
                'ui.grid',
                'ui.grid.pagination',
                'ui.grid.resizeColumns'
            ]
        );

    app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider',
                '$compileProvider', '$filterProvider', '$provide', '$httpProvider',

        function ($routeProvider, routeResolverProvider, $controllerProvider,
                  $compileProvider, $filterProvider, $provide, $httpProvider) {

            //Change default views and controllers directory using the following:
            //routeResolverProvider.routeConfig.setBaseDirectories('/app/views', '/app/controllers');

            app.register =
            {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };

            //Define routes - controllers will be loaded dynamically
            var route = routeResolverProvider.route;
            var routeCustome = routeResolverProvider.routeCustome;
            var modulesPath = 'js/modules';

            $routeProvider

                .when('/', 
                    routeCustome.resolve(
                        'main', 
                        'SiswaController'
                    )
                )

                // MASTER
                .when('/master/siswa', 
                    routeCustome.resolve(
                        'master/siswa/index', 
                        'SiswaController'
                    )
                )
        


                .when('/login', {
                    templateUrl: modulesPath + '/site/views/login.html',
                    controller: 'SiteLogin'
                })

                // AKUNTANSI
                .when('/akuntansi/coa', 
                    routeCustome.resolve(
                        'akuntansi/coa/index', 
                        'CoaController'
                    )
                )

                .when('/404', {
                    templateUrl: modulesPath + '/views/404.html'
                })

                .otherwise({redirectTo: '/404'})

    }]);

    app.run(['$rootScope', '$location', 'authService',
        function ($rootScope, $location, authService) {
            
            //Client-side security. Server-side framework MUST add it's 
            //own security as well since client-based security is easily hacked
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                if (next && next.$$route && next.$$route.secure) {
                    if (!authService.user.isAuthenticated) {
                        $rootScope.$evalAsync(function () {
                            authService.redirectToLogin();
                        });
                    }
                }
            });

    }]);

    return app;

});





