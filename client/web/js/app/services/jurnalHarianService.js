'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'];

    var jurnalHarianService = function ($http, $q) {
        var serviceBase = BASEAPIURL,
            factory = {};

        factory.get = function (pageIndex, pageSize) {
            return getResource('jurnalharians', pageIndex, pageSize);
        };

        factory.getNewNoKwitansi = function (paramdata) {
            return $http.get(serviceBase + 'jurnalharian/newnotransaksi',{
                params : paramdata
            }).then(function (results) {
                return results.data;
            });
        };

        factory.insert = function (params) {
            return $http.post(serviceBase + 'jurnalharians', params).then(function (results) {
                return results.data;
            });
        };

        factory.new = function () {
            return $q.when({ id: 0 });
        };

        factory.update = function (params) {
            return $http.put(serviceBase + 'jurnalharians/' + params.form.tjmhno, params).then(function (status) {
                return status.data;
            });
        };

        factory.delete = function (id) {
            return $http.delete(serviceBase + 'jurnalharian/delete/' + id).then(function (status) {
                return status.data;
            });
        };

        factory.getById = function (id) {
            return $http.get(serviceBase + 'jurnalharians/' + id).then(function (results) {
                return results.data;
            });
        };

        factory.getDetail = function (paramdata) {
            return $http.get(serviceBase + 'jurnalharian/findbyno',{
                params : paramdata
            }).then(function (results) {
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

    jurnalHarianService.$inject = injectParams;

    app.factory('jurnalHarianService', jurnalHarianService);

});