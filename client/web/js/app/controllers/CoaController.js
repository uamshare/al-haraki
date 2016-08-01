'use strict';

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
    		enableMinHeightCheck : true,
			minRowsToShow : 20,
			columnDefs  : [
				{ name: 'index', displayName : 'No', width : '50' },
				{ name: 'mcoadno', displayName: 'No Akun', width : '100' },
				{ name: 'mcoadname', displayName: 'Nama Akun'},
				{ name: 'mcoahno', displayName: 'Akun Master', width : '100'},
				{ name: 'mcoahname', displayName: 'Nama Akun Master'},
				{ name: 'mcoaclassification', displayName: 'Klasifikasi', width : '150'},
				{ name: 'mcoagroup', displayName: 'Grup', width : '150'}
			]
		};

		$scope.getPage = function(page){
			$http.get('http://local.project/al-haraki/rest/web/api/mcoads?page=' + page)
			.success(function(data, status, header) {
				var header = header();
				if(data.success){
					angular.forEach(data.rows, function(dt, index) {
						var romnum = (page > 1) ? (((page - 1) * $scope.coad.pageSize) + index + 1) : (index + 1);
		                data.rows[index]["index"] = romnum;
		            })
					$scope.coad.data = data.rows;
					$scope.coad.totalItems = data.total;
					$scope.coad.useExternalPagination = true;
					$scope.coad.paginationCurrentPage = page;
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