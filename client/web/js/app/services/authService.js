'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$rootScope'];

    var authFactory = function ($http, $rootScope) {
        var serviceBase = BASEAPIURL,
            factory = {
                loginPath: 'auths/login',
                user: {
                    isAuthenticated: false,
                    roles: null
                }
            };

        factory.profil;

        factory.login = function (usernameOrEmail, passwd) {
            return $http.post(serviceBase + 'auths/login', {
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
            return $http.post(serviceBase + 'auths/logout').then(
                function (results) {
                    var loggedIn = !results.data.success;
                    changeAuth(loggedIn);
                    return loggedIn;
                });
        };

        factory.getProfile = function(paramdata) {
            return JSON.parse(sessionStorage.getItem('user_profil'));
        };

        factory.getSekolahProfile = function(paramdata) {
            return JSON.parse(sessionStorage.getItem('sekolah_profile'));
        };

        factory.redirectToLogin = function () {
            $rootScope.$broadcast('redirectToLogin', null);
        };

        function changeAuth(loggedIn, data) {
            factory.user.isAuthenticated = loggedIn;
            // localStorage.setItem('isAuthValid', loggedIn);
            if(loggedIn){
                sessionStorage.setItem('isAuthValid', loggedIn);
                if(typeof data != 'undefined'){
                    sessionStorage.setItem('accessToken', data.__accessToken);
                    sessionStorage.setItem('user_profil', JSON.stringify(data.__user_profile));
                    sessionStorage.setItem('sekolah_profile', JSON.stringify(data.__sekolah_profile));
                    $rootScope.$broadcast('loginStatusChanged', loggedIn);
                }
            }else{
                sessionStorage.clear();
            }
            $rootScope.$broadcast('loginStatusChanged', loggedIn);
        }

        return factory;
    };

    authFactory.$inject = injectParams;

    app.factory('authService', authFactory);

});
