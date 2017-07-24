'use strict';

define(['app'], function (app) {
	var injectParams = [
			'$CONST_VAR',
			'helperService',
    		'$scope', 
    		'toastr',
    		'uiGridGroupingConstants',
    		'$location', 
    		'$routeParams', 
    		'$http', 
    		'$log', 
    		'ngDialog',
    		'cfpLoadingBar',
    		'$timeout',
    		'uiGridConstants',
    		'kwitansiPengeluaranService',
    		'authService'
    	];

    var KwitansiPengeluaranController = function (
		$CONST_VAR,
		helperService,
		$scope, 
		toastr,
		uiGridGroupingConstants,
		$location, 
		$routeParams, 
		$http, 
		$log, 
		ngDialog,
		cfpLoadingBar,
		$timeout,
		uiGridConstants,	
		kwitansiPengeluaranService,
		authService
	) 
    {
    	$scope.viewdir = $CONST_VAR.viewsDirectory + 'keuangan/kwitansi-pengeluaran/';
    	var $resourceApi = kwitansiPengeluaranService;
    	var date = helperService.dateTimeZone();

    	function errorHandle(error){
			var msg = error.data.name;
			toastr.warning(msg, 'Warning');
		}

    	var indexController = function(){
    		var gridOptions = {
	    		columnDefs : [
					{ name: 'index', displayName : 'No', width : '50', visible: true,enableFiltering : false ,  enableCellEdit: false},
					{ name: 'no_kwitansi', displayName: 'No Kwitansi', width : '120',  enableCellEdit: false},
					{ name: 'tgl_kwitansi', displayName: 'Tgl Kwitansi', width : '120', enableCellEdit: false},
					{ name: 'nama_penerima', displayName: 'Nama Penerima', enableCellEdit: false},
					{ name: 'nik', displayName: 'NIK', visible: false, enableCellEdit: false},
					{ name: 'keterangan', displayName: 'Keterangan', enableCellEdit: false},
					{ 
	                    name: 'total', 
	                    displayName: 'Total', 
	                    width : '100', 
	                    type: 'number', 
	                    cellFilter: 'number: 0',
	                    aggregationType: uiGridConstants.aggregationTypes.sum, 
	                    aggregationHideLabel: true,
	                    headerCellClass : 'grid-align-right',
	                    cellClass: 'grid-align-right',
	                    footerCellClass : 'grid-align-right',
	                    footerCellFilter : 'number: 0'
	                },
					
					{ name: 'sekolahid', displayName: 'SekolahId', visible: false, enableCellEdit: false},
					{ name: 'tahun_ajaran_id', displayName: 'Tahun Ajaran', visible: false, enableCellEdit: false},
					{ name: 'created_by', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
					{ name: 'updated_by', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
					{ name: 'created_at', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
					{ name: 'updated_at', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
				]
	    	};

	    	var columnActionTpl = 	'<div class="col-action">' + 
		    								'<a href="" ng-click="grid.appScope.onPrintClick(row.entity)" >' + 
		    						  			'<span class="badge bg-orange"><i class="fa fa-print"></i></span>' + 
		    						  		'</a>&nbsp;' +
		    						  		'<a href="" ng-click="grid.appScope.onEditClick(row.entity)" >' + 
		    						  			'<span class="badge bg-blue"><i class="fa fa-edit"></i></span>' + 
		    						  		'</a>&nbsp;' +
		    						  		'<a href="" ng-click="grid.appScope.onDeleteClick(row.entity)" >' + 
		    						  			'<span class="badge bg-red"><i class="fa fa-trash"></i></span>' + 
		    						  		'</a>' +
		    						  	'</div>';
		    gridOptions.columnDefs.push({
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
	            useExternalPagination : true,
	            enableMinHeightCheck : true,
	            minRowsToShow : $CONST_VAR.pageSize,
	            enableGridMenu: true,
	            enableSelectAll: true,
	            virtualizationThreshold: $CONST_VAR.pageSize,
	            enableFiltering: true,
				columnDefs : gridOptions.columnDefs,
				
				// treeRowHeaderAlwaysVisible: false,
	            // showGridFooter: true,
	            showColumnFooter: true,
	            // enableExpandAll  : true,	

	            expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" style="height:{{(row.entity.subGridOptions.data.length * 30) + 50}}px"></div>',
    			expandableRowHeight: 150,
			};

			$scope.filter = {
				date_start : helperService.date(date).firstDay,
				date_end : date //helperService.date(date).lastDay //
			}

			function setGridCollapse(collapse){
				var box = $('#kwitansi-pengeluaran-grid');
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
				var box = $('#kwitansi-pengeluaran-form');
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

			function get(paramdata){
				paramdata['sekolahid'] = authService.getSekolahProfile().sekolahid;
				cfpLoadingBar.start();
				$resourceApi.get(paramdata)
				.then(function (result) {
	                if(result.success){
	                	var curpage = paramdata.page;
	
						for(var idx in result.rows){
							var romnum = parseInt(idx) + 1,
								total = 0;
			                result.rows[idx]["index"] = romnum;
							result.rows[idx].subGridOptions = {
								// showGridFooter: true,
					   			// showColumnFooter: true,
					            minRowsToShow : 5,
								columnDefs: [ 
									{ name: 'index', displayName : 'No', width : '50', visible: true,enableFiltering : false ,  enableCellEdit: false},
									{ name: 'nik', displayName: 'NIK', visible: false, enableCellEdit: false},
									{ name: 'kode', displayName: 'Kode', visible: false, enableCellEdit: false},
									{ name: 'rincian', displayName: 'Rincian', visible: true, enableCellEdit: false},
									{ 
					                    name: 'jumlah', 
					                    displayName: 'Jumlah', 
					                    width : '100', 
					                    type: 'number', 
					                    cellFilter: 'number: 0',
					                    aggregationType: uiGridConstants.aggregationTypes.sum, 
					                    aggregationHideLabel: true,
					                    headerCellClass : 'grid-align-right',
					                    cellClass: 'grid-align-right',
					                    footerCellClass : 'grid-align-right',
					                    footerCellFilter : 'number: 0'
					                },
								],
								// data: result.rows[idx].details
							}
							for(var index in result.rows[idx].details){
								var subromnum = parseInt(index) + 1;
								result.rows[idx].details[index]["index"] = subromnum;
								total += parseInt(result.rows[idx].details[index].jumlah);
							}
							result.rows[idx].subGridOptions.data = result.rows[idx].details;
							result.rows[idx]["total"] = total;
						}
			            $scope.grid.data = result.rows;
			            $scope.grid.totalItems = result.total;
						$scope.grid.paginationCurrentPage = curpage;
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
					get({
						page : 1,
						perPage : $CONST_VAR.pageSize
					});
	            }, errorHandle);
			}

			this.init = function(){
				get({
					page : 1,
					'per-page' : $CONST_VAR.pageSize,
					date_start : $scope.filter.date_start,
					date_end : $scope.filter.date_end
				});
			}

			$scope.grid.onRegisterApi = function(gridApi){
				$scope.gridApi = gridApi;
				gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
					$scope.grid.pageNumber = newPage;
					$scope.grid.pageSize = pageSize;
					$scope.grid.virtualizationThreshold = pageSize; 

					get({
						page : newPage,
						'per-page' : $scope.grid.virtualizationThreshold,
						date_start : $scope.filter.date_start,
						date_end : $scope.filter.date_end
					});
				});
				gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {               
		            row.expandedRowHeight = (row.entity.subGridOptions.data.length * 30) + 51;
		        });
		    }

			$scope.onAddClick = function(event){
				setFormCollapse(false);
				setGridCollapse(true);
				reset();
				refreshNo();
			}

			$scope.onSearchClick = function(event){
				if($scope.filter.date_start == '' || $scope.filter.date_start == null){
					toastr.warning('Tgl Awal tidak boleh kosong.', 'Warning');
					return false;
				}

				if($scope.filter.date_end == '' || $scope.filter.date_end == null){
					toastr.warning('Tgl Akhir tidak boleh kosong.', 'Warning');
					return false;
				}
				get({
					page : 1,
					'per-page' : $CONST_VAR.pageSize,
					date_start : $scope.filter.date_start,
					date_end : $scope.filter.date_end
				});
			}

			$scope.onShowClick = function(event){
				setFormCollapse(true);
				setGridCollapse(false);
				reset();
			}

			$scope.onEditClick = function(rowdata){
				$location.path( "/keuangan/kwitansi-pengeluaran/edit/" + rowdata.no_kwitansi);
			}

			$scope.onDeleteClick = function(rowdata){
				var del = confirm("Anda yakin akan menghapus data `" + rowdata.no_kwitansi + "`");
				if (del == true) {
				    deleteData(rowdata.no_kwitansi);
				} 
			}
    	}

    	function printElement(elem) {
			var domClone = elem.cloneNode(true);

			var $printSection = document.getElementById("printSection");
			if ($printSection) {
				$printSection.innerHTML = "";
			}else{
				$printSection = document.createElement("div");
				$printSection.id = "printSection";
				document.body.appendChild($printSection);
			}
			
			// $printSection.appendChild(domClone);
			$printSection.innerHTML = domClone.innerHTML;
			window.print();
		}

		$scope.print = function(divName){
			printElement(document.getElementById(divName));
		}

		function printClick(rowdata){
			var date = helperService.dateTimeZone();;
			cfpLoadingBar.start();
			$resourceApi.getDetail({
				no_kwitansi : rowdata.no_kwitansi
			})
			.then(function (result) {
	            if(result.success){
	            	$scope.rowHeader = rowdata;
	            	$scope.rowDetail = result.rows;
	            	$scope.rowPrintTotal = function(){
	            		var total = 0;
	            		for(var idx in $scope.rowDetail){
	            			total += parseInt( $scope.rowDetail[idx].jumlah );
	            		}
						return  total;
					}
					$scope.rowTerbilang = helperService.terbilang($scope.rowPrintTotal());
					$scope.profil = authService.getProfile();
					$scope.sekolahProfil = authService.getSekolahProfile();
					$scope.tanggal  = date.getDate() + ' ' + 
                            helperService.getMonthName(date.getMonth()) + ' ' + 
                            date.getFullYear();
                    $scope.titleadmin = (authService.getSekolahProfile().sekolahid == 1) ? 'Admin SDIT' : 'Admin SMPIT';
			        ngDialog.open({
			            template: $scope.viewdir + 'print.html',
			            className: 'ngdialog-theme-flat dialog-custom1 dialog-gray custom-width-80',
			            scope: $scope,
			            width: '100%',
			            height: '100%'
			        });
				}
				cfpLoadingBar.complete();
	        }, function(error){
	        	toastr.warning('Rincian Kwitansi tidak bisa dimuat.', 'Warning');
	        	cfpLoadingBar.complete();
	        });
		}

		$scope.onPrintClick = function(rowdata){
			printClick(rowdata);
		}
    	
    	var addEditController = function(){
    		$scope.month = helperService.month().options;
	    	$scope.form = {
				no_kwitansi : '',
				tgl_kwitansi : date,
				nama_penerima : '',
				keterangan : '',
				nik : '',
				sekolahid : authService.getSekolahProfile().sekolahid,
				tahun_ajaran_id : authService.getSekolahProfile().tahun_ajaran_id,
				created_by : null,
				updated_by : null,
				created_at : null,
				updated_at : null
			};

			$scope.ActionBtn = {
				cancel : true,
				save : true	
			}

			$scope.gridDetailDirtyRows = [];
			var columnDetailActionTpl = 	'<div class="col-action">' + 
		    								'<a href="" ng-click="grid.appScope.onDeleteDetailClick(row.entity)" >' + 
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
						aggregationHideLabel: true,
						footerCellFilter : 'number: 0'
					},
					{ name: 'created_at', displayName: 'Created At', visible: false, width : '100',  enableCellEdit: false},
					{ name: 'updated_at', displayName: 'Updated At', visible: false, width : '100',  enableCellEdit: false},
					{ name: 'flag', displayName: '', visible: false, width : '100',  enableCellEdit: false}
				],
			    onRegisterApi: function(gridApi){
					$scope.gridApi = gridApi;
					gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
						if(oldValue != newValue && (parseInt(newValue))){
							$scope.gridDetailDirtyRows[rowEntity.index] = rowEntity;
						}else if(colDef.name == 'rincian' && oldValue != newValue && rowEntity != null){
							$scope.gridDetailDirtyRows[rowEntity.index] = rowEntity;
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

			function addDataDetail(detail, idx){
				var index = (typeof idx != 'undefined') ? idx : $scope.gridDetail.data.length + 1;
				$scope.gridDetail.data.push({
					"index": index,
					"kode": (typeof detail != 'undefined') ? detail.kode : '',
					"no_kwitansi": $scope.form.no_kwitansi,
					"rincian": (typeof detail != 'undefined') ? detail.rincian : '',
					"jumlah": (typeof detail != 'undefined') ? detail.jumlah : 0,
					"flag": 1,
				});
			}

			function reset(){
				$scope.form.tgl_kwitansi = date;
				$scope.form.nama_penerima = '';
				$scope.form.nik = '';
				$scope.form.keterangan = '';
				$scope.form.sekolahid = authService.getSekolahProfile().sekolahid;
				$scope.form.tahun_ajaran_id = authService.getSekolahProfile().tahun_ajaran_id;
				$scope.form.created_by = '';
				$scope.form.updated_by = '';
				$scope.form.created_at = null;
				$scope.form.updated_at = null;

				$scope.gridDetail.data = [
					{
						index : 1,
						kode : '',
						no_kwitansi : $scope.form.no_kwitansi,
						rincian : '',
						jumlah : 0,
						flag : 1
					}
				];

				$scope.ActionBtn = {
					cancel : true,
					save : true	
				};
			}

			function refreshNo(){
				$resourceApi.getNewNoKwitansi({
					sekolahid : authService.getSekolahProfile().sekolahid
				})
				.then(function (result) {
		            if(result.success){
			            $scope.form.no_kwitansi = result.rows;
			            addDataDetail();
					}
		        }, function(error){
		        	toastr.warning('No Kwitansi tidak bisa dimuat. Silahkan klik tombol tambah', 'Warning');
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
		            	if(result.rows.length <= 0 )return false;
		            	
		            	angular.forEach(result.rows, function(dt, index) {
							var romnum = index + 1;
			                result.rows[index]["index"] = romnum;
			                result.rows[index]["jumlah"] = parseInt(result.rows[index]["jumlah"]);
			                result.rows[index]["flag"] = 1;
			                $scope.gridDetailDirtyRows[romnum] = result.rows[index];
			            })
			            $scope.gridDetail.data = result.rows;
			            // angular.forEach($scope.gridDetail.data, function(rowEntity, index) {
			            //     $scope.gridDetailDirtyRows.push(rowEntity);
			            // })
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

				// return; 
				var params = {
					form : $scope.form,
					grid : $scope.gridDetailDirtyRows
				}
				params.form.tgl_kwitansi = helperService.dateToString(params.form.tgl_kwitansi);
				
				function success(result){
					if(result.success){
						toastr.success('Data telah tersimpan', 'Success');
						$scope.form.no_kwitansi = result.rows;
						$scope.ActionBtn = {
							cancel : false,
							save : false	
						}
						printClick($scope.form);
						// reset();
						// refreshNo();
						cfpLoadingBar.complete();
						// $location.path( "/keuangan/kwitansi-pengeluaran/");
					}else{
						toastr.error('Data gagal tersimpan.<br/>' + result.message, 'Error');
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

			$scope.onResetClick = function(event){
				$location.path( "/keuangan/kwitansi-pengeluaran/");
			}

			$scope.onAddDetailClick = function(event){
				addDataDetail();
			}

			$scope.onDeleteDetailClick = function(rowdata){
				var idx = $scope.gridDetail.data.indexOf(rowdata),
					idxdirty = $scope.gridDetailDirtyRows.indexOf(rowdata);
				$scope.gridDetail.data.splice(idx,1);
				// $scope.gridDetailDirtyRows.splice(idxdirty,1);
				if($scope.gridDetailDirtyRows.length > 0){
					$scope.gridDetailDirtyRows[idxdirty].flag = 0;
				}
			}

			$scope.onAddClick = function(){
				refreshNo();
				reset();
			}
    	}

    	var controller;
		switch($location.$$url){
			case '/keuangan/kwitansi-pengeluaran/add' :
			console.log();
				controller = new addEditController();
				break;
			case '/keuangan/kwitansi-pengeluaran/edit/' + $routeParams.id :
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
    KwitansiPengeluaranController.$inject = injectParams;

    app.register.controller('KwitansiPengeluaranController', KwitansiPengeluaranController);
});