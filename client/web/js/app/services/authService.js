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

        factory.profil;

        factory.login = function (usernameOrEmail, passwd) {
            return $http.post(serviceBase + 'auth/login', {
                    username : usernameOrEmail,
                    password : passwd 
                }).then(
                function (results) {
                    var loggedIn = results.data.success;
                    changeAuth(loggedIn, results.data.rows);
                    factory.profil = results.data.rows;
                    return loggedIn;
                }
            );
        };

        factory.logout = function () {
            return $http.post(serviceBase + 'auth/logout').then(
                function (results) {
                    var loggedIn = !results.data.success;
                    changeAuth(loggedIn);
                    return loggedIn;
                });
        };

        factory.getProfile = function(paramdata) {
            // return $http.get(serviceBase + 'auth/profile',{
            //     params : paramdata
            // }).then(function (results) {
            //     return results.data;
            // });
            return JSON.parse(sessionStorage.getItem('user_profil'));
        };

        factory.redirectToLogin = function () {
            $rootScope.$broadcast('redirectToLogin', null);
        };

        function changeAuth(loggedIn, data) {
            factory.user.isAuthenticated = loggedIn;
            // localStorage.setItem('isAuthValid', loggedIn);
            sessionStorage.setItem('isAuthValid', loggedIn);
            if(typeof data != 'undefined'){
                sessionStorage.setItem('accessToken', data.__accessToken);
                sessionStorage.setItem('user_profil', JSON.stringify(data.__user_profile));
                $rootScope.$broadcast('loginStatusChanged', loggedIn);
            }
        }

        return factory;
    };

    authFactory.$inject = injectParams;

    app.factory('authService', authFactory);

});
