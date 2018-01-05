'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'];

    var kwitansiPengeluaranService = function ($http, $q) {
        var serviceBase = BASEAPIURL,
            factory = {};

        factory.get = function (paramdata) {
            // return getResource('kwitansipengeluarans', pageIndex, pageSize);
            return $http.get(serviceBase + 'kwitansipengeluarans',{
                params : paramdata
            }).then(function (results) {
                return (results.data) ? results.data : null;
            });

        };

        factory.getNewNoKwitansi = function (paramdata) {
            return $http.get(serviceBase + 'kwitansipengeluarans/newnokwitansi',{
                params : paramdata
            }).then(function (results) {
                return results.data;
            });
        };

        factory.insert = function (params) {
            return $http.post(serviceBase + 'kwitansipengeluarans', params).then(function (results) {
                return results.data;
            });
        };

        factory.new = function () {
            return $q.when({ id: 0 });
        };

        factory.update = function (params) {
            return $http.put(serviceBase + 'kwitansipengeluarans/' + params.form.no_kwitansi, params)
            .then(function (results) {
                return results.data;
            });
        };

        factory.delete = function (id) {
            return $http.delete(serviceBase + 'kwitansipengeluarans/' + id).then(function (status) {
                return status.data;
            });
        };

        factory.getById = function (id) {
            return $http.get(serviceBase + 'kwitansipengeluarans/' + id).then(function (results) {
                return results.data;
            });
        };

        factory.getDetail = function (paramdata) {
            return $http.get(serviceBase + 'kwitansipengeluarans/findbyno',{
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

    kwitansiPengeluaranService.$inject = injectParams;

    app.factory('kwitansiPengeluaranService', kwitansiPengeluaranService);

});