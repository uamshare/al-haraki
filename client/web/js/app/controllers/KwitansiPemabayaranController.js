'use strict';

define(['app'], function (app) {
	var injectParams = [
			'$CONST_VAR',
    		'$scope', 
    		'toastr',
    		// 'toastrConfig',
    		'$location', 
    		'$routeParams', 
    		'$http', 
    		'$log', 
    		'ngDialog',
    		'cfpLoadingBar',
    		'$timeout',
    		'uiGridConstants',
    		'kwitansiPemabayaranService',
    		'SiswaRombelService',
    		'TagihanInfoService'
    	];

    var KwitansiPemabayaranController = function (
		$CONST_VAR,
		$scope, 
		toastr,
		// toastrConfig,
		$location, 
		$routeParams, 
		$http, 
		$log, 
		ngDialog,
		cfpLoadingBar,
		$timeout,
		uiGridConstants,	
		kwitansiPemabayaranService,
		SiswaRombelService,
		TagihanInfoService
	) 
    {
    	$scope.viewdir = $CONST_VAR.viewsDirectory + 'keuangan/kwitansi-pembayaran/';
    	var $resourceApi = kwitansiPemabayaranService;
    	var date = new Date();
    	$scope.month = [
			{id: 1, name: 'Januari'},
			{id: 2, name: 'Februari'},
			{id: 3, name: 'Maret'},
			{id: 4, name: 'April'},
			{id: 5, name: 'Mei'},
			{id: 6, name: 'Juni'},
			{id: 7, name: 'Juli'},
			{id: 8, name: 'Agustus'},
			{id: 9, name: 'September'},
			{id: 10, name: 'Oktober'},
			{id: 11, name: 'November'},
			{id: 12, name: 'Desember'}
		];
    	/******************* GRID CONFIG **********************************/
    	var gridOptions = {
    		columnDefs : [
				{ name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
				{ name: 'idrombel', displayName: 'Id Rombel', visible: false, width : '50',  enableCellEdit: false},
				{ name: 'sekolahid', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
				{ name: 'no_kwitansi', displayName: 'No Kwitansi', width : '120',  enableCellEdit: false},
				{ name: 'tgl_kwitansi', displayName: 'Tgl Kwitansi', width : '120',  enableCellEdit: false},
				{ name: 'nama_pembayar', displayName: 'Nama Pembayar', enableCellEdit: false},
				{ name: 'bulan', displayName: 'Bulan', visible: false, enableCellEdit: false},
				{ name: 'tahun', displayName: 'Tahun', visible: false, enableCellEdit: false},
				{ name: 'created_by', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
				{ name: 'updated_by', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
				{ name: 'created_at', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
				{ name: 'updated_at', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
			]
    	};

    	var columnActionTpl = 	'<div class="col-action">' + 
	    								'<a href="" ng-click="grid.appScope.gridAction.onPrintClick(row.entity)" >' + 
	    						  			'<span class="badge bg-orange"><i class="fa fa-print"></i></span>' + 
	    						  		'</a>&nbsp;' +
	    						  		'<a href="" ng-click="grid.appScope.gridAction.onEditClick(row.entity)" >' + 
	    						  			'<span class="badge bg-blue"><i class="fa fa-edit"></i></span>' + 
	    						  		'</a>&nbsp;' +
	    						  		'<a href="" ng-click="grid.appScope.gridAction.onDeleteClick(row.entity)" >' + 
	    						  			'<span class="badge bg-red"><i class="fa fa-trash"></i></span>' + 
	    						  		'</a>' +
	    						  	'</div>';
	    gridOptions.columnDefs.push({
			name :' ',
			enableFiltering : false,
			width : '100',
			enableSorting : false,
			enableCellEdit: false,
			cellTemplate : columnActionTpl
		});	

    	$scope.grid = { 
    		enableMinHeightCheck : true,
			minRowsToShow : 20,
			enableGridMenu: true,
			enableSelectAll: true,
			virtualizationThreshold: 20,
			enableFiltering: true,
			enableCellEditOnFocus: true,
			columnDefs : gridOptions.columnDefs,
			//Export
		    onRegisterApi: function(gridApi){
		      $scope.gridApi = gridApi;
		    }
		};


		$scope.form = {
			no_kwitansi : '',
			tgl_kwitansi : '',
			nama_pembayar : '',
			idrombel : '',
			keterangan : '',
			sumber_kwitansi : '',
			month : '',
			year : ''
		};

		$scope.gridDetailDirtyRows = [];
		var columnDetailActionTpl = 	'<div class="col-action">' + 
	    								'<a href="" ng-click="grid.appScope.gridAction.onDeleteDetailClick(row.entity)" >' + 
	    						  			'<span class="badge bg-red"><i class="fa fa-trash"></i></span>' + 
	    						  		'</a>' +
	    						  	'</div>';
		$scope.gridDetail = { 
    		enableMinHeightCheck : true,
			minRowsToShow : 5,
			enableGridMenu: false,
			// enableSelectAll: true,
			enableFiltering: false,
			enableCellEditOnFocus: true,
			showGridFooter: true,
    		showColumnFooter: true,
			columnDefs : [
				{ name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
				{ name: 'id', displayName: 'Id', visible: false, width : '50',  enableCellEdit: false},
				{ name: 'no_kwitansi', displayName: 'No Kwitansi', visible: false, width : '120',  enableCellEdit: false},
				{ name: 'kode', displayName: 'Kode', width : '120', visible: false, enableCellEdit: false},
				{ name: 'rincian', displayName: 'Rincian'},
				{ 
					name: 'jumlah', 
					displayName: 'Jumlah', 
					width : '150',
					type: 'number', 
					cellFilter: 'number: 0',
					aggregationType: uiGridConstants.aggregationTypes.sum,
					aggregationHideLabel: true
				}
			],
			data : [
				{
					index : 1,
					kode : '',
					no_kwitansi : $scope.form.no_kwitansi,
					rincian : '',
					jumlah : 0
				}
			],
			//Export
		    onRegisterApi: function(gridApi){
				$scope.gridApi = gridApi;
				gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
					if(oldValue != newValue && (parseInt(newValue))){
						$scope.gridDetailDirtyRows.push(rowEntity);
					}
					$scope.$apply();
				});
		    }
		};

		$scope.gridDetail.columnDefs.push({
			name :' ',
			enableFiltering : false,
			enableSorting : false,
			enableCellEdit: false,
			width : '50',
			cellTemplate : columnDetailActionTpl
		});

		$scope.rombel;
		$scope.nis = {
			data : [],
			nama_kelas : '',
			kelas : '',
			select : ''
		};

		/******************* GRID CONFIG **********************************/
    	
    	/*********************** Filter Grid ******************************/
		
		/*********************** Action ******************************/

		function errorHandle(error){
			var msg = error.data.name;
			toastr.warning(msg, 'Warning');
		}

		function get(paramdata){
			cfpLoadingBar.start();
			$resourceApi.get(paramdata.page, paramdata.perPage)
			.then(function (result) {
                if(result.success){
					angular.forEach(result.rows, function(dt, index) {
						var romnum = index + 1;
		                result.rows[index]["index"] = romnum;
		            })
		            $scope.grid.data = result.rows;
		            // $scope.gridApi.grid.minRowsToShow = 5; //paramdata.perPage;
		            // $scope.gridApi.grid.gridHeight =500;
				}
				cfpLoadingBar.complete();
            }, errorHandle);
		}

		function reset(){
			$scope.form.tgl_kwitansi = date;
			$scope.form.nama_pembayar = '';
			$scope.form.idrombel = '';
			$scope.form.keterangan = '';
			$scope.nis.nama_siswa = '';
			$scope.nis.kelas = '';
			$scope.nis.select = '';
			$scope.form.sumber_kwitansi = '';
			$scope.form.month = date.getMonth() + 1;
			$scope.form.year = date.getFullYear();

			$scope.gridDetail.data = [
				{
					index : 1,
					no_kwitansi : $scope.form.no_kwitansi,
					rincian : '',
					jumlah : 0
				}
			]
		}

		function refreshNo(){
			$resourceApi.getNewNoKwitansi()
			.then(function (result) {
                if(result.success){
		            $scope.form.no_kwitansi = result.rows;
				}
            }, function(error){
            	toastr.warning('No Kwitansi tidak bisa dimuat. Silahkan klik tombol tambah', 'Warning');
            });
		}

		function getRombel(){
			cfpLoadingBar.start();
			SiswaRombelService.getList()
			.then(function (result) {
                if(result.success){
		            $scope.rombel = result.rows;
		            angular.forEach(result.rows, function(dt, index) {
		                $scope.nis.data[index] = dt.nis;
		            })
				}
				cfpLoadingBar.complete();
            }, function(error){
            	toastr.warning('Siswa tidak bisa dimuat.', 'Warning');
            	cfpLoadingBar.complete();
            });
		}

		function addDataDetail(detail, idx){
			var index = (typeof idx != 'undefined') ? idx : $scope.gridDetail.data.length + 1;
			$scope.gridDetail.data.push({
				"index": index,
				"kode": detail.kode,
				"no_kwitansi": $scope.form.no_kwitansi,
				"rincian": (typeof detail != 'undefined') ? detail.rincian : '',
				"jumlah": (typeof detail != 'undefined') ? detail.jumlah : 0
			});
		}

		function getInfoTagihan(){
			cfpLoadingBar.start();
			TagihanInfoService.getList({
				idrombel : $scope.form.idrombel,
				month : $scope.form.month,
				year : $scope.form.year
			})
			.then(function (result) {
                if(result.success){
                	$scope.gridDetail.data = [];
                	var row = result.rows[0];
		            addDataDetail({
		            	kode : 'spp',
		            	rincian : 'SPP',
		            	jumlah : parseInt(row.spp)
		            });
		            addDataDetail({
		            	kode : 'komite_sekolah',
		            	rincian : 'Komite Sekolah',
		            	jumlah : parseInt(row.komite_sekolah)
		            });
		            addDataDetail({
		            	kode : 'catering',
		            	rincian : 'Catering',
		            	jumlah : parseInt(row.catering)
		            });
		            addDataDetail({
		            	kode : 'keb_siswa',
		            	rincian : 'Kebutuhan Siswa',
		            	jumlah : parseInt(row.keb_siswa)
		            });
		            addDataDetail({
		            	kode : 'ekskul',
		            	rincian : 'Ekskul',
		            	jumlah : parseInt(row.ekskul)
		            });
		            angular.forEach($scope.gridDetail.data, function(rowEntity, index) {
		                $scope.gridDetailDirtyRows.push(rowEntity);
		            })
				}
				cfpLoadingBar.complete();
            }, function(error){
            	toastr.warning('Info Tagihan tidak bisa dimuat.', 'Warning');
            	cfpLoadingBar.complete();
            });
		}

		function getRowDetailByNo(noKwitansi){
			cfpLoadingBar.start();
			$resourceApi.getDetail({
				no_kwitansi : noKwitansi
			})
			.then(function (result) {
                if(result.success){
                	$scope.gridDetail.data = [];
                	angular.forEach(result.rows, function(dt, index) {
						var romnum = index + 1;
		                result.rows[index]["index"] = romnum;
		                result.rows[index]["jumlah"] = parseInt(result.rows[index]["jumlah"]);
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

		function deleteData($no){
			cfpLoadingBar.start();
			$resourceApi.delete($no)
			.then(function (result) {
                if(result.success){
                	toastr.success('Data telah berhasil dihapus.', 'Success');
				}
				reset();
				cfpLoadingBar.complete();
				get({
					page : 1,
					perPage : 20
				});
            }, errorHandle);
		}

		function setGridCollapse(collapse){
			var box = $('#kwitansi-pembayaran-grid');
			var bf = box.find(".box-body, .box-footer");
			
			if (collapse) {
				box.find(".fa-minus").removeClass("fa-minus").addClass("fa-plus");
				box.addClass('collapsed-box');
				bf.slideUp();
			} else {
				box.find(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
				box.removeClass('collapsed-box');
				bf.slideDown();
			}
		}

		function setFormCollapse(collapse){
			var box = $('#kwitansi-pembayaran-form');
			var bf = box.find(".box-body, .box-footer");
			if (collapse) {
				box.find(".fa-minus").removeClass("fa-minus").addClass("fa-plus");
				box.addClass('collapsed-box');
				bf.slideUp();
			} else {
				box.find(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
				box.removeClass('collapsed-box');
				bf.slideDown();
			}
		}

		function printElement(elem) {
			var domClone = elem.cloneNode(true);

			var $printSection = document.getElementById("printSection");

			if (!$printSection) {
				var $printSection = document.createElement("div");
				$printSection.id = "printSection";
				document.body.appendChild($printSection);
			}
			$printSection.innerHTML = "";

			$printSection.appendChild(domClone);
		}

		$scope.print = function(divName){
			printElement(document.getElementById(divName));
			window.print();
		}

		$scope.onAddClick = function(event){
			setFormCollapse(false);
			setGridCollapse(true);
			reset();
			refreshNo();
		}

		$scope.onShowClick = function(event){
			setFormCollapse(true);
			setGridCollapse(false);
			reset();
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

			if($scope.form.nama_pembayar == '' || $scope.form.nama_pembayar == null){
				toastr.warning('Nama Pembayar tidak boleh kosong.', 'Warning');
				return false;
			}

			if($scope.gridDetailDirtyRows.length <= 0){
				toastr.warning('Rincian kwitansi belum diisi.', 'Warning');
				return false;
			}

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
					get({
						page : 1,
						perPage : 20
					});
					cfpLoadingBar.complete();
				}else{
					toastr.success('Data gagal tersimpan.<br/>' + result.message, 'Success');
					cfpLoadingBar.complete();
				}
            }, errorHandle);
		}

		$scope.onResetClick = function(event){
			setFormCollapse(true);
			setGridCollapse(false);
		}

		$scope.onAddDetailClick = function(event){
			addDataDetail();
		}

		$scope.onNISChange = function(index){
			var index = $scope.nis.data.indexOf($scope.nis.select);
			$scope.nis.nama_siswa = ($scope.rombel[index]) ? $scope.rombel[index].nama_siswa : '';
			$scope.nis.kelas = ($scope.rombel[index]) ? $scope.rombel[index].kelas + ' - ' + $scope.rombel[index].nama_kelas : '';
			$scope.form.idrombel = ($scope.rombel[index]) ? $scope.rombel[index].id : '';

			if($scope.form.sumber_kwitansi == '1'){
				getInfoTagihan();
			}
		}

		$scope.onSKSelect = function(value){
			$scope.form.sumber_kwitansi = value;
			if(value =='1'){
				if($scope.form.idrombel == '' || $scope.form.idrombel == null){
					toastr.warning('NIS siswa belum diisi.', 'Warning');
					return false;
				}
				$scope.form.year = ($scope.form.month >= 1 &&  $scope.form.month <= 6) ? 
									(date.getFullYear() + 1) : date.getFullYear();
				getInfoTagihan();
			}else{
				$scope.gridDetail.data = [
					{
						index : 1,
						no_kwitansi : $scope.form.no_kwitansi,
						rincian : '',
						jumlah : 0
					}
				]
			}
		}

		$scope.gridAction = {
			onEditClick : function(rowdata){
				setFormCollapse(false);
				setGridCollapse(true);

				$scope.form.no_kwitansi = rowdata.no_kwitansi;
				$scope.form.tgl_kwitansi = rowdata.tgl_kwitansi;
				$scope.form.nama_pembayar = rowdata.nama_pembayar;
				$scope.form.idrombel = rowdata.idrombel;
				$scope.form.keterangan = rowdata.keterangan;
				$scope.form.sumber_kwitansi = rowdata.sumber_kwitansi;
				$scope.form.month = rowdata.bulan;
				$scope.form.year = rowdata.tahun;
				$scope.form.created_by = rowdata.created_by;
				$scope.form.created_at = rowdata.created_at;
				
				var idx = false;

				if(rowdata.idrombel != null && rowdata.idrombel != ''){
					for(idx in $scope.rombel){
						if($scope.rombel[idx].idrombel == rowdata.idrombel){
		                	break;
		                }
					}
				}else{
					console.log('idrombel : ' + rowdata.idrombel);
				}
				
				$scope.nis.select = (!idx) ? '' : $scope.nis.data[idx];
				$scope.nis.nama_siswa = (!idx) ? '' : $scope.rombel[idx].nama_siswa;
				$scope.nis.kelas = (!idx) ? '' : $scope.rombel[idx].kelas + ' - ' + $scope.rombel[idx].nama_kelas;
				getRowDetailByNo(rowdata.no_kwitansi);
			},

			onDeleteClick : function(rowdata){
				var del = confirm("Anda yakin akan menghapus data `" + rowdata.no_kwitansi + "`");
				if (del == true) {
				    deleteData(rowdata.no_kwitansi);
				} 
			},

			onPrintClick : function(rowdata){
				var date = new Date();
				$scope.row = rowdata;
				$scope.row.total = function(){
					return  $scope.row.spp + 
							$scope.row.komite_sekolah +
							$scope.row.catering +
							$scope.row.keb_siswa +
							$scope.row.ekskul;
				}
				$scope.monthPrint = date.getMonth() + 1;
				$scope.monthYear = date.getFullYear();

		        ngDialog.open({
		            template: $scope.viewdir + 'print.html',
		            className: 'ngdialog-theme-flat',
		            scope: $scope
		        });
			},

			onDeleteDetailClick : function(rowdata){
				var idx = $scope.gridDetail.data.indexOf(rowdata),
					idxdirty = $scope.gridDetailDirtyRows.indexOf(rowdata);
				// delete $scope.gridDetail.data[idx];
				// delete $scope.gridDetailDirtyRows[idxdirty];
				$scope.gridDetail.data.splice(idx,1);
				$scope.gridDetailDirtyRows.splice(idxdirty,1);
			}
		};

		function init(){
			refreshNo();
			setFormCollapse(true);
			setGridCollapse(false);
			getRombel();
			get({
				page : 1,
				perPage : 20
			});
		}

		$scope.$on('$viewContentLoaded', function(){
			// init();
		});

		$timeout(function() {
			init();
		}, 1000);
    }
    KwitansiPemabayaranController.$inject = injectParams;

    app.register.controller('KwitansiPemabayaranController', KwitansiPemabayaranController);
});