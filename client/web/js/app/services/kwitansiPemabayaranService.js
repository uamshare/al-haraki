'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'];

    var kwitansiPemabayaranService = function ($http, $q) {
        var serviceBase = BASEAPIURL,
            factory = {};

        factory.get = function (pageIndex, pageSize) {
            return getResource('kwitansipembayaranhs', pageIndex, pageSize);
        };

        factory.getNewNoKwitansi = function (paramdata) {
            return $http.get(serviceBase + 'kwitansipembayaranh/newnokwitansi',{
                params : paramdata
            }).then(function (results) {
                return results.data;
            });
        };

        factory.insert = function (params) {
            return $http.post(serviceBase + 'kwitansipembayaranh/create', params).then(function (results) {
                return results.data;
            });
        };

        factory.new = function () {
            return $q.when({ id: 0 });
        };

        factory.update = function (params) {
            return $http.put(serviceBase + 'kwitansipembayaranhs/' + params.id, params).then(function (status) {
                return status.data;
            });
        };

        factory.delete = function (id) {
            return $http.delete(serviceBase + 'kwitansipembayaranh/delete/' + id).then(function (status) {
                return status.data;
            });
        };

        factory.getById = function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'kwitansipembayaranhs/' + id).then(function (results) {
                // extendData([results.data]);
                return results.data;
            });
        };

        factory.getDetail = function (paramdata) {
            return $http.get(serviceBase + 'kwitansipembayarand/findbyno',{
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