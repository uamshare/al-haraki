'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$rootScope'];

    var authFactory = function ($http, $rootScope) {
        var serviceBase = BASEAPIURL,
            factory = {
                loginPath: 'auth/login',
                user: {
                    isAuthenticated: false,
                    roles: null
                }
            };

        factory.login = function (username, password) {
            return $http.post(serviceBase + 'auth/login', { userLogin: { userName: username, password: password } }).then(
                function (results) {
                    var loggedIn = results.data.success;
                    changeAuth(loggedIn);
                    return loggedIn;
                });
        };

        factory.logout = function () {
            return $http.post(serviceBase + 'auth/logout').then(
                function (results) {
                    var loggedIn = !results.data.status;
                    changeAuth(loggedIn);
                    return loggedIn;
                });
        };

        factory.redirectToLogin = function () {
            $rootScope.$broadcast('redirectToLogin', null);
        };

        function changeAuth(loggedIn) {
            factory.user.isAuthenticated = loggedIn;
            localStorage.setItem('isAuthValid', loggedIn);
            $rootScope.$broadcast('loginStatusChanged', loggedIn);
        }

        return factory;
    };

    authFactory.$inject = injectParams;

    app.factory('authService', authFactory);

});
