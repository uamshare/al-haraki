'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'];

    var UserService = function ($http, $q) {
        var serviceBase = BASEAPIURL,
            factory = {};

        factory.get = function (pageIndex, pageSize) {
            return getResource('users', pageIndex, pageSize);
        };

        factory.insert = function (params) {
            return $http.post(serviceBase + 'users', params).then(function (results) {
                return results.data;
            });
        };

        factory.new = function () {
            return $q.when({ id: 0 });
        };

        factory.update = function (params) {
            return $http.put(serviceBase + 'users/' + params.id, params).then(function (status) {
                return status.data;
            });
        };

        factory.delete = function (id) {
            return $http.delete(serviceBase + 'users/' + id).then(function (status) {
                return status.data;
            });
        };

        factory.getById = function (id) {
            return $http.get(serviceBase + 'users/' + id).then(function (results) {
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

    UserService.$inject = injectParams;

    app.factory('UserService', UserService);

});