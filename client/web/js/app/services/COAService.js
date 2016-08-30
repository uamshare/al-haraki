'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'];

    var COAService = function ($http, $q) {
        var serviceBase = BASEAPIURL,
            factory = {};

        factory.get = function (pageIndex, pageSize) {
            return getResource('mcoads', pageIndex, pageSize);
        };

        factory.getList = function(paramdata) {
            return $http.get(serviceBase + 'mcoads/list',{
                params : paramdata
            }).then(function (results) {
                return results.data;
            });
        };

        factory.insert = function (params) {
            return $http.post(serviceBase + 'mcoads', params).then(function (results) {
                return results.data;
            });
        };

        factory.new = function () {
            return $q.when({ id: 0 });
        };

        factory.update = function (params) {
            return $http.put(serviceBase + 'mcoads/' + params.id, params).then(function (status) {
                return status.data;
            });
        };

        factory.delete = function (id) {
            return $http.delete(serviceBase + 'mcoads/' + id).then(function (status) {
                return status.data;
            });
        };

        factory.getById = function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'mcoads/' + id).then(function (results) {
                // extendData([results.data]);
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

    COAService.$inject = injectParams;

    app.factory('COAService', COAService);

});