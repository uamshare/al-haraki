'use strict';

define(['app'], function (app) {

    var injectParams = ['$scope','$location', '$routeParams', 'authService','toastr'];

    var LoginController = function ($scope, $location, $routeParams, authService, toastr) {
        var vm = this,
            path = '/';

        $scope.username = null;
        $scope.password = null;
        $scope.errorMessage = null;

        $scope.login = function () {
            authService.login($scope.username, $scope.password)
            .then(function (status) {
                if (!status) {
                    $scope.errorMessage = 'Unable to login';
                    toastr.error($scope.errorMessage, 'Error');
                    return;
                }

                if (status && $routeParams && $routeParams.redirect) {
                    path = path + $routeParams.redirect;
                }

                $location.path(path);
            }, function(error){
                $scope.errorMessage = 'Unable to login';
                toastr.error($scope.errorMessage, 'Error');
                // toastr.warning('Untuk demo masukan lgin berikut. Username : demo, Password : demo123', 'Warning');
            });
        };
    };

    LoginController.$inject = injectParams;

    app.register.controller('LoginController', LoginController);

});