'use strict';

// app.controller('CoaController', function ($scope, $http, $window, toaster, ngDialog, $injector, $httpParamSerializer) {
//     var $validationProvider = $injector.get('$validation');
//     $http.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

// });

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
    		'GrupAksesService'
    	];

    var GrupAksesController = function (
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
    		GrupAksesService
    ) 
    {
    	$scope.viewdir = $CONST_VAR.viewsDirectory + 'pengaturan/grup-akses/';
    	var $resourceApi = GrupAksesService;
    	var date = new Date();
    	//========================Grid Config =======================

    	

		function errorHandle(error){
            var msg = error.data.name;
            toastr.warning(msg, 'Warning');
        }

        var indexController = function(){
        	var columnActionTpl = 	'<div class="col-action">' + 
		    						  		'<a href="" ng-click="grid.appScope.onEditClick(row.entity)" >' + 
		    						  			'<span class="badge bg-blue"><i class="fa fa-edit"></i></span>' + 
		    						  		'</a>&nbsp;' +
		    						  		'<a href="" ng-hide="grid.appScope.isDeleteHide(row.entity)" ng-click="grid.appScope.onDeleteClick(row.entity)" >' + 
		    						  			'<span class="badge bg-red"><i class="fa fa-trash"></i></span>' + 
		    						  		'</a>' +
		    						  	'</div>';
        	var grid = {
	    		columnDefs : [
					{ name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
					{ name: 'name', displayName: 'ID', visible: false, width : '150' ,  enableCellEdit: false},
					{ name: 'description', displayName: 'Nama Grup', visible: true, enableCellEdit: false},
					{ name: 'createdAt', displayName: 'Created At', visible: false, width : '100',  enableCellEdit: false},
	                { name: 'updatedAt', displayName: 'Updated At', visible: false, width : '100',  enableCellEdit: false}
					
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
	            paginationPageSize: 20,
	            pageNumber : 1,
	            useExternalPagination : true,
	            enableMinHeightCheck : true,
	            minRowsToShow : 20,
	            enableGridMenu: true,
	            enableSelectAll: true,
	            virtualizationThreshold: 20,
	            enableFiltering: true,
	            enableCellEditOnFocus: true,
	            columnDefs : grid.columnDefs,

			    onRegisterApi: function(gridApi){
			      	$scope.gridApi = gridApi;
			    }
			};

			$scope.username = authService.getProfile().name;
			$scope.isDeleteHide = function(rowentity){
				return (['admin','default_role'].indexOf(rowentity.name) > -1)
			}

        	function getRoles(paramdata){
				cfpLoadingBar.start();
	            $resourceApi.getRoles(paramdata)
	            .then(function (result) {
	                if(result.success){
	                    var index = 0;
	                    $scope.grid.data = [];
	                    for(var key in result.rows){
	                    	var romnum = index + 1;
	                    	if(authService.getProfile().name == 'admin' && 
	                    			['admin','default_role'].indexOf(result.rows[key].name) > -1 ){
	                    		$scope.grid.data[index] = {
		                    		index : romnum,
		                    		name : result.rows[key].name,
		                    		description : result.rows[key].description,
		                    		createdAt : result.rows[key].createdAt,
		                    		updatedAt : result.rows[key].updatedAt
		                    	};
		                    	// continue;
	                    	}else if(['admin','default_role'].indexOf(result.rows[key].name) > -1){
	                    		continue;
	                    	}else{
	                    		$scope.grid.data[index] = {
		                    		index : romnum,
		                    		name : result.rows[key].name,
		                    		description : result.rows[key].description,
		                    		createdAt : result.rows[key].createdAt,
		                    		updatedAt : result.rows[key].updatedAt
		                    	};
	                    	}
	                    	index++;
	                    }
	                }
	                cfpLoadingBar.complete();
	            }, errorHandle);
			}

			function deleteData($no){
				cfpLoadingBar.start();
				$resourceApi.delete($no)
				.then(function (result) {
	                if(result.success){
	                	toastr.success('Data telah berhasil dihapus.', 'Success');
					}
					cfpLoadingBar.complete();
					getRoles({
						page : 1,
						perPage : 20
					});
	            }, errorHandle);
			}

			$scope.onAddClick = function(event){
				$location.path( "/pengaturan/grup-akses/add");
			}

			$scope.onEditClick = function(rowdata){
				$location.path( "/pengaturan/grup-akses/edit/" + rowdata.name);
			}

			$scope.onDeleteClick = function(rowdata){
				var del = confirm("Anda yakin akan menghapus data `" + rowdata.name + "`");
				if (del == true) {
				    deleteData(rowdata.name);
				} 
			}

        	this.init = function(){
				getRoles({
					page : 1,
					perPage : 0
				});
			}
        }

        var addEditController = function(){
        	$scope.form = {
				name : '',
				description : '',
				created_at : date,
				updated_at : date
			};

			$scope.gridDetailDirtyRows = [];
			$scope.gridDetail = { 
	    		enableMinHeightCheck : true,
				minRowsToShow : 25,
				enableGridMenu: false,
				// enableSelectAll: true,
				enableFiltering: false,
				enableCellEditOnFocus: true,
				showGridFooter: true,
	    		showColumnFooter: true,
				columnDefs : [
					{ name: 'index', displayName : 'No',visible: false, width : '50', enableFiltering : false ,  enableCellEdit: false},
					{ 
						name: 'order', displayName : 'No', visible: false, width : '50', enableFiltering : false ,  
						enableCellEdit: false,
						// sort: { priority: 1, direction: 'asc' }, 
					},
					{ 
	                    name: 'parent_name', 
	                    grouping: { groupPriority: 1 }, 
	                    width: 150,
	                },
					{ name: 'name', displayName: 'ID', visible: false,  width : 150, enableCellEdit: false},
					{ name: 'description', displayName: 'Menu Akses', visible: true,  enableCellEdit: false},
					{ 
						name: 'create', displayName: 'Tambah', width : '100', visible: true, enableCellEdit: false,
						cellTemplate: '<input ng-hide="grid.appScope.noAction(row.entity, \'create\')" ng-model="row.entity.create" type="checkbox" />'
					},
					{ 
						name: 'read', displayName: 'Lihat', width : '100', visible: true, enableCellEdit: false,
						cellTemplate: '<input ng-hide="grid.appScope.noAction(row.entity, \'read\')"ng-model="row.entity.read" type="checkbox" />'
					},
					{ 
						name: 'update', displayName: 'Perbaiki', width : '100', visible: true, enableCellEdit: false,
						cellTemplate: '<input ng-hide="grid.appScope.noAction(row.entity, \'update\')" ng-model="row.entity.update" type="checkbox" />'
					},
					{ 
						name: 'delete', displayName: 'Hapus', width : '100', visible: true, enableCellEdit: false,
						cellTemplate: '<input ng-hide="grid.appScope.noAction(row.entity, \'delete\')" ng-model="row.entity.delete" type="checkbox" />'
					},
					{ name: 'created_at', displayName: 'Created At', visible: false, width : '100',  enableCellEdit: false},
					{ name: 'updated_at', displayName: 'Updated At', visible: false, width : '100',  enableCellEdit: false},
				],
				treeRowHeaderAlwaysVisible: false,
				enableExpandAll  : true,
				//Export

			    onRegisterApi: function(gridApi){
					$scope.gridApi = gridApi;
					gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
						rowEntity.coalist = $scope.coa
						if( oldValue != newValue && rowEntity != null){
							var rowdata = rowEntity;
							$scope.gridDetailDirtyRows[rowEntity.index] = rowdata;
						}
						console.log($scope.gridDetailDirtyRows);
						$scope.$apply();
					});

					//expand all rows when loading the grid, otherwise it will only display the totals only
					$scope.gridApi.grid.registerDataChangeCallback(function() {
						$scope.gridApi.treeBase.expandAllRows();
					});
			    }
			};

			$scope.noAction = function(rowentity, action){
				var controller = [
					'tagihaninfoinput_list',
					'tagihaninfoinput_listbayar',
					'rgl'
				];

				var actions = ['create','update','delete'];

				if(controller.indexOf(rowentity.name) > -1 && actions.indexOf(action) > -1){
					return true;
				}
				return false;
			}

        	function reset(){
				$scope.form.name = date;
				$scope.form.description = '';
				$scope.form.created_at = date;
				$scope.form.updated_at = date;
			}

			function getPermission(paramdata){
				cfpLoadingBar.start();
				$resourceApi.getPermission(paramdata)
				.then(function (result) {
		            if(result.success){
		            	$scope.gridDetail.data = [];
		            	if(result.rows.length <= 0 )return false;
		            	angular.forEach(result.rows, function(dt, index) {
							var romnum = index + 1;
			                result.rows[index]["index"] = romnum;
			            })
			            $scope.gridDetail.data = result.rows;
			            angular.forEach($scope.gridDetail.data, function(rowEntity, index) {
			                $scope.gridDetailDirtyRows.push(rowEntity);
			            })
					}

					cfpLoadingBar.complete();
		        }, function(error){

		        	toastr.warning('Data tidak bisa dimuat.', 'Warning');
		        	cfpLoadingBar.complete();
		        });
			}

			function getRole(params){
				cfpLoadingBar.start();
				$resourceApi.getRoles(params)
				.then(function (result) {
	                if(result.success){
						var rowdata = result.rows;
						$scope.form.name = rowdata.name;
						$scope.form.description = rowdata.description;
						$scope.form.created_at = rowdata.created_at;
						$scope.form.updated_at = rowdata.updated_at;

						getPermission({
							rolename : rowdata.name
						});
					}
					cfpLoadingBar.complete();
	            }, errorHandle);
			}

			this.init = function(){
				if($routeParams.id){
	                
	            }
	            getRole({
                	rolename : $routeParams.id
                });
			}

			$scope.onSaveClick = function(event){
				if($scope.form.name == '' || $scope.form.name == null){
					toastr.warning('ID tidak boleh kosong.', 'Warning');
					return false;
				}

				if($scope.form.description == '' || $scope.form.description == null){
					toastr.warning('Deskripsi tidak boleh kosong.', 'Warning');
					return false;
				}

				$scope.gridDetailDirtyRows = $scope.gridDetail.data;
				

				if($scope.gridDetailDirtyRows.length <= 0){
					toastr.warning('Grid belum diisi.', 'Warning');
					return false;
				}

				var params = {
					form : $scope.form,
					grid : $scope.gridDetailDirtyRows
				}

				// console.log(params);
				// return;
				
				cfpLoadingBar.start();
				$resourceApi.AddPermission(params)
				.then(function (result) {
	                if(result.success){
						toastr.success('Data telah tersimpan', 'Success');
						$location.path( "/pengaturan/grup-akses/");
						cfpLoadingBar.complete();
					}else{
						toastr.error('Data gagal tersimpan.<br/>' + result.message, 'Error');
						cfpLoadingBar.complete();
					}
	            }, errorHandle);
			}

			$scope.onResetClick = function(event){
				$location.path( "/pengaturan/grup-akses/");
			}
        }

		var controller;
		switch($location.$$url){
			case '/pengaturan/grup-akses/add' :
				controller = new addEditController();
				break;
			case '/pengaturan/grup-akses/edit/' + $routeParams.id :
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

		
    }
    GrupAksesController.$inject = injectParams;


    app.register.controller('GrupAksesController', GrupAksesController);

});