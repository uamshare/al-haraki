'use strict';

define(['services/routeResolver'], function () {

    var app = angular.module('alHaraki', 
            [
                'ngRoute', 
                'ngAnimate', 
                'routeResolverServices', 
                'ui.bootstrap', 
                'ui.grid',
                'ui.grid.pagination'
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
                //route.resolve() now accepts the convention to use (name of controller & view) as well as the 
                //path where the controller or view lives in the controllers or views folder if it's in a sub folder. 
                //For example, the controllers for customers live in controllers/customers and the views are in views/customers.
                //The controllers for orders live in controllers/orders and the views are in views/orders
                //The second parameter allows for putting related controllers/views into subfolders to better organize large projects
                //Thanks to Ton Yeung for the idea and contribution
                // .when('/customers', route.resolve('Customers', 'customers/', 'vm'))
                // .when('/customerorders/:customerId', route.resolve('CustomerOrders', 'customers/', 'vm'))
                // .when('/customeredit/:customerId', route.resolve('CustomerEdit', 'customers/', 'vm', true))
                // .when('/orders', route.resolve('Orders', 'orders/', 'vm'))
                // .when('/about', route.resolve('About', '', 'vm'))
                // .when('/login/:redirect*?', route.resolve('Login', '', 'vm'))

                .when('/', {
                    templateUrl: modulesPath + '/views/main.html'
                })

                // Master
                // .when('/master/siswa', {
                //     templateUrl: modulesPath + '/views/master/siswa/index.html',
                //     resolve: route.resolveController('SiswaController')
                // })

                .when('/master/siswa', 
                    routeCustome.resolve(
                        'master/siswa/index', 
                        'SiswaController'
                    )
                )

                .when('/master/karyawan', {
                    templateUrl: modulesPath + '/views/master/karyawan/index.html'
                })
                .when('/master/jenistagihan', {
                    templateUrl: modulesPath + '/views/master/jenistagihan/index.html'
                })


                .when('/login', {
                    templateUrl: modulesPath + '/site/views/login.html',
                    controller: 'SiteLogin'
                })

                // AKUNTANSI
                // .when('/akuntansi/coa', {
                //     templateUrl: modulesPath + '/views/akuntansi/coa/index.html',
                //     resolve: route.resolve('coaController.js', '','/coa')
                // })
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





