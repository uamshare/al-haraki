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
    		'UserService',
    		'PegawaiService',
    		'GrupAksesService'
    	];

    var UserController = function (
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
    		UserService,
    		PegawaiService,
    		GrupAksesService
    ) 
    {
    	$scope.viewdir = $CONST_VAR.viewsDirectory + 'pengaturan/user/';
    	var $resourceApi = UserService;
    	var date = new Date();
    	//========================Grid Config =======================

		function errorHandle(error){
            var msg = error.data.name;
            toastr.warning(msg, 'Warning');
        }

        var indexController = function(){

        	function get(page, perPage){
				cfpLoadingBar.start();
	            $resourceApi.get(page, perPage)
	            .then(function (result) {
	                if(result.success){
	                    angular.forEach(result.rows, function(dt, index) {
	                        var romnum = index + 1;
	                        var romnum = (page > 1) ? (((page - 1) * $scope.grid.pageSize) + index + 1) : (index + 1);
	                        result.rows[index]["index"] = romnum;
	                    })
	                    $scope.grid.data = result.rows;
	                    $scope.grid.totalItems = result.total;
	                    $scope.grid.paginationCurrentPage = page;
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
					{ name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
	                { name: 'id', displayName: 'ID', visible: false, width : '50' ,  enableCellEdit: false},
	                { name: 'username', displayName: 'Username', visible: true, width : '150',  enableCellEdit: false},
	                { name: 'email', displayName: 'Email', visible: true, enableCellEdit: false},
	                { name: 'pegawai_id', displayName: 'PegawaiID', visible: false, width : '75',  enableCellEdit: false},
	                { name: 'nama_pegawai', displayName: 'Pegawai', visible: true, enableCellEdit: false},
	                { name: 'sekolahid', displayName: 'SekolahID', visible: false, width : '75',  enableCellEdit: false},
	                { name: 'sekolah', displayName: 'Sekolah', visible: true, width : '75',  enableCellEdit: false},
	                { name: 'created_at', displayName: 'Created At', visible: false, width : '75',  enableCellEdit: false},
	                { name: 'updated_at', displayName: 'Updated At', visible: false, width : '75',  enableCellEdit: false}
					
				]
	    	}

			grid.columnDefs.push({
				name :' ',
				enableFiltering : false,
				width : '100',
				enableSorting : false,
				enableCellEdit: false,
				cellTemplate : columnActionTpl
			});	

			$scope.grid = { 
	    		paginationPageSizes: [20, 30, 50, 100, 200],
	            paginationPageSize: $CONST_VAR.pageSize,
	            pageNumber : 1,
	            useExternalPagination : true,
	            enableMinHeightCheck : true,
	            minRowsToShow : $CONST_VAR.pageSize,
	            enableGridMenu: true,
	            enableSelectAll: true,
	            virtualizationThreshold: $CONST_VAR.pageSize,
	            enableFiltering: true,
	            enableCellEditOnFocus: true,
	            columnDefs : grid.columnDefs,

			    onRegisterApi: function(gridApi){
			      	$scope.gridApi = gridApi;
			      	gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
					    $scope.grid.pageNumber = newPage;
					    $scope.grid.pageSize = pageSize;
					    $scope.grid.virtualizationThreshold = pageSize; 

					    get(newPage, $scope.grid.virtualizationThreshold);
					});
			    }
			};

        	

			$scope.onAddClick = function(event){
				$location.path( "/pengaturan/user/add");
			}

			$scope.onEditClick = function(rowdata){
				$location.path( "/pengaturan/user/edit/" + rowdata.id);
			}

			$scope.onDeleteClick = function(rowdata){
				var del = confirm("Anda yakin akan menghapus data `" + rowdata.id + "`");
				if (del == true) {
				    deleteData(rowdata.id);
				} 
			}

        	this.init = function(){
				get(1,$CONST_VAR.pageSize);
			}
        }

        var addEditController = function(){
        	$scope.form = {
				id : null,
				username : null,
				email : null,
				pegawai_id : null,
				role : null,
				sekolahid : null,
				password_hash : null,
				created_at : null,
				updated_at : null
			};

			$scope.pegawai = {
				data : [],
				id : [],
				select : ''
			};

			$scope.roles = {
				data : [],
				name : [],
				select : ''
			};

        	function reset(){
				$scope.form.username = null;
				$scope.form.email = null;
				$scope.form.pegawai_id = null;
				$scope.form.role = null;
				$scope.form.sekolahid = null;
				$scope.form.created_at = null;
				$scope.form.updated_at = null;
			}

			function setPegawai(pegawai_id){
				var index = $scope.pegawai.id.indexOf(pegawai_id);
				$scope.pegawai.select = ($scope.pegawai.data[index]) ? $scope.pegawai.data[index] : '';
			}

			function setRoles(role){
				var index = $scope.roles.name.indexOf(role);
				$scope.roles.select = ($scope.roles.data[index]) ? $scope.roles.data[index] : '';
			}

			function getById(id){
				cfpLoadingBar.start();
				$resourceApi.getById(id)
				.then(function (result) {
	                if(result.success && result.rows.length > 0){
						var rowdata = result.rows[0];
						$scope.form.id = rowdata.id;
						$scope.form.username = rowdata.username;
						$scope.form.email = rowdata.email;
						$scope.form.pegawai_id = rowdata.pegawai_id;
						$scope.form.role = rowdata.role;
						$scope.form.sekolahid = rowdata.sekolahid;
						$scope.form.created_at = rowdata.created_at;
						$scope.form.updated_at = rowdata.updated_at;
					}else{
						toastr.warning('Tidak ada data.', 'Warning');
					}
					cfpLoadingBar.complete();
	            }, errorHandle);
			}

			function getPegawai(paramdata){
				cfpLoadingBar.start();
				PegawaiService.getList(paramdata)
				.then(function (result) {
		            if(result.success && result.rows.length > 0){
			            for(var idx in result.rows){
			            	$scope.pegawai.data[idx] = result.rows[idx].nama_pegawai;
			                $scope.pegawai.id[idx] = result.rows[idx].id;
			            }
			            if($routeParams.id){
							setPegawai($scope.form.pegawai_id);
						}
					}
					cfpLoadingBar.complete();
		        }, function(error){
		        	toastr.warning('Karyawan tidak bisa dimuat.', 'Warning');
		        	cfpLoadingBar.complete();
		        });
			}

			function getRoles(){
				cfpLoadingBar.start();
				GrupAksesService.getRoles()
				.then(function (result) {
		            if(result.success && typeof result.rows != 'undefined'){
		            	var index = 0;
			            for(var idx in result.rows){
			            	$scope.roles.data[index] = result.rows[idx].description;
			                $scope.roles.name[index] = result.rows[idx].name;
			                index++;
			            }
			            if($routeParams.id){
							setRoles($scope.form.role);
						}
					}
					cfpLoadingBar.complete();
		        }, function(error){
		        	toastr.warning('Grup Akses tidak bisa dimuat.', 'Warning');
		        	cfpLoadingBar.complete();
		        });
			}

			function assignRole(){
				cfpLoadingBar.start();
				GrupAksesService.getRoles()
				.then(function (result) {
		            if(result.success && typeof result.rows != 'undefined'){
		            	var index = 0;
			            for(var idx in result.rows){
			            	$scope.roles.data[index] = result.rows[idx].description;
			                $scope.roles.name[index] = result.rows[idx].name;
			                index++;
			            }
					}
					cfpLoadingBar.complete();
		        }, function(error){
		        	toastr.warning('Grup Akses tidak bisa dimuat.', 'Warning');
		        	cfpLoadingBar.complete();
		        });
			}
			
			this.init = function(){
				
				if($routeParams.id){
					$scope.isEdit = true;
	                getById($routeParams.id);
	            }
	            getPegawai({
					sekolahid : authService.getSekolahProfile().sekolahid,
					'per-page' : 0
				});
				getRoles();
			}

			$scope.onSaveClick = function(event){
				if($scope.form.username == '' || $scope.form.username == null){
					toastr.warning('Username tidak boleh kosong.', 'Warning');
					return false;
				}

				if($scope.form.email == '' || $scope.form.email == null){
					toastr.warning('Email tidak boleh kosong.', 'Warning');
					return false;
				}

				var params = $scope.form;
				
				function success(result){
					if(result.success){
						toastr.success('Data telah tersimpan', 'Success');
						$location.path( "/pengaturan/user/");
						cfpLoadingBar.complete();

					}else{
						toastr.error('Data gagal tersimpan. ' + result.message, 'Error');
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

			$scope.onPegawaiChange = function(index){
				var index = $scope.pegawai.data.indexOf($scope.pegawai.select);
				$scope.form.pegawai_id = ($scope.pegawai.id[index]) ? $scope.pegawai.id[index] : '';
			}

			$scope.onRoleChange = function(index){
				var index = $scope.roles.data.indexOf($scope.roles.select);
				$scope.form.role = ($scope.roles.name[index]) ? $scope.roles.name[index] : '';
			}

			$scope.onResetClick = function(event){
				$location.path( "/pengaturan/user/");
			}
        }

        var profileController = function(){
        	
        	$scope.form = {
        		user : {
        			id : '',
        			username : '',
        			password : '',
        			sekolahid : '',
        			role : ''
        		},
        		pegawai : {
        			id : '',
        			nuptk : '',
        			nik : '',
        			nama_pegawai : '',
        			nama_panggilan : ''
        		}
			};
			$scope.isChangedPassword = false;
        	function reset(){
				$scope.form.username = null;
				$scope.form.email = null;
				$scope.form.pegawai_id = null;
				$scope.form.role = null;
				$scope.form.sekolahid = null;
				$scope.form.created_at = null;
				$scope.form.updated_at = null;
			}

			function getByProfile(){
				cfpLoadingBar.start();
				$resourceApi.getProfile()
				.then(function (result) {
	                if(result.success){
						var rowdata = result.rows;
						$scope.form.user = rowdata.user;
						$scope.form.user.passsword_new1 = '';
						$scope.form.user.passsword_new2 = '';
						$scope.form.pegawai = rowdata.pegawai;
					}else{
						toastr.warning('Tidak ada data.', 'Warning');
					}
					cfpLoadingBar.complete();
	            }, errorHandle);
			}
			
			this.init = function(){
				getByProfile();
			}

			$scope.onSavePegawaiClick = function(event){

				var params = $scope.form.pegawai;
				cfpLoadingBar.start();
				function success(result){
					if(result.success){
						toastr.success('Data telah tersimpan', 'Success');
						$location.path( "/profile");
						cfpLoadingBar.complete();
					}else{
						toastr.error('Data gagal tersimpan. ' + result.message, 'Error');
						cfpLoadingBar.complete();
					}
				}

				PegawaiService.update(params)
				.then(success, errorHandle);	
			}

			$scope.onSaveUserClick = function(event){
				if($scope.form.user.username == '' || $scope.form.user.username == null){
					toastr.warning('Username tidak boleh kosong.', 'Warning');
					return false;
				}

				if($scope.form.user.email == '' || $scope.form.user.email == null){
					toastr.warning('Email tidak boleh kosong.', 'Warning');
					return false;
				}

				if($scope.isChangedPassword && 
						($scope.form.user.password == '' || $scope.form.user.password == null)){
					toastr.warning('Kata sandi lama tidak boleh kosong.', 'Warning');
					return false;
				}

				if($scope.isChangedPassword && 
						($scope.form.user.password_new1 == '' || $scope.form.user.password_new1 == null)){
					toastr.warning('Kata sandi baru tidak boleh kosong.', 'Warning');
					return false;
				}

				if($scope.isChangedPassword && 
						($scope.form.user.password == $scope.form.user.password_new1)){
					toastr.warning('Silahkan masukan Kata sandi baru yang berbeda ', 'Warning');
					return false;
				}
				

				var params = $scope.form.user;
				// $scope.form.user.password = $scope.form.user.password_new1;
				// $scope.form.user.password_new1 = null;
				// $scope.form.user.password_new2 = null;
				cfpLoadingBar.start();
				function success(result){
					if(result.success){
						toastr.success('Data telah tersimpan', 'Success');
						$location.path( "/profile");
						cfpLoadingBar.complete();
					}else{
						toastr.error('Data gagal tersimpan. ' + result.message, 'Error');
						cfpLoadingBar.complete();
					}
				}

				$resourceApi.updateProfile(params)
				.then(success, errorHandle);	
			}

			$scope.onResetClick = function(event){
				$location.path( "/pengaturan/user/");
			}
        }

		var controller;
		switch($location.$$url){
			case '/pengaturan/user/add' :
				controller = new addEditController();
				break;
			case '/pengaturan/user/edit/' + $routeParams.id :
				controller = new addEditController();
				break;
			case '/profile' :
				controller = new profileController();
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
    UserController.$inject = injectParams;


    app.register.controller('UserController', UserController);

});