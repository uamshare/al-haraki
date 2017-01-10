'use strict';

define(['app'], function (app) {
	var injectParams = [
			'$CONST_VAR',
			'helperService',
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
    		'jurnalHarianService',
    		'authService',
    		'COAService'
    	];

    var JurnalHarianController = function (
		$CONST_VAR,
		helperService,
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
		jurnalHarianService,
		authService,
		COAService
	) 
    {
    	$scope.viewdir = $CONST_VAR.viewsDirectory + 'akuntansi/jurnal-harian/';
    	var $resourceApi = jurnalHarianService;
    	var date = helperService.dateTimeZone();

    	function errorHandle(error){
			var msg = error.data.name;
			toastr.warning(msg, 'Warning');
		}

    	var indexController = function(){
    		var gridOptions = {
	    		columnDefs : [
					{ name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
					{ name: 'tjmhno', displayName: 'No Jurnal', width : '120',  enableCellEdit: false},
					{ name: 'tjmhdt', displayName: 'Tgl Jurnal', width : '120',  enableCellEdit: false},
					{ name: 'tjmhdesc', displayName: 'Keterangan', enableCellEdit: false},
					{ name: 'sekolahid', displayName: 'SekolahId', visible: false, enableCellEdit: false},
					{ name: 'tahun_ajaran_id', displayName: 'Tahun Ajaran', visible: false, enableCellEdit: false},
					{ name: 'created_by', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
					{ name: 'updated_by', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
					{ name: 'created_at', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
					{ name: 'updated_at', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
				]
	    	};

	    	var columnActionTpl = 	'<div class="col-action">' + 
		    								// '<a href="" ng-click="grid.appScope.onPrintClick(row.entity)" >' + 
		    						  // 			'<span class="badge bg-orange"><i class="fa fa-print"></i></span>' + 
		    						  // 		'</a>&nbsp;' +
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
			};

			function setGridCollapse(collapse){
				var box = $('#jurnal-harian-grid');
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
				var box = $('#jurnal-harian-form');
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
						angular.forEach(result.rows, function(dt, index) {
							var romnum = index + 1;
			                result.rows[index]["index"] = romnum;
			            })
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
						perPage : 20
					});
	            }, errorHandle);
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

			this.init = function(){
				get({
					page : 1,
					perPage : 20
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

			$scope.onEditClick = function(rowdata){
				$location.path( "/akuntansi/jurnal-harian/edit/" + rowdata.tjmhno);
			}

			$scope.onDeleteClick = function(rowdata){
				var del = confirm("Anda yakin akan menghapus data `" + rowdata.tjmhno + "`");
				if (del == true) {
				    deleteData(rowdata.tjmhno);
				} 
			}

			$scope.onPrintClick = function(rowdata){
				var date = helperService.dateTimeZone();
				cfpLoadingBar.start();
				$resourceApi.getDetail({
					tjmhno : rowdata.tjmhno
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
						$scope.monthPrint = date.getMonth();
						$scope.monthYear = date.getFullYear();

				        ngDialog.open({
				            template: $scope.viewdir + 'print.html',
				            className: 'ngdialog-theme-flat',
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
    	}

    	var addEditController = function(){
    		$scope.month = helperService.month().options;
	    	$scope.form = {
				tjmhno : '',
				tjmhdt : date,
				tjmhdesc : '',
				sekolahid : authService.getSekolahProfile().sekolahid,
				tahun_ajaran_id : authService.getSekolahProfile().tahun_ajaran_id,
				created_by : null,
				updated_by : null,
				created_at : null,
				updated_at : null
			};

			$scope.gridDetailDirtyRows = [];
			var columnDetailActionTpl = 	'<div class="col-action">' + 
		    								'<a href="" ng-click="grid.appScope.onDeleteDetailClick(row.entity)" >' + 
		    						  			'<span class="badge bg-red"><i class="fa fa-trash"></i></span>' + 
		    						  		'</a>' +
		    						  	'</div>';
			$scope.coa = [];
			$scope.coaIndex = [];
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
					{ name: 'tjmdid', displayName: 'Id', visible: false, width : '50',  enableCellEdit: false},
					{ name: 'tjmhno', displayName: 'No Junral', visible: false, width : '120',  enableCellEdit: false},
					{ name: 'tjmddesc', displayName: 'Keterangan', width : '120', visible: false, enableCellEdit: false},
					{ name: 'mcoadno', displayName: 'No Akun', width : '120',
						editableCellTemplate: 'ui-grid/dropdownEditor',
						editDropdownValueLabel: 'mcoadno', 
						editDropdownOptionsFunction: function(rowEntity, colDef){
							return $scope.coa;
						},
				    },
					{ name: 'mcoadname', displayName: 'Nama Akun', enableCellEdit: false},
					{ 
						name: 'debet', 
						displayName: 'Debet', 
						width : '150',
						type: 'number', 
						cellFilter: 'number: 0',
						aggregationType: uiGridConstants.aggregationTypes.sum,
						aggregationHideLabel: true,
						footerCellFilter : 'number: 0'
					},
					{ 
						name: 'kredit', 
						displayName: 'Kredit', 
						width : '150',
						type: 'number', 
						cellFilter: 'number: 0',
						aggregationType: uiGridConstants.aggregationTypes.sum,
						aggregationHideLabel: true,
						footerCellFilter : 'number: 0'
					},
					{ name: 'created_at', displayName: 'Created At', visible: false, width : '100',  enableCellEdit: false},
					{ name: 'updated_at', displayName: 'Updated At', visible: false, width : '100',  enableCellEdit: false},
					{ name: 'flag', displayName: '', visible: false, width : '100',  enableCellEdit: false},
					{ name: 'mcoadnoold', displayName: 'Old No', visible: false, width : '120',  enableCellEdit: false}
				],
				//Export
			    onRegisterApi: function(gridApi){
					$scope.gridApi = gridApi;
					gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
						rowEntity.coalist = $scope.coa
						if(['mcoadno','tjmddesc'].indexOf(colDef.name) > -1 && 
								oldValue != newValue && rowEntity != null){
							if(colDef.name == 'mcoadno'){
								var idx = $scope.coaIndex.indexOf(newValue);
								rowEntity.mcoadname = (typeof $scope.coa[idx] != 'undefined') ? $scope.coa[idx].mcoadname : '';
							}
							var rowdata = rowEntity;
							delete rowdata['coalist'];
							$scope.gridDetailDirtyRows[rowEntity.index - 1] = rowdata;
						}else if(['debet','kredit'].indexOf(colDef.name) > -1 && 
									oldValue != newValue && (parseInt(newValue))){
							var rowdata = rowEntity;
							var rowdata = rowEntity;
							delete rowdata['coalist'];
							$scope.gridDetailDirtyRows[rowEntity.index - 1] = rowdata;
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

			function getcoa(){
				COAService.getList()
				.then(function (result) {
		            if(result.success){
			            for(var idx in result.rows){
			            	$scope.coa[idx] = {
			            		id : result.rows[idx].mcoadno,
			            		mcoadno : result.rows[idx].mcoadno,
			            		mcoadname : result.rows[idx].mcoadname
			            	};
			            	$scope.coaIndex[idx] = result.rows[idx].mcoadno;
			            }
					}
		        }, function(error){
		        	toastr.warning('No Jurnal tidak bisa dimuat. Silahkan klik tombol tambah', 'Warning');
		        });
			}
			getcoa();

			function addDataDetail(detail, idx){
				var index = (typeof idx != 'undefined') ? idx : $scope.gridDetail.data.length + 1;
				$scope.gridDetail.data.push({
					"index": index,
					"mcoadno": (typeof detail != 'undefined') ? detail.mcoadno : '',
					"mcoadname": (typeof detail != 'undefined') ? detail.mcoadname : '',
					"tjmhno": $scope.form.tjmhno,
					"tjmddesc": (typeof detail != 'undefined') ? detail.tjmddesc : '',
					"debet": (typeof detail != 'undefined') ? detail.debet : 0,
					"kredit": (typeof detail != 'undefined') ? detail.kredit : 0,
					"flag": 1,
				});
			}

			function reset(){
				$scope.form.tjmhdt = date;
				$scope.form.tjmhdesc = '';
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
						tjmhno : $scope.form.tjmhno,
						rincian : '',
						jumlah : 0,
						flag : 1
					}
				]
			}

			function refreshNo(){
				$resourceApi.getNewNoKwitansi({
					sekolahid : authService.getSekolahProfile().sekolahid
				})
				.then(function (result) {
		            if(result.success){
			            $scope.form.tjmhno = result.rows;
			            addDataDetail();
					}
		        }, function(error){
		        	toastr.warning('No Jurnal tidak bisa dimuat. Silahkan klik tombol tambah', 'Warning');
		        });
			}

			function getRowDetailByNo(noKwitansi){
				cfpLoadingBar.start();
				$resourceApi.getDetail({
					tjmhno : noKwitansi
				})
				.then(function (result) {
		            if(result.success){
		            	$scope.gridDetail.data = [];
		            	if(result.rows.length <= 0 )return false;
		            	
		            	angular.forEach(result.rows, function(dt, index) {
							var romnum = index + 1;
			                result.rows[index]["index"] = romnum;
			                result.rows[index]["mcoadnoold"] = result.rows[index]["mcoadno"];
			                result.rows[index]["jumlah"] = parseInt(result.rows[index]["jumlah"]);
			                result.rows[index]["flag"] = 1;
			                $scope.gridDetailDirtyRows[index] = result.rows[index];
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
						$scope.form.tjmhno = rowdata.tjmhno;
						$scope.form.tjmhdt = rowdata.tjmhdt;
						$scope.form.tjmhdesc = rowdata.tjmhdesc;
						// $scope.form.keterangan = rowdata.keterangan;
						// $scope.form.nik = rowdata.nik;
						$scope.form.sekolahid = rowdata.sekolahid;
						$scope.form.tahun_ajaran_id = rowdata.tahun_ajaran_id;
						$scope.form.created_by = rowdata.created_by;
						$scope.form.updated_by = rowdata.updated_by;
						$scope.form.created_at = rowdata.created_at;
						$scope.form.updated_at = rowdata.updated_at;

						getRowDetailByNo(rowdata.tjmhno);
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
				if($scope.form.tjmhno == '' || $scope.form.tjmhno == null){
					toastr.warning('No Kwitansi tidak boleh kosong.', 'Warning');
					return false;
				}

				if($scope.form.tjmhdt == '' || $scope.form.tjmhdt == null){
					toastr.warning('Tgl Kwitansi tidak boleh kosong.', 'Warning');
					return false;
				}

				if($scope.gridDetailDirtyRows.length <= 0){
					toastr.warning('Rincian kwitansi belum diisi.', 'Warning');
					return false;
				}

				var debetsum = $scope.gridApi.grid.columns[7].getAggregationValue();
				var kreditsum = $scope.gridApi.grid.columns[8].getAggregationValue();
				
				if(debetsum == 0 && kreditsum == 0){
					toastr.warning('Debet / Kredit belum diisi.', 'Warning');
					return false;
				}

				if(debetsum != kreditsum){
					toastr.warning('Total Debet tidak sama dengan total Kredit.', 'Warning');
					return false;
				}

				var params = {
					form : $scope.form,
					grid : $scope.gridDetailDirtyRows
				}
				params.form.tjmhdt = helperService.dateToString(params.form.tjmhdt);
				
				function success(result){
					if(result.success){
						toastr.success('Data telah tersimpan', 'Success');
						reset();
						refreshNo();
						cfpLoadingBar.complete();
						$location.path( "/akuntansi/jurnal-harian/");
						cfpLoadingBar.complete();
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
				$location.path( "/akuntansi/jurnal-harian/");
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
    	}

    	var controller;
		switch($location.$$url){
			case '/akuntansi/jurnal-harian/add' :
				controller = new addEditController();
				break;
			case '/akuntansi/jurnal-harian/edit/' + $routeParams.id :
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
    JurnalHarianController.$inject = injectParams;

    app.register.controller('JurnalHarianController', JurnalHarianController);
});