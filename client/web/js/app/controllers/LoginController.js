'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope','$location', '$routeParams', 'authService'];

    var LoginController = function ($scope, $location, $routeParams, authService) {
        var vm = this,
            path = '/';

        $scope.username = null;
        $scope.password = null;
        $scope.errorMessage = null;

        $scope.login = function () {
            authService.login($scope.username, $scope.password).then(function (status) {
                //$routeParams.redirect will have the route
                //they were trying to go to initially
                if (!status) {
                    $scope.errorMessage = 'Unable to login';
                    return;
                }

                if (status && $routeParams && $routeParams.redirect) {
                    path = path + $routeParams.redirect;
                }

                $location.path(path);
            });
        };
    };

    LoginController.$inject = injectParams;

    app.register.controller('LoginController', LoginController);

});