'use strict';

define(['app'], function (app) {

    app.register.controller('CoaController', 
    	function (
    		$CONST_VAR,
    		$scope,
    		$location,
    		$routeParams,
    		$http,
    		$log,
    		$timeout,
    		toastr,
    		cfpLoadingBar,
    		uiGridConstants,
    		COAService
    	) {
    	$scope.viewdir = $CONST_VAR.viewsDirectory + 'akuntansi/coa/';
    	var $resourceApi = COAService;
    	var date = helperService.dateTimeZone();

    	function errorHandle(error){
            var msg = error.data.name;
            toastr.warning(msg, 'Warning');
        }

        var indexController = function(){

			function get(curpage, perpage){
				cfpLoadingBar.start();
	            $resourceApi.get(curpage, perpage)
	            .then(function (result) {
	                if(result.success){
	                    angular.forEach(result.rows, function(dt, index) {
							var romnum = (curpage > 1) ? (((curpage - 1) * $scope.grid.pageSize) + index + 1) : (index + 1);
			                result.rows[index]["index"] = romnum;
			            })
						$scope.grid.data = result.rows;
						$scope.grid.totalItems = result.total;
						$scope.grid.useExternalPagination = true;
						$scope.grid.paginationCurrentPage = curpage;
	                }
	                cfpLoadingBar.complete();
	            }, errorHandle);
			}

			function deleteData($id){
				cfpLoadingBar.start();
				$resourceApi.delete($id)
				.then(function (result) {
	                if(result.success){
	                	toastr.success('Data telah berhasil dihapus.', 'Success');
					}
					cfpLoadingBar.complete();
					get(1,$CONST_VAR.pageSize);
	            }, errorHandle);
			}

        	var columnActionTpl = 	'<div class="col-action">' + 
		    						  		'<a href="" ng-click="grid.appScope.onEditClick(row.entity)" >' + 
		    						  			'<span class="badge bg-blue"><i class="fa fa-edit"></i></span>' + 
		    						  		'</a>&nbsp;' +
		    						  		'<a href="" ng-click="grid.appScope.onDeleteClick(row.entity)" >' + 
		    						  			'<span class="badge bg-red"><i class="fa fa-trash"></i></span>' + 
		    						  		'</a>' +
		    						  	'</div>';
        	var grid = {
	    		columnDefs : [
					{ name: 'index', displayName : 'No', width : '50' },
					{ name: 'mcoadno', displayName: 'No Akun', width : '100' },
					{ name: 'mcoadname', displayName: 'Nama Akun'},
					{ name: 'mcoahno', displayName: 'Akun Master', width : '100'},
					{ name: 'mcoahname', displayName: 'Nama Akun Master'},
					{ name: 'mcoaclassification', displayName: 'Klasifikasi', width : '150'},
					{ name: 'mcoagroup', displayName: 'Grup', width : '120'}
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

			$scope.grid = { 
				paginationPageSizes: [20, 30, 50, 100, 200],
	    		paginationPageSize: $CONST_VAR.pageSize,
	    		pageNumber : 1,
	    		enableMinHeightCheck : true,
				minRowsToShow : $CONST_VAR.pageSize,
				enableGridMenu: true,
				enableSelectAll: true,
				virtualizationThreshold: $CONST_VAR.pageSize,
				enableFiltering: true,
				columnDefs : grid.columnDefs
			};

 			$scope.onEditClick = function(rowdata){
				$location.path( "/akuntansi/coa/edit/" + rowdata.mcoadno);
			}

			$scope.onDeleteClick = function(rowdata){
				var del = confirm("Anda yakin akan menghapus data `" + rowdata.mcoadno + "`");
				if (del == true) {
				    deleteData(rowdata.mcoadno);
				} 
			}

			$scope.grid.onRegisterApi = function (gridApi) {
				$scope.gridApi = gridApi;
				gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
				    $scope.grid.pageNumber = newPage;
				    $scope.grid.pageSize = pageSize;
				    $scope.grid.virtualizationThreshold = pageSize; 

				    get(newPage, $scope.grid.virtualizationThreshold);
				});
			}

			$scope.onBtnHistoryClick = function (event) {
	    		console.log(event);
	    	}

        	this.init = function(){
				get(1,$CONST_VAR.pageSize);
			}
        }

        var addEditController = function(){
        	$scope.form = {
				mcoadno : null,
				mcoadnoold : null,
				mcoadname : null,
				mcoahno : null,
				active : 1,
				created_at : date.getDate(),
				updated_at : date.getDate()
			};

			$scope.mcoah = {
				data : [],
				mcoahno : [],
				select : ''
			};

        	function reset(){
				$scope.form.mcoadnoold = null;
				$scope.form.mcoadno = null;
				$scope.form.mcoadname = null;
				$scope.form.mcoahno = null;
				$scope.form.active = 1;
				$scope.form.created_at = date.getDate();
				$scope.form.updated_at = date.getDate();
			}

			function getMcoah(paramdata){
				cfpLoadingBar.start();
	            $resourceApi.getListMaster(paramdata)
	            .then(function (result) {
	                if(result.success){
						$scope.mcoah.data = result.rows;
	                }
	                cfpLoadingBar.complete();
	                if($routeParams.id){
						$scope.isEdit = true;
		                getById($routeParams.id);
		            }
	            }, errorHandle);
			}

			function getById(id){
				cfpLoadingBar.start();
				$resourceApi.getById(id)
				.then(function (result) {
	                if(result.success && result.rows.length > 0){
						var rowdata = result.rows[0];
						$scope.form.mcoadnoold = rowdata.mcoadno;
						$scope.form.mcoadno = rowdata.mcoadno;
						$scope.form.mcoadname = rowdata.mcoadname;
						$scope.form.mcoahno = rowdata.mcoahno;
						$scope.form.active = 1;
						$scope.form.created_at = rowdata.created_at;
						$scope.form.updated_at = rowdata.updated_at;
					}else{
						toastr.warning('Tidak ada data.', 'Warning');
					}
					cfpLoadingBar.complete();
	            }, errorHandle);
			}

			this.init = function(){
				getMcoah({
            		page : 1,
            		'per-page' : 0
            	});
			}

			$scope.onSaveClick = function(event){
				if($scope.form.mcoadno == '' || $scope.form.mcoadno == null){
					toastr.warning('No Akun tidak boleh kosong.', 'Warning');
					return false;
				}

				if($scope.form.mcoadname == '' || $scope.form.mcoadname == null){
					toastr.warning('Nama Akun tidak boleh kosong.', 'Warning');
					return false;
				}

				if($scope.form.mcoahno == '' || $scope.form.mcoahno == null){
					toastr.warning('Master Akun tidak boleh kosong.', 'Warning');
					return false;
				}

				var params = $scope.form;
				
				function success(result){
					if(result.success){
						toastr.success('Data telah tersimpan', 'Success');
						$location.path( "/akuntansi/coa/");
						cfpLoadingBar.complete();

					}else{
						toastr.success('Data gagal tersimpan. ' + result.message, 'Success');
						cfpLoadingBar.complete();
					}
				}

				cfpLoadingBar.start();
				if($routeParams.id){
					$resourceApi.update(params)
					.then(success, errorHandle);
				}else{
					$resourceApi.insert(params)
					.then(success, errorHandle);
				}	
			}

			$scope.onMcoahChange = function(index){
				var index = $scope.pegawai.data.indexOf($scope.pegawai.select);
				$scope.form.pegawai_id = ($scope.pegawai.id[index]) ? $scope.pegawai.id[index] : '';
			}

			$scope.onResetClick = function(event){
				$location.path( "/akuntansi/coa/");
			}
        }

		var controller;
		switch($location.$$url){
			case '/akuntansi/coa/add' :
				controller = new addEditController();
				break;
			case '/akuntansi/coa/edit/' + $routeParams.id :
				controller = new addEditController();
				break;
			default : 
				controller = new indexController();
				break;
		}

		$scope.$on('$viewContentLoaded', function(){
			// init();
		});

		$timeout(function() {
			controller.init();
		}, 1000);
    });

});