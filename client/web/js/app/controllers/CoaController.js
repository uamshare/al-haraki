'use strict';

define(['app'], function (app) {

    app.register.controller('CoaController', function ($CONST_VAR,$scope, $location, $routeParams, $http, $log, $timeout, uiGridConstants) {
    	// console.log('CoaController');

    	$scope.modelTest = 'Test Aja';
    	$scope.onBtnHistoryClick = function (event) {
    		console.log(event);
    	}
		$scope.coad = { 
			paginationPageSizes: [20, 30, 50, 100, 200],
    		paginationPageSize: $CONST_VAR.pageSize,
    		pageNumber : 1,
    		enableMinHeightCheck : true,
			minRowsToShow : $CONST_VAR.pageSize,
			enableGridMenu: true,
			enableSelectAll: true,
			virtualizationThreshold: $CONST_VAR.pageSize,
			enableFiltering: true,
			
			//Export
			exporterCsvFilename: 'coa.csv',
		    exporterPdfDefaultStyle: {
		    	fontSize: 9
		   	},
		    exporterPdfTableStyle: {
		    	margin: [5, 5, 5, 5]
		    },
		    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: '#000'},
		    exporterPdfHeader: { 
		    	text: "My Header", 
		    	style: 'headerStyle' 
		   	},
		    exporterPdfFooter: function ( currentPage, pageCount ) {
		      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
		    },
		    exporterPdfCustomFormatter: function ( docDefinition ) {
		      docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
		      docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
		      return docDefinition;
		    },
		    exporterPdfOrientation: 'portrait',
		    exporterPdfPageSize: 'LETTER',
		    exporterPdfMaxGridWidth: 500,
		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
		    onRegisterApi: function(gridApi){
		      $scope.gridApi = gridApi;
		    }
		};

		$scope.coad.columnDefs  = [
			{ name: 'index', displayName : 'No', width : '50' },
			{ name: 'mcoadno', displayName: 'No Akun', width : '100' },
			{ name: 'mcoadname', displayName: 'Nama Akun'},
			{ name: 'mcoahno', displayName: 'Akun Master', width : '100'},
			{ name: 'mcoahname', displayName: 'Nama Akun Master'},
			{ name: 'mcoaclassification', displayName: 'Klasifikasi', width : '150'},
			{ name: 'mcoagroup', displayName: 'Grup', width : '150'}
		];

		$scope.getPage = function(curpage, perpage){
			$http.get('http://local.project/al-haraki/rest/web/api/mcoads',{
				params : {
					page : curpage,
					'per-page' : perpage
				}
			})
			.success(function(data, status, header) {
				var header = header();
				if(data.success){
					angular.forEach(data.rows, function(dt, index) {
						var romnum = (curpage > 1) ? (((curpage - 1) * $scope.coad.pageSize) + index + 1) : (index + 1);
		                data.rows[index]["index"] = romnum;
		            })
					$scope.coad.data = data.rows;
					$scope.coad.totalItems = data.total;
					$scope.coad.useExternalPagination = true;
					$scope.coad.paginationCurrentPage = curpage;
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
			    $scope.coad.virtualizationThreshold = pageSize; 

			    $scope.getPage(newPage, $scope.coad.virtualizationThreshold);
			});
		}

		$scope.getPage($scope.coad.pageNumber);
    });

});