


'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'];

    var SekolahService = function ($http, $q) {
        var serviceBase = BASEAPIURL,
            factory = {};

        factory.get = function (pageIndex, pageSize) {
            return getResource('sekolahs', pageIndex, pageSize);
        };

        factory.getList = function() {
            return $http.get(serviceBase + 'sekolahs/list').then(function (results) {
                return results.data;
            });
        };

        factory.insert = function (params) {
            return $http.post(serviceBase + 'sekolahs', params).then(function (results) {
                return results.data;
            });
        };

        factory.update = function (params) {
            return $http.put(serviceBase + 'sekolahs/1', params).then(function (status) {
                return status.data;
            });
        };

        factory.delete = function (id) {
            return $http.delete(serviceBase + 'sekolahs/' + id).then(function (status) {
                return status.data;
            });
        };

        factory.getById = function (id) {
            return $http.get(serviceBase + 'sekolahs/' + id).then(function (results) {
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

    SekolahService.$inject = injectParams;

    app.factory('SekolahService', SekolahService);

});