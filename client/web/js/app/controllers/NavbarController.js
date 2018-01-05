'use strict';
define(['app'], function(app) {
    var injectParams = ['$scope', '$route', '$location', '$timeout', 'authService', 'GrupAksesService', 'cfpLoadingBar', 'SekolahService'];
    var NavbarController = function($scope, $route, $location, $timeout, authService, GrupAksesService, cfpLoadingBar, SekolahService) {
        var appTitle = 'Al Harakai';
        $scope.isCollapsed = false;
        $scope.appTitle = appTitle;

        function errorHandle(error) {
            var msg = error.data.name;
            toastr.warning(msg, 'Warning');
        }
        $scope.highlight = function(path) {
            return $location.path().substr(0, path.length) === path;
        };
        $scope.loginOrOut = function() {
            var session = new authService.session();
            var isAuthenticated = (session.get('isAuthValid') == true) ? true : false;
            if (isAuthenticated) { //logout 
                authService.logout().then(function() {
                    redirectToLogin();
                });
            }
        };

        function redirectToLogin() {
            var lp = ($location.$$path != '/login') ? $location.$$path : '/';
            var path = '/login'; // + lp;
            $location.replace();
            $location.path(path);
        }

        function getUserProfile() {
            $scope.profile = authService.getProfile();
            $scope.profile.avatar = ($scope.profile.avatar == '') ? BASEURL + 'img/profil/user-default.png' : $scope.profile.avatar;
        }

        function getSekolahProfile() {
            $scope.sekolahProfile = authService.getSekolahProfile();
            $scope.sekolahid_selected = $scope.sekolahProfile.sekolahid;
            $scope.tahunid_selected = authService.getSelectedTahun().id; //$scope.sekolahProfile.tahun_ajaran_id;
        }

        function getSekolahList(callback) {
            $scope.sekolahList = authService.getSekolahList();
            callback();
        }

        function getTahunList(callback) {
            $scope.tahunList = authService.getTahunList();
            callback();
        }

        function initLogin() {
            getMenuPrivileges();
            getUserProfile();
            getSekolahList(function() {
                getTahunList(function() {
                    getSekolahProfile();
                });
            });
        }

        function setLoginLogoutText(loggedIn) {
            $scope.loginLogoutText = (authService.user.isAuthenticated) ? 'Logout' : 'Login';
            var session = new authService.session();
            var loggedIn = (typeof loggedIn != 'undefined') ? loggedIn : session.get('isAuthValid'); // sessionStorage.getItem('isAuthValid')
            if (loggedIn) {
                initLogin();
            }
        }

        function resetMenu() {
            for (var idx in $scope.menuprivileges) {
                $scope.menuprivileges[idx] = false;
            }
        }

        function getMenuPrivileges() {
            resetMenu()
            GrupAksesService.getMenuPrivileges().then(function(result) {
                if (result.success) {
                    for (var idx in result.rows) {
                        if (typeof $scope.menuprivileges[result.rows[idx]] != 'undefined') {
                            $scope.menuprivileges[result.rows[idx]] = true;
                        }
                    }
                }
            }, errorHandle);
        }
        $scope.onSekolahidChange = function(value) {
            if (typeof $scope.sekolahid_selected == 'undefined') return null;
            cfpLoadingBar.start();
            authService.changeSekolahId($scope.sekolahid_selected).then(function(result) {
                if (result != null && result.success) {
                    getSekolahProfile();
                    $route.reload();
                }
                cfpLoadingBar.complete();
            }, errorHandle);
        }
        $scope.onTahunidChange = function(value) {
            authService.setSelectedTahun(value);
            console.log(authService.getSelectedTahun());
            $route.reload();
        }
        $scope.$on('loginStatusChanged', function(brodcastname, loggedIn) {
            setLoginLogoutText(loggedIn);
        });
        $scope.$on('profileChanged', function(brodcastname, value) {
            $scope.profile.avatar = value;
            $route.reload();
        });
        $scope.$on('redirectToLogin', function() {
            redirectToLogin();
        });
        $scope.menuprivileges = {
            master: false,
            siswa: false,
            kelas: false,
            pegawai: false,
            keuangan: false,
            tagihanpembayaran_summaryouts: false,
            tagihaninfoinput: false,
            tagihaninfoinput_list: false,
            tagihaninfoinput_listbayar: false,
            kwitansipembayaran_create: false,
            // tagihanpembayaran : false,
            tagihanpembayaran_listbayar: false,
            kwitansipengeluaran_create: false,
            kwitansipengeluaran: false,
            tagihanautodebet: false,
            akuntansi: false,
            mcoad: false,
            postingmap: false,
            jurnalharian: false,
            rgl: false,
            cashflow: false,
            pengaturan: '',
            user: false,
            role: false,
            sekolah: false
        }
        setLoginLogoutText();
        $scope.$on('$viewContentLoaded', function() {
            // getMenuPrivileges();
            // setLoginLogoutText();
            console.log('viewContentLoaded');
        });
        $timeout(function() {
            // getMenuPrivileges();
            // getSekolahProfile();
            $scope.onSekolahidChange();
        }, 1000);
    };
    NavbarController.$inject = injectParams;
    //Loaded normally since the script is loaded upfront 
    //Dynamically loaded controller use app.register.controller
    app.controller('NavbarController', NavbarController);
});