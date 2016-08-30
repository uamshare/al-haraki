'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'];

    var TagihanInfoService = function ($http, $q) {
        var serviceBase = BASEAPIURL,
            factory = {};

        factory.get = function (pageIndex, pageSize) {
            return getResource('tagihaninfoinputs', pageIndex, pageSize);
        };

        /**
         * Get list Outstanding
         *
         */
        factory.getList = function(paramdata) {
            return $http.get(serviceBase + 'tagihaninfoinputs/list',{
                params : paramdata
            }).then(function (results) {
                return results.data;
            });
        };

        /**
         * Get list Pembayaran
         *
         */
        factory.getListPembayaran = function(paramdata) {
            return $http.get(serviceBase + 'tagihanpembayarans/listbayar',{
                params : paramdata
            }).then(function (results) {
                return results.data;
            });
        };

        /**
         * Get list Pembayaran
         *
         */
        factory.getSummaryOuts = function(paramdata) {
            return $http.get(serviceBase + 'tagihanpembayarans/summaryouts',{
                params : paramdata
            }).then(function (results) {
                return results.data;
            });
        };

        factory.getListActive = function(paramdata) {
            return $http.get(serviceBase + 'tagihaninfoinputs/listinfo',{
                params : paramdata
            }).then(function (results) {
                return results.data;
            });
        };

        factory.insert = function (params) {
            return $http.post(serviceBase + 'tagihaninfoinputs', params).then(function (results) {
                return results.data;
            });
        };

        factory.new = function () {
            return $q.when({ id: 0 });
        };

        // factory.update = function (params) {
        //     return $http.put(serviceBase + 'siswarombels/' + params.id, params).then(function (status) {
        //         return status.data;
        //     });
        // };

        // factory.delete = function (id) {
        //     return $http.delete(serviceBase + 'siswarombels/' + id).then(function (status) {
        //         return status.data;
        //     });
        // };

        factory.getById = function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'tagihaninfoinputs/' + id).then(function (results) {
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

    TagihanInfoService.$inject = injectParams;

    app.factory('TagihanInfoService', TagihanInfoService);

});