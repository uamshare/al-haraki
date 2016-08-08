'use strict';



define(['app'], function (app) {

    // var injectParams = ['$scope', '$location', '$routeParams'];

    // var CoaController = function ($scope, $location, $routeParams) {
    // 	console.log('tesss');
    // };

    // CoaController.$inject = injectParams;
    app.register.controller('MainController', function ($scope, $location, $routeParams) {
    	console.log('MainController');
    });

 //    app.controller('PegawaiController', function ($scope, $location, $routeParams) {
	// 	console.log('PegawaiController');
	// });
});