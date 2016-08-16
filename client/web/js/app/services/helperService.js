'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$rootScope'];

    var helperService = function ($http, $rootScope) {
        var serviceBase = BASEAPIURL,
            factory = {
                loginPath: 'auth/login',
                user: {
                    isAuthenticated: false,
                    roles: null
                }
            };
        // factory.month = {
        //     options: [
        //         {id: 1, name: 'Januari'},
        //         {id: 2, name: 'Februari'},
        //         {id: 3, name: 'Maret'},
        //         {id: 4, name: 'April'},
        //         {id: 5, name: 'Mei'},
        //         {id: 6, name: 'Juni'},
        //         {id: 7, name: 'Juli'},
        //         {id: 8, name: 'Agustus'},
        //         {id: 9, name: 'September'},
        //         {id: 10, name: 'Oktober'},
        //         {id: 11, name: 'November'},
        //         {id: 12, name: 'Desember'}
        //     ],
        //     selected: null,
        //     year : null
        // };

        factory.month = function(){
            return {
                options: [
                    {id: 1, name: 'Januari'},
                    {id: 2, name: 'Februari'},
                    {id: 3, name: 'Maret'},
                    {id: 4, name: 'April'},
                    {id: 5, name: 'Mei'},
                    {id: 6, name: 'Juni'},
                    {id: 7, name: 'Juli'},
                    {id: 8, name: 'Agustus'},
                    {id: 9, name: 'September'},
                    {id: 10, name: 'Oktober'},
                    {id: 11, name: 'November'},
                    {id: 12, name: 'Desember'}
                ],
                selected: null,
                year : null
            }
        }

        factory.getMonthName = function(id){
            return factory.month().options[id].name
        }
        factory.getMonthId = function(id){
            return factory.month().options[id].id
        }

        return factory;
    };

    helperService.$inject = injectParams;

    app.factory('helperService', helperService);

});
