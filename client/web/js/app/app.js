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
            'ui.grid.grouping',
            'chieffancypants.loadingBar',
            'ngDialog',
            // 'chart.js'
        ]
    );

    app.constant('$CONST_VAR', {
        viewsDirectory : 'js/app/views/',
        restDirectory : BASEAPIURL
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
        // 'ChartJsProvider',
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
            // ChartJsProvider
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

            // Configure all charts
            // ChartJsProvider.setOptions({
            //   chartColors: ['#FF5252', '#FF8A80'],
            //   responsive: false
            // });
            // Configure all line charts
            // ChartJsProvider.setOptions('line', {
            //   showLines: false
            // });

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
                        'main/index',
                        'MainController',
                        true
                    )
                )

                // MASTER SISWA
                .when('/master/siswa', 
                    routeCustome.resolve(
                        'master/siswa/index', 
                        'SiswaController',
                        true
                    )
                )


                .when('/master/siswa/add', 
                    routeCustome.resolve(
                        'master/siswa/form', 
                        'SiswaController',
                        true
                    )
                )

                // MASTER PEGAWAI
                .when('/master/karyawan', 
                    routeCustome.resolve(
                        'master/karyawan/index', 
                        'PegawaiController',
                        true
                    )
                )


                .when('/master/karyawan/add', 
                    routeCustome.resolve(
                        'master/karyawan/form', 
                        'PegawaiController',
                        true
                    )
                )

                // MASTER KELAS
                .when('/master/kelas', 
                    routeCustome.resolve(
                        'master/kelas/index', 
                        'KelasController',
                        true
                    )
                )

                .when('/master/kelas/edit/:id', 
                    routeCustome.resolve(
                        'master/kelas/form', 
                        'KelasController',
                        true
                    )
                )


                .when('/master/kelas/add', 
                    routeCustome.resolve(
                        'master/kelas/form', 
                        'KelasController',
                        true
                    )
                )
        
                // KEUANGAN
                // Info Tagihan
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

                // Kwitansi Pembayaran
                .when('/keuangan/kwitansi-pembayaran', 
                    routeCustome.resolve(
                        'keuangan/kwitansi-pembayaran/index', 
                        'KwitansiPemabayaranController',
                        true
                    )
                )

                // Kwitansi Pembayaran
                .when('/keuangan/kwitansi-pembayaran/add', 
                    routeCustome.resolve(
                        'keuangan/kwitansi-pembayaran/add', 
                        'KwitansiPemabayaranController',
                        true
                    )
                )
                .when('/keuangan/kwitansi-pembayaran/edit/:id', 
                    routeCustome.resolve(
                        'keuangan/kwitansi-pembayaran/add', 
                        'KwitansiPemabayaranController',
                        true
                    )
                )
                .when('/keuangan/rekap-pembayaran-tagihan', 
                    routeCustome.resolve(
                        'keuangan/rekap-tagihan/index', 
                        'RekapTagihanController',
                        true
                    )
                )
                .when('/keuangan/rekap-outstanding-tagihan', 
                    routeCustome.resolve(
                        'keuangan/rekap-outstanding-tagihan/index', 
                        'RekapOutstandingTagihanController',
                        true
                    )
                )
                .when('/keuangan/rekonsiliasi-autodebet', 
                    routeCustome.resolve(
                        'keuangan/rekonsiliasi-autodebet/index', 
                        'TagihanAutodebetController',
                        true
                    )
                )
                .when('/keuangan/rekonsiliasi-autodebet/add', 
                    routeCustome.resolve(
                        'keuangan/rekonsiliasi-autodebet/add', 
                        'TagihanAutodebetController',
                        true
                    )
                )
                .when('/keuangan/rekonsiliasi-autodebet/edit/:id', 
                    routeCustome.resolve(
                        'keuangan/rekonsiliasi-autodebet/add', 
                        'TagihanAutodebetController',
                        true
                    )
                )
                
                .when('/keuangan/kwitansi-pengeluaran/add', 
                    routeCustome.resolve(
                        'keuangan/kwitansi-pengeluaran/add', 
                        'KwitansiPengeluaranController',
                        true
                    )
                )
                .when('/keuangan/kwitansi-pengeluaran/edit/:id', 
                    routeCustome.resolve(
                        'keuangan/kwitansi-pengeluaran/add', 
                        'KwitansiPengeluaranController',
                        true
                    )
                )
                .when('/keuangan/kwitansi-pengeluaran', 
                    routeCustome.resolve(
                        'keuangan/kwitansi-pengeluaran/index', 
                        'KwitansiPengeluaranController',
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

                .when('/akuntansi/jurnal-harian/add', 
                    routeCustome.resolve(
                        'akuntansi/jurnal-harian/add', 
                        'JurnalHarianController',
                        true
                    )
                )
                .when('/akuntansi/jurnal-harian/edit/:id', 
                    routeCustome.resolve(
                        'akuntansi/jurnal-harian/add', 
                        'JurnalHarianController',
                        true
                    )
                )
                .when('/akuntansi/jurnal-harian', 
                    routeCustome.resolve(
                        'akuntansi/jurnal-harian/index', 
                        'JurnalHarianController',
                        true
                    )
                )


                //Pengaturan
                .when('/pengaturan/grup-akses/add', 
                    routeCustome.resolve(
                        'pengaturan/grup-akses/add', 
                        'GrupAksesController',
                        true
                    )
                )
                .when('/pengaturan/grup-akses/edit/:id', 
                    routeCustome.resolve(
                        'pengaturan/grup-akses/add', 
                        'GrupAksesController',
                        true
                    )
                )
                .when('/pengaturan/grup-akses', 
                    routeCustome.resolve(
                        'pengaturan/grup-akses/index', 
                        'GrupAksesController',
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
            $httpProvider.defaults.headers.common['access-token'] = null;
            $httpProvider.defaults.headers.common['X-CSRF-TOKEN'] = $('meta[name="csrf-token"]').attr('content');

            $httpProvider.interceptors.push(function ($q, $rootScope) {
                if ($rootScope.activeCalls == undefined) {
                    $rootScope.activeCalls = 0;
                }

                return {
                    request: function (config) {
                        // console.log(config);
                        config.headers['access-token'] = sessionStorage.getItem('accessToken');
                        return config;
                    },
                    requestError: function (rejection) {
                        // $rootScope.activeCalls -= 1;
                        return rejection;
                    },
                    response: function (response) {
                        // $rootScope.activeCalls -= 1;
                        return response;
                    },
                    responseError: function (rejection) {
                        // $rootScope.activeCalls -= 1;
                        return rejection;
                    }
                };
            });
        }
    ]);
    
    app.run(['$rootScope', '$location','authService','$templateCache','cfpLoadingBar',
        function ($rootScope, $location, authService, $templateCache, cfpLoadingBar) {
            
            //Client-side security. Server-side framework MUST add it's 
            //own security as well since client-based security is easily hacked
            $rootScope.$on("$routeChangeStart", function (event, next, current) {
                cfpLoadingBar.start();
                $rootScope.fakeIntro = true;
                if (next && next.$$route && next.$$route.secure) {
                    var isLogin = (sessionStorage.getItem('isAuthValid') == 'true') ? true : false;
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





