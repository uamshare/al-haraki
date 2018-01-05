'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$q'];

    var RglService = function ($http, $q) {
        var serviceBase = BASEAPIURL,
            factory = {};


        factory.getList = function(paramdata) {
            return $http.get(serviceBase + 'rgls/list',{
                params : paramdata
            }).then(function (results) {
                return results.data;
            });
        };

        factory.getById = function (paramdata) {
            return $http.get(serviceBase + 'rgls/' + paramdata.id,{
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

    RglService.$inject = injectParams;

    app.factory('RglService', RglService);

});