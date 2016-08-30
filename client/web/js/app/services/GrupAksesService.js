'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'];

    var GrupAksesService = function ($http, $q) {
        var serviceBase = BASEAPIURL,
            factory = {};

        factory.getRoles = function(paramdata) {
            return $http.get(serviceBase + 'roles/list',{
                params : paramdata
            }).then(function (results) {
                return results.data;
            });
        };

        factory.getPermission = function(paramdata) {
            return $http.get(serviceBase + 'roles/listpermissions',{
                params : paramdata
            }).then(function (results) {
                return results.data;
            });
        };

        factory.getMenuPrivileges = function(paramdata) {
            return $http.get(serviceBase + 'roles/menuprivileges',{
                params : paramdata
            }).then(function (results) {
                return results.data;
            });
        };

        factory.assign = function (params) {
            return $http.post(serviceBase + 'roles/assign', params).then(function (results) {
                return results.data;
            });
        };

        factory.AddPermission = function (params) {
            return $http.post(serviceBase + 'roles', params).then(function (results) {
                return results.data;
            });
        };

        function getResource(baseResource, pageIndex, pageSize) {
            var resource = baseResource;
            resource += (arguments.length == 3) ? buildPagingUri(pageIndex, pageSize) : '';
            return $http.get(serviceBase + resource).then(function (response) {
                return (response.data) ? response.data : null;
            });
        }

        function buildPagingUri(pageIndex, pageSize) {
            var uri = '?page=' + pageIndex + '&per-page=' + pageSize;
            return uri;
        }

        return factory;
    };

    GrupAksesService.$inject = injectParams;

    app.factory('GrupAksesService', GrupAksesService);

});