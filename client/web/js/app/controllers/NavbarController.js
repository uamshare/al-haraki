'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope', '$location', 'authService'];

    var NavbarController = function ($scope, $location,  authService) {
        var appTitle = 'Al Harakai';

        $scope.isCollapsed = false;
        $scope.appTitle = appTitle ;

        $scope.highlight = function (path) {
            return $location.path().substr(0, path.length) === path;
        };

        $scope.loginOrOut = function () {
            // setLoginLogoutText();
            var isAuthenticated = sessionStorage.getItem('isAuthValid'); //authService.user.isAuthenticated;
            if (isAuthenticated) { //logout 
                authService.logout().then(function () {
                    // $location.path('/#');
                    // return true;
                    redirectToLogin();
                });
                // $location.path('/');
                // redirectToLogin();
            }
        };

        function redirectToLogin() {
            var lp = ($location.$$path != '/login') ? $location.$$path : '/';
            var path = '/login'; // + lp;
            $location.replace();
            $location.path(path);
        }

        $scope.$on('loginStatusChanged', function (loggedIn) {
            setLoginLogoutText(loggedIn);
        });

        $scope.$on('redirectToLogin', function () {
            redirectToLogin();
        });

        function setLoginLogoutText() {
            $scope.loginLogoutText = (authService.user.isAuthenticated) ? 'Logout' : 'Login';
        }

        setLoginLogoutText();

    };

    NavbarController.$inject = injectParams;


    //Loaded normally since the script is loaded upfront 
    //Dynamically loaded controller use app.register.controller
    app.controller('NavbarController', NavbarController);

});