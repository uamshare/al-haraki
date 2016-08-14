'use strict';

define(['services/routeResolver'], function () {

    var app = angular.module('alHaraki', 
        [
            'ngTouch',
            'ngRoute', 
            'ngAnimate', 
            'toastr',
            'routeResolverServices', 
            // 'ui.bootstrap', 
            'mgcrea.ngStrap',
            'ui.grid',
            'ui.grid.pagination',
            'ui.grid.resizeColumns',
            'ui.grid.exporter',
            'ui.grid.edit',
            'ui.grid.cellNav',
            'chieffancypants.loadingBar',
            'ngDialog'
        ]
    );

    app.constant('$CONST_VAR', {
        viewsDirectory : 'js/app/views/',
        restDirectory : 'http://local.project/al-haraki/rest/web/api/'
    });

    app.config([
        '$routeProvider', 
        'routeResolverProvider', 
        '$controllerProvider',
        '$compileProvider', 
        '$filterProvider', 
        '$provide', 
        '$httpProvider',
        'toastrConfig',
        'cfpLoadingBarProvider',
        '$datepickerProvider',
        function (
            $routeProvider,
            routeResolverProvider, 
            $controllerProvider,
            $compileProvider, 
            $filterProvider, 
            $provide, 
            $httpProvider, 
            toastrConfig,
            cfpLoadingBarProvider,
            $datepickerProvider
        ) 
        {
            app.register =
            {
                controller: $controllerProvider.register,
                directive: $compileProvider.directive,
                filter: $filterProvider.register,
                factory: $provide.factory,
                service: $provide.service
            };

            angular.extend(toastrConfig, {
                autoDismiss: false,
                containerId: 'toast-container',
                maxOpened: 0,    
                newestOnTop: true,
                positionClass: 'toast-bottom-right',
                preventDuplicates: false,
                preventOpenDuplicates: false,
                closeButton: true,
                target: 'body'
            });

            angular.extend($datepickerProvider.defaults, {
                dateFormat: 'dd/MM/yyyy',
                startWeek: 1
            });

            cfpLoadingBarProvider.includeSpinner = true;
            // cfpLoadingBarProvider.spinnerTemplate = '<div><div class="spinner-icon"></div>Custom Loading Message...</div>';
            cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner-icon"></div></div>'; //'<div><span class="fa fa-spinner">Loading...</div>';
            cfpLoadingBarProvider.latencyThreshold = 500;

            //Define routes - controllers will be loaded dynamically
            // var route = routeResolverProvider.route;
            var routeCustome = routeResolverProvider.routeCustome;
            $routeProvider
                .when('/', 
                    routeCustome.resolve(
                        'main',
                        'PegawaiController',
                        true
                    )
                )

                // MASTER
                .when('/master/siswa', 
                    routeCustome.resolve(
                        'master/siswa/index', 
                        'SiswaController',
                        true
                    )
                )
        
                // KEUANGAN
                .when('/keuangan/info-tagihan', 
                    routeCustome.resolve(
                        'keuangan/info-tagihan/index', 
                        'TagihanInfoController',
                        true
                    )
                )
                .when('/keuangan/info-tagihan/:idkelas/:month', 
                    routeCustome.resolve(
                        'keuangan/info-tagihan/edit', 
                        'TagihanInfoController',
                        true
                    )
                )

                .when('/keuangan/kwitansi-pembayaran', 
                    routeCustome.resolve(
                        'keuangan/kwitansi-pembayaran/index', 
                        'KwitansiPemabayaranController',
                        true
                    )
                )
                .when('/keuangan/kwitansi-pembayaran/:id', 
                    routeCustome.resolve(
                        'keuangan/kwitansi-pembayaran/edit', 
                        'KwitansiPemabayaranController',
                        true
                    )
                )


                // AKUNTANSI
                .when('/akuntansi/coa', 
                    routeCustome.resolve(
                        'akuntansi/coa/index', 
                        'CoaController',
                        true
                    )
                )

                .when('/login', 
                    routeCustome.resolve(
                        'login',
                        'LoginController'
                    )
                )

                .when('/login/:redirect*?', 
                    routeCustome.resolve(
                        'login',
                        'LoginController'
                    )
                )

                .when('/404', 
                    routeCustome.resolve(
                        '404'
                    )
                )

                .otherwise({redirectTo: '/404'})
            
            $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
            $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
            $httpProvider.defaults.headers.common['access-token'] = '$2y$13$9js4d7rmpbRxZxQngMA';
            $httpProvider.defaults.headers.common['X-CSRF-TOKEN'] =     $('meta[name="csrf-token"]').attr('content')
        }
    ]);

    app.run(['$rootScope', '$location', 'authService','$templateCache','cfpLoadingBar',
        function ($rootScope, $location, authService, $templateCache, cfpLoadingBar) {
            
            //Client-side security. Server-side framework MUST add it's 
            //own security as well since client-based security is easily hacked
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                cfpLoadingBar.start();
                $rootScope.fakeIntro = true;
                if (next && next.$$route && next.$$route.secure) {
                    var isLogin = (localStorage.getItem('isAuthValid') == 'true') ? true : false;
                    if (!isLogin) {
                        $rootScope.$evalAsync(function () {
                            authService.redirectToLogin();
                        });
                    }
                }
            });
            $rootScope.$on('$routeChangeSuccess', function(ev,data) {
                // ngProgress.complete();
                cfpLoadingBar.complete();
                $rootScope.fakeIntro = false;
            });

        }
    ]);

    return app;
});





