'use strict';

// app.controller('CoaController', function ($scope, $http, $window, toaster, ngDialog, $injector, $httpParamSerializer) {
//     var $validationProvider = $injector.get('$validation');
//     $http.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

// });

define(['app'], function (app) {

    // var injectParams = ['$scope', '$location', '$routeParams'];

    // var CoaController = function ($scope, $location, $routeParams) {
    // 	console.log('tesss');
    // };

    // CoaController.$inject = injectParams;

	// app.controller('MainCtrl', ['$scope', '$http', '$log', '$timeout', 'uiGridConstants', 
	// 	function ($scope, $http, $log, $timeout, uiGridConstants) {
	// 		$scope.gridOptions = {
	// 		enableRowSelection: true,
	// 		enableSelectAll: true,
	// 		selectionRowHeaderWidth: 35,
	// 		rowHeight: 35,
	// 		showGridFooter:true
	// 		};
	// 	}

    app.register.controller('CoaController', function ($scope, $location, $routeParams, $http, $log, $timeout, uiGridConstants) {
    	// console.log('CoaController');

    	$scope.modelTest = 'Test Aja';
    	$scope.onBtnHistoryClick = function (event) {
    		console.log(event);
    	}
		$scope.coad = { 
			paginationPageSizes: [25, 50, 75],
    		paginationPageSize: 20,
    		pageNumber : 1,
			columnDefs  : [
				// { name: 'id' },
				{ name: 'mcoadno', displayName: 'No Akun' },
				{ name: 'mcoadname', displayName: 'Nama Akun'},
				{ name: 'mcoahno', displayName: 'Akun Msater'}
			]
		};

		$scope.getPage = function(page){
			$http.get('http://local.project/al-haraki/rest/web/api/mcoads?page=' + page)
			.success(function(data, status, header) {
				var header = header();
				if(data.success){
					$scope.coad.data = data.rows;
					$scope.coad.totalItems = data.total,
					// $scope.coad.paginationPageSize = 20,
					// $scope.coad.enablePaginationControls = false,
					$scope.coad.useExternalPagination = true,
					$scope.coad.paginationCurrentPage = page
				}
				
				// $timeout(function() {
				// 	if($scope.gridApi.selection.selectRow){
				// 		$scope.gridApi.selection.selectRow($scope.coad.data[0]);
				// 	}
				// });
			});
		}
		
		$scope.coad.onRegisterApi = function (gridApi) {
			gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
			    $scope.coad.pageNumber = newPage;
			    $scope.coad.pageSize = pageSize;
			    $scope.getPage(newPage);
			});
		}

		$scope.getPage($scope.coad.pageNumber);
		
    });

});