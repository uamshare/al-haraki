'use strict';
define(['app'], function (app) {

    var injectParams = [
			'$CONST_VAR',
	        'helperService',
	        '$scope',
	        '$filter',
	        'toastr',
	        '$location', 
	        '$routeParams', 
	        '$http', 
	        '$log', 
	        'cfpLoadingBar',
	        '$timeout',
	        'authService',
    		'SekolahService',
    		'TahunAjaranService'
    	];

    var SekolahController = function (
    		$CONST_VAR,
	        helperService,
	        $scope,
	        $filter,
	        toastr,
	        $location, 
	        $routeParams, 
	        $http, 
	        $log, 
	        cfpLoadingBar,
	        $timeout,
	        authService,
    		SekolahService,
    		TahunAjaranService
    ) 
    {
    	$scope.viewdir = $CONST_VAR.viewsDirectory + 'pengaturan/sekolah/';
    	var $resourceApi = SekolahService;
    	var date = helperService.dateTimeZone();
    	//========================Grid Config =======================

		function errorHandle(error){
            var msg = error.data.name;
            toastr.warning(msg, 'Warning');
        }
        
        $scope.form = {
			tahun_ajaran_id : ''
		};
		$scope.formOld = {
			tahun_ajaran_id : ''
		};
		$scope.tahunAjaran = '';

		$scope.gridDetailDirtyRows = [];
		var columnActionTpl = 	'<div class="col-action">' + 
    						  		'<a href="" ng-click="grid.appScope.onDeleteClick(row.entity)" >' + 
    						  			'<span class="badge bg-red"><i class="fa fa-trash"></i></span>' + 
    						  		'</a>' +
    						  	'</div>';
    	var grid = {
    		columnDefs : [
				{ name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
                { name: 'id', displayName: 'ID', visible: false, width : '50' ,  enableCellEdit: false},
                { name: 'nama', displayName: 'Nama', visible: true, width : '150',  enableCellEdit: true},
                { 
                	name: 'alamat', displayName: 'Alamat', visible: true, enableCellEdit: true,
                	// editableCellTemplate: '<div><form name="inputForm"><input type="number" ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></form></div>'
                	// editableCellTemplate: '<div><form name="inputForm"><textarea ng-class="\'colt\' + col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></textarea></form></div>'
                },
                { 
                	name: 'tingkatan', 
                	displayName: 'Tingkatan', 
                	editableCellTemplate: 'ui-grid/dropdownEditor', 
                	width: 120,
					editDropdownValueLabel: 'name', 
					editDropdownOptionsArray: [
						{ id: 'PRESCHOOL', name: 'PRESCHOOL' },
						{ id: 'SD', name: 'SD' },
						{ id: 'SMP', name: 'SMP' },
						{ id: 'SMA', name: 'SMA' }
					]
				},
                { name: 'created_at', displayName: 'Created At', visible: false, width : '75',  enableCellEdit: false},
                { name: 'updated_at', displayName: 'Updated At', visible: false, width : '75',  enableCellEdit: false},
                { name: 'flag', displayName: '', visible: false, width : '100',  enableCellEdit: false}
				
			]
    	}

		grid.columnDefs.push({
			name :' ',
			enableFiltering : false,
			width : '100',
			enableSorting : false,
			enableCellEdit: false,
			cellClass: 'grid-align-right',
			cellTemplate : columnActionTpl
		});	

		$scope.gridDetail = { 
    		paginationPageSizes: [20, 30, 50, 100, 200],
            paginationPageSize: $CONST_VAR.pageSize,
            pageNumber : 1,
            useExternalPagination : true,
            enableMinHeightCheck : true,
            minRowsToShow : 5,
            enableGridMenu: true,
            enableSelectAll: true,
            virtualizationThreshold: $CONST_VAR.pageSize,
            enableFiltering: true,
            enableCellEditOnFocus: true,
            columnDefs : grid.columnDefs,

		    onRegisterApi: function(gridApi){
		      	$scope.gridDetailApi = gridApi;
		  //     	gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
				//     $scope.gridDetail.pageNumber = newPage;
				//     $scope.gridDetail.pageSize = pageSize;
				//     $scope.gridDetail.virtualizationThreshold = pageSize; 

				//     getSekolah(newPage, $scope.gridDetail.virtualizationThreshold);
				// });
				gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
					if(oldValue != newValue){
						$scope.gridDetailDirtyRows[rowEntity.index] = rowEntity;
					}
					$scope.$apply();
				});
		    }
		};

		function addDataDetail(detail, idx){
			var index = (typeof idx != 'undefined') ? idx : $scope.gridDetail.data.length + 1;
			$scope.gridDetail.data.push({
				"index": index,
				"nama": '',
				"alamat": '',
				"tingkatan": '',
				"flag": 1,
			});
		}

    	function reset(){
			$scope.form.username = null;
			$scope.form.email = null;
			$scope.form.pegawai_id = null;
			$scope.form.role = null;
			$scope.form.sekolahid = null;
			$scope.form.created_at = null;
			$scope.form.updated_at = null;
		}

		function getSekolah(){
			cfpLoadingBar.start();
			$resourceApi.get()
			.then(function (result) {
                if(result.success && result.rows.length > 0){
					angular.forEach(result.rows, function(dt, index) {
						var romnum = index + 1;
		                result.rows[index]["index"] = romnum;
		                result.rows[index]["flag"] = 1;
		                $scope.gridDetailDirtyRows[romnum] = result.rows[index];
		            })
		            $scope.gridDetail.data = result.rows;
				}else{
					toastr.warning('Tidak ada data.', 'Warning');
				}
				$scope.form.tahun_ajaran_id = $scope.formOld.tahun_ajaran_id;
				cfpLoadingBar.complete();
            }, errorHandle);
		}

		function getTahunAjaran(){
			cfpLoadingBar.start();
			TahunAjaranService.get(1,0)
			.then(function (result) {
                if(result.success && result.rows.length > 0){
					angular.forEach(result.rows, function(dt, index) {
						if(result.rows[index].aktif == '1'){
							// $scope.form.tahun_ajaran_id = result.rows[index].id;
							$scope.formOld.tahun_ajaran_id = result.rows[index].id;
						}
		            })
		            $scope.tahunAjaran = result.rows;
				}else{
					toastr.warning('Tidak ada data.', 'Warning');
				}
				getSekolah();
				cfpLoadingBar.complete();
            }, errorHandle);
		}


		function init(){
			// getSekolah();
			getTahunAjaran();
		}

		$scope.onSaveClick = function(event){
			if($scope.form.tahun_ajaran_id == '' || $scope.form.tahun_ajaran_id == null){
				toastr.warning('Tahun Ajaran tidak boleh kosong.', 'Warning');
				return false;
			}

			if($scope.gridDetailDirtyRows.length <= 0){
				toastr.warning('Anda belum melakukan perubahan.', 'Warning');
				return false;
			}

			// return; 
			var params = {
				form : $scope.form,
				grid : $scope.gridDetailDirtyRows
			}
			
			function success(result){
				if(result.success){
					toastr.success('Data telah tersimpan.', 'Success');
					toastr.info('Perubahan akan diterapkan setelah aplikasi dimuat ulang', 'Info');
					// $location.path( "/pengaturan/user/");
					cfpLoadingBar.complete();

				}else{
					toastr.error('Data gagal tersimpan. ' + result.message, 'Error');
					cfpLoadingBar.complete();
				}
			}

			cfpLoadingBar.start();
			$resourceApi.update(params).then(success, errorHandle);
			// if($routeParams.id){
			// 	$resourceApi.update(params)
			// 	.then(success, errorHandle);
			// }else{
			// 	$resourceApi.insert(params)
			// 	.then(success, errorHandle);
			// }	
		}

		// $scope.onResetClick = function(event){
		// 	$location.path( "/pengaturan/user/");
		// }

		$scope.onAddClick = function(event){
			addDataDetail();
		}

		$scope.onDeleteClick = function(rowdata){
			var idx = $scope.gridDetail.data.indexOf(rowdata),
				idxdirty = $scope.gridDetailDirtyRows.indexOf(rowdata);
			$scope.gridDetail.data.splice(idx,1);
			// $scope.gridDetailDirtyRows.splice(idxdirty,1);
			if($scope.gridDetailDirtyRows.length > 0){
				$scope.gridDetailDirtyRows[idxdirty].flag = 0;
			}
		}

		$scope.onTahunAjaranChange = function(value){
			if(value != $scope.formOld.tahun_ajaran_id && $scope.gridDetailDirtyRows.length <= 0){
				$scope.gridDetailDirtyRows = $scope.gridDetail.data;
			}
		}

		$scope.$on('$viewContentLoaded', function(){
			// init();
		});

		$timeout(function() {
			init();
		}, 1000);

		
    }
    SekolahController.$inject = injectParams;


    app.register.controller('SekolahController', SekolahController);

});