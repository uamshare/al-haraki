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
            'ui.grid.resizeColumns',
            'ui.grid.exporter',
            'ui.grid.edit',
            'ui.grid.cellNav'
        ]
    );

    app.constant('$CONST_VAR', {
        viewsDirectory : 'js/app/views/',
        restDirectory : 'http://localhost:8012/al-haraki/rest/web/api/'
    });

    app.config(['$routeProvider', 'routeResolverProvider', '$controllerProvider',
                '$compileProvider', '$filterProvider', '$provide', '$httpProvider',
        function ($routeProvider, routeResolverProvider, $controllerProvider,
                  $compileProvider, $filterProvider, $provide, $httpProvider) 
        {
            app.register =
            {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };

            //Define routes - controllers will be loaded dynamically
            // var route = routeResolverProvider.route;
            var routeCustome = routeResolverProvider.routeCustome;

            $routeProvider
                .when('/', 
                    routeCustome.resolve(
                        'main',
                        'PegawaiController'
                    )
                )

                // MASTER SISWA
                .when('/master/siswa', 
                    routeCustome.resolve(
                        'master/siswa/index', 
                        'SiswaController'
                    )
                )


                .when('/master/siswa/add', 
                    routeCustome.resolve(
                        'master/siswa/form', 
                        'SiswaController'
                    )
                )

                // MASTER PEGAWAI
                .when('/master/karyawan', 
                    routeCustome.resolve(
                        'master/karyawan/index', 
                        'PegawaiController'
                    )
                )


                .when('/master/karyawan/add', 
                    routeCustome.resolve(
                        'master/karyawan/form', 
                        'PegawaiController'
                    )
                )

                // MASTER KELAS
                .when('/master/kelas', 
                    routeCustome.resolve(
                        'master/kelas/index', 
                        'KelasController'
                    )
                )


                .when('/master/kelas/add', 
                    routeCustome.resolve(
                        'master/kelas/form', 
                        'KelasController'
                    )
                )
        
                // KEUANGAN
                .when('/keuangan/info-tagihan', 
                    routeCustome.resolve(
                        'keuangan/info-tagihan/index', 
                        'InfotagihanController'
                    )
                )
                .when('/keuangan/info-tagihan/:idkelas/:month', 
                    routeCustome.resolve(
                        'keuangan/info-tagihan/edit', 
                        'InfotagihanController'
                    )
                )

                // .when('/login', {
                //     templateUrl: modulesPath + '/site/views/login.html',
                //     controller: 'SiteLogin'
                // })

                // AKUNTANSI
                .when('/akuntansi/coa', 
                    routeCustome.resolve(
                        'akuntansi/coa/index', 
                        'CoaController'
                    )
                )

                .when('/404', 
                    routeCustome.resolve(
                        '404'
                    )
                )

                .otherwise({redirectTo: '/404'})
        }
    ]);

    app.run(['$rootScope', '$location', 'authService','$templateCache',
        function ($rootScope, $location, authService, $templateCache) {
            
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

        }
    ]);

    return app;
});





