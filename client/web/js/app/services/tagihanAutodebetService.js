'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'];

    var tagihanAutodebetService = function ($http, $q) {
        var serviceBase = BASEAPIURL,
            factory = {};

        factory.get = function (paramdata) {
            return $http.get(serviceBase + 'tagihanautodebets',{
                params : paramdata
            }).then(function (results) {
                return (results.data) ? results.data : null;
            });

        };

        factory.getNewNoTransaksi = function (paramdata) {
            return $http.get(serviceBase + 'tagihanautodebets/newnotransaksi',{
                params : paramdata
            }).then(function (results) {
                return results.data;
            });
        };

        factory.insert = function (params) {
            return $http.post(serviceBase + 'tagihanautodebets', params).then(function (results) {
                return results.data;
            });
        };

        factory.new = function () {
            return $q.when({ id: 0 });
        };

        factory.update = function (params) {
            return $http.put(serviceBase + 'tagihanautodebets/' + params.id, params).then(function (status) {
                return status.data;
            });
        };

        factory.delete = function (id) {
            return $http.delete(serviceBase + 'tagihanautodebets/' + id).then(function (status) {
                return status.data;
            });
        };

        factory.getById = function (id) {
            //then does not unwrap data so must go through .data property
            //success unwraps data automatically (no need to call .data property)
            return $http.get(serviceBase + 'tagihanautodebets/' + id).then(function (results) {
                // extendData([results.data]);
                return results.data;
            });
        };

        factory.getDetail = function (paramdata) {
            return $http.get(serviceBase + 'tagihanautodebets/findbyno',{
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
                return (response.data) ? response.data : null;
            });
        }

        function buildPagingUri(pageIndex, pageSize) {
            var uri = '?page=' + pageIndex + '&per-page=' + pageSize;
            return uri;
        }

        return factory;
    };

    tagihanAutodebetService.$inject = injectParams;

    app.factory('tagihanAutodebetService', tagihanAutodebetService);

});