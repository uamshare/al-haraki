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
    		GrupAksesService
    	) 
    {
    	$scope.viewdir = $CONST_VAR.viewsDirectory + 'pengaturan/grup-akses/';
    	var $resourceApi = GrupAksesService;

    	//========================Grid Config =======================

    	var grid = {
    		columnDefs : [
				{ name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
				{ name: 'name', displayName: 'Name', visible: false, width : '50' ,  enableCellEdit: false},
				{ name: 'description', displayName: 'Nama Grup', visible: true, width : '100',  enableCellEdit: false},
				{ name: 'created_at', displayName: 'Created At', visible: false, width : '100',  enableCellEdit: false},
                { name: 'updated_at', displayName: 'Updated At', visible: false, width : '100',  enableCellEdit: false}
				
			]
    	}

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

		function errorHandle(error){
            var msg = error.data.name;
            toastr.warning(msg, 'Warning');
        }

        var indexController = function(){
        	function getRoles(paramdata){
				cfpLoadingBar.start();
	            $resourceApi.getRoles(paramdata)
	            .then(function (result) {
	                if(result.success){
	                	console.log(result.rows);
	                    angular.forEach(result.rows, function(dt, index) {
	                        var romnum = index + 1;
	                        result.rows[index]["index"] = romnum;
	                    })
	                    $scope.grid.data = result.rows;
	                    $scope.grid.totalItems = result.total;
	                    $scope.grid.paginationCurrentPage = paramdata.page;
	                }
	                cfpLoadingBar.complete();
	            }, errorHandle);
			}

			$scope.onAddClick = function(event){
				$location.path( "/pengaturan/grup-akses/add");
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
				no_kwitansi : '',
				tgl_kwitansi : date,
				nama_penerima : '',
				keterangan : '',
				nik : '',
				sekolahid : authService.getSekolahProfile().sekolahid,
				tahun_ajaran_id : authService.getSekolahProfile().tahun_ajaran_id,
				created_by : '',
				updated_by : '',
				created_at : date,
				updated_at : date
			};

        	function reset(){
				$scope.form.tgl_kwitansi = date;
				$scope.form.nama_penerima = '';
				$scope.form.nik = '';
				$scope.form.keterangan = '';
				$scope.form.sekolahid = authService.getSekolahProfile().sekolahid;
				$scope.form.tahun_ajaran_id = authService.getSekolahProfile().tahun_ajaran_id;
				$scope.form.created_by = '';
				$scope.form.updated_by = '';
				$scope.form.created_at = date;
				$scope.form.updated_at = date;

				$scope.gridDetail.data = [
					{
						index : 1,
						kode : '',
						no_kwitansi : $scope.form.no_kwitansi,
						rincian : '',
						jumlah : 0,
						flag : 1
					}
				]
			}

			function getRowDetailByNo(noKwitansi){
				cfpLoadingBar.start();
				$resourceApi.getDetail({
					no_kwitansi : noKwitansi
				})
				.then(function (result) {
		            if(result.success){
		            	$scope.gridDetail.data = [];
		            	if(result.rows.length <= 0 )return false;
		            	
		            	angular.forEach(result.rows, function(dt, index) {
							var romnum = index + 1;
			                result.rows[index]["index"] = romnum;
			                result.rows[index]["jumlah"] = parseInt(result.rows[index]["jumlah"]);
			                result.rows[index]["flag"] = 1;
			            })
			            $scope.gridDetail.data = result.rows;
			            angular.forEach($scope.gridDetail.data, function(rowEntity, index) {
			                $scope.gridDetailDirtyRows.push(rowEntity);
			            })
					}
					cfpLoadingBar.complete();
		        }, function(error){
		        	toastr.warning('Rincian Kwitansi tidak bisa dimuat.', 'Warning');
		        	cfpLoadingBar.complete();
		        });
			}

			function getById(id){
				cfpLoadingBar.start();
				$resourceApi.getById(id)
				.then(function (result) {
	                if(result.success){
						var rowdata = result.rows;
						$scope.form.no_kwitansi = rowdata.no_kwitansi;
						$scope.form.tgl_kwitansi = rowdata.tgl_kwitansi;
						$scope.form.nama_penerima = rowdata.nama_penerima;
						$scope.form.keterangan = rowdata.keterangan;
						$scope.form.nik = rowdata.nik;
						$scope.form.sekolahid = rowdata.sekolahid;
						$scope.form.tahun_ajaran_id = rowdata.tahun_ajaran_id;
						$scope.form.created_by = rowdata.created_by;
						$scope.form.updated_by = rowdata.updated_by;
						$scope.form.created_at = rowdata.created_at;
						$scope.form.updated_at = rowdata.updated_at;

						getRowDetailByNo(rowdata.no_kwitansi);
					}
					cfpLoadingBar.complete();
	            }, errorHandle);
			}

			this.init = function(){
				if($routeParams.id){
	                getById($routeParams.id);
	            }else{
	                refreshNo();
					// reset();
	            }
			}

			$scope.onSaveClick = function(event){
				if($scope.form.no_kwitansi == '' || $scope.form.no_kwitansi == null){
					toastr.warning('No Kwitansi tidak boleh kosong.', 'Warning');
					return false;
				}

				if($scope.form.tgl_kwitansi == '' || $scope.form.tgl_kwitansi == null){
					toastr.warning('Tgl Kwitansi tidak boleh kosong.', 'Warning');
					return false;
				}

				if($scope.form.nama_penerima == '' || $scope.form.nama_penerima == null){
					toastr.warning('Nama Penerima tidak boleh kosong.', 'Warning');
					return false;
				}

				if($scope.gridDetailDirtyRows.length <= 0){
					toastr.warning('Rincian kwitansi belum diisi.', 'Warning');
					return false;
				}

				console.log($scope.gridDetailDirtyRows);
				// return; 
				var params = {
					form : $scope.form,
					grid : $scope.gridDetailDirtyRows
				}
				cfpLoadingBar.start();
				$resourceApi.insert(params)
				.then(function (result) {
	                if(result.success){
						toastr.success('Data telah tersimpan', 'Success');
						reset();
						refreshNo();
						cfpLoadingBar.complete();
						$location.path( "/pengaturan/grup-akses/");
						cfpLoadingBar.complete();
					}else{
						toastr.success('Data gagal tersimpan.<br/>' + result.message, 'Success');
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
			console.log();
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