'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'];

    var kwitansiPemabayaranService = function ($http, $q) {
        var serviceBase = BASEAPIURL,
            factory = {};

        factory.get = function (paramdata) {
            // return getResource('kwitansipembayarans', pageIndex, pageSize);
            return $http.get(serviceBase + 'kwitansipembayarans',{
                params : paramdata
            }).then(function (results) {
                return (results.data) ? results.data : null;
            });
        };

        factory.getNewNoKwitansi = function (paramdata) {
            return $http.get(serviceBase + 'kwitansipembayaran/newnokwitansi',{
                params : paramdata
            }).then(function (results) {
                return results.data;
            });
        };

        factory.insert = function (params) {
            return $http.post(serviceBase + 'kwitansipembayarans', params).then(function (results) {
                return results.data;
            });
        };

        factory.new = function () {
            return $q.when({ id: 0 });
        };

        factory.update = function (params) {
            // return $http.put(serviceBase + 'kwitansipembayarans/' + params.id, params).then(function (status) {
            //     return status.data;
            // });
            return $http.put(serviceBase + 'kwitansipembayarans/' + params.form.no_kwitansi, params).then(function (results) {
                return results.data;
            });
        };

        factory.delete = function (id) {
            return $http.delete(serviceBase + 'kwitansipembayarans/' + id).then(function (status) {
                return status.data;
            });
        };

        factory.getById = function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'kwitansipembayarans/' + id).then(function (results) {
                // extendData([results.data]);
                return results.data;
            });
        };

        factory.getDetail = function (paramdata) {
            return $http.get(serviceBase + 'kwitansipembayaran/findbyno',{
                params : paramdata
            }).then(function (results) {
                return results.data;
            });
        };

        function extendData(RestData) {
            var custsLen = RestData.length;
            //Iterate through KwitansiPemabayaran
            for (var i = 0; i < custsLen; i++) {
                var data = RestData[i];
                if (!data.orders) continue;

                var ordersLen = data.orders.length;
                for (var j = 0; j < ordersLen; j++) {
                    var order = data.orders[j];
                    order.orderTotal = order.quantity * order.price;
                }
                // data.ordersTotal = ordersTotal(data);
            }
        }

        function getResource(baseResource, pageIndex, pageSize) {
            var resource = baseResource;
            resource += (arguments.length == 3) ? buildPagingUri(pageIndex, pageSize) : '';
            return $http.get(serviceBase + resource).then(function (response) {
                // var custs = response.data;
                // extendData(custs);
                // return {
                //     totalRecords: parseInt(response.headers('X-InlineCount')),
                //     results: custs
                // };
                return (response.data) ? response.data : null;
            });
        }

        function buildPagingUri(pageIndex, pageSize) {
            var uri = '?page=' + pageIndex + '&per-page=' + pageSize;
            return uri;
        }

        return factory;
    };

    kwitansiPemabayaranService.$inject = injectParams;

    app.factory('kwitansiPemabayaranService', kwitansiPemabayaranService);

});