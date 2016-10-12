'use strict';

define(['services/routeResolver'], function () {

    var app = angular.module('alHaraki',
        [
            'ngTouch',
            'ngRoute',
            'ngAnimate',
            'ngCookies',
            'toastr',
            'routeResolverServices',
            // 'service',
            // 'ui.bootstrap',
            'mgcrea.ngStrap',
            'ui.grid',
            'ui.grid.pagination',
            'ui.grid.resizeColumns',
            'ui.grid.exporter',
            'ui.grid.edit',
            'ui.grid.cellNav',
            'ui.grid.grouping',
            'ui.grid.expandable',
            'ui.grid.selection',
            'ui.grid.pinning',
            'chieffancypants.loadingBar',
            'ngDialog',
            'blueimp.fileupload',
            'ngWYSIWYG'
            // 'chart.js'
        ]
    );

    app.constant('$CONST_VAR', {
        viewsDirectory : 'js/app/views/',
        restDirectory : BASEAPIURL,
        pageSize : 20,
        cookieskey : 'apps-juToIBSCKeHHxeWuKmfZOhUcU2U4Mh3j'
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
        '$CONST_VAR',
        // 'authService',
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
            $datepickerProvider,
            $CONST_VAR
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

                .when('/logs/:id',
                    routeCustome.resolve(
                        'logs/index',
                        'LogsController',
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
                .when('/master/siswa/edit/:id',
                    routeCustome.resolve(
                        'master/siswa/form',
                        'SiswaController',
                        true
                    )
                )
                .when('/master/siswa/view/:id',
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

                .when('/master/karyawan/edit/:id',
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

                .when('/master/rombel/kelola',
                    routeCustome.resolve(
                        'master/rombel/edit',
                        'RombelController',
                        true
                    )
                )

                // KEUANGAN
                // dashboard
                .when('/keuangan/dashboard',
                    routeCustome.resolve(
                        'main/dashboard',
                        'MainController',
                        true
                    )
                )
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
                .when('/akuntansi/coa/edit/:id',
                    routeCustome.resolve(
                        'akuntansi/coa/add',
                        'CoaController',
                        true
                    )
                )
                .when('/akuntansi/coa/add',
                    routeCustome.resolve(
                        'akuntansi/coa/add',
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
                .when('/akuntansi/rgl/detail/:id',
                    routeCustome.resolve(
                        'akuntansi/rgl/detail',
                        'RglController',
                        true
                    )
                )
                .when('/akuntansi/rgl',
                    routeCustome.resolve(
                        'akuntansi/rgl/index',
                        'RglController',
                        true
                    )
                )

                .when('/akuntansi/cashflow',
                    routeCustome.resolve(
                        'akuntansi/cashflow/index',
                        'CashflowController',
                        true
                    )
                )


                //Pengaturan
                .when('/pengaturan/user/add',
                    routeCustome.resolve(
                        'pengaturan/user/add',
                        'UserController',
                        true
                    )
                )
                .when('/pengaturan/user/edit/:id',
                    routeCustome.resolve(
                        'pengaturan/user/add',
                        'UserController',
                        true
                    )
                )
                .when('/profile',
                    routeCustome.resolve(
                        'pengaturan/user/profil',
                        'UserController',
                        true
                    )
                )

                .when('/pengaturan/user',
                    routeCustome.resolve(
                        'pengaturan/user/index',
                        'UserController',
                        true
                    )
                )

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
                .when('/pengaturan/sekolah',
                    routeCustome.resolve(
                        'pengaturan/sekolah/index',
                        'SekolahController',
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
                .when('/403',
                    routeCustome.resolve(
                        '403'
                    )
                )
                .otherwise({redirectTo: '/404'})

            $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
            $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
            $httpProvider.defaults.headers.common['access-token'] = null;
            $httpProvider.defaults.headers.common['X-CSRF-TOKEN'] = $('meta[name="csrf-token"]').attr('content');

            $httpProvider.interceptors.push(function ($q, $rootScope, $location, $cookieStore, $CONST_VAR) {
                if ($rootScope.activeCalls == undefined) {
                    $rootScope.activeCalls = 0;
                }


                return {
                    request: function (config) {
                        var _key = $CONST_VAR.cookieskey,
                        sessions = (typeof $cookieStore.get(_key) != 'undefined' && $cookieStore.get(_key) !='') ? $cookieStore.get(_key) : false;
                        sessions = (sessions && sessions != '') ? JSON.parse(sessions) : '';

                        config.headers['access-token'] = sessions['__access_token__'];
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
                        switch(rejection.status){
                            case 403 :
                                $location.path( "/403");
                                break;
                            // default :
                            //     $location.path( "/404");
                            //     break;
                        }
                        console.log(rejection);
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
                    // var isLogin = (sessionStorage.getItem('isAuthValid') == 'true') ? true : false;
                    var session = new authService.session();
                    // console.log(session.get('isAuthValid'));
                    var loggedIn = (session.get('isAuthValid') == true) ? true : false;
                    if (!loggedIn) {
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
