'use strict';

define(['app'], function (app) {
	var injectParams = [
			'$CONST_VAR',
			'helperService',
    		'$scope', 
    		'toastr',
    		'toastrConfig',
    		'$location', 
    		'$routeParams', 
    		'$http', 
    		'$log', 
    		'ngDialog',
    		'cfpLoadingBar',
    		'$timeout',
    		'uiGridConstants',
    		'TagihanInfoService',
    		'authService',
    		'TahunAjaranService'
    	];

    var TagihanInfoController = function (
		$CONST_VAR,
		helperService,
		$scope, 
		toastr,
		toastrConfig,
		$location, 
		$routeParams, 
		$http, 
		$log, 
		ngDialog,
		cfpLoadingBar,
		$timeout,
		uiGridConstants,
		TagihanInfoService,
		authService,
		TahunAjaranService
	) 
    {
    	$scope.viewdir = $CONST_VAR.viewsDirectory + 'keuangan/info-tagihan/';
    	var $resourceApi = TagihanInfoService;
    	var date = new Date();
		var sekolahProfil = authService.getSekolahProfile();
    	/******************* GRID CONFIG **********************************/
    	// $scope.$broadcast('redirectToLogin', null);


    	var gridOptions = {
    		columnDefs : [
    			{ 
    				name: 'isCheck', 
    				displayName: 'Check', 
    				type: 'boolean',
    				headerCellTemplate: '<div style="padding : 5px;">' + 
    										'<input class="custome1" type="checkbox" ng-model="parentCheck" ' +
    											'ng-change="grid.appScope.toggleSelectAll(parentCheck)"/>' +
    									'</div>',
    				cellTemplate: '<input type="checkbox" ng-model="row.entity.isCheck"">'
    			},
				{ name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
				{ name: 'id', displayName: 'ID', visible: false, width : '50' ,  enableCellEdit: false},
				{ name: 'idrombel', displayName: 'Id Rombel', visible: false, width : '50',  enableCellEdit: false},
				{ name: 'siswaid', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
				{ name: 'kelasid', displayName: 'KelasId', visible: false, width : '50',  enableCellEdit: false},
				{ name: 'nama_siswa', displayName: 'Nama Siswa', width : '300',  enableCellEdit: false},
				{ name: 'tahun_ajaran_id', displayName: 'Tahun Ajaran', visible: false, width : '50',  enableCellEdit: false},
				{ 
					name: 'spp', 
					displayName: 'SPP', 
					width : '100', 
					// enableCellEdit: true,
					type: 'number', 
					cellFilter: 'number: 0'
				},
				{ name: 'komite_sekolah', displayName: 'Komite Sekolah', width : '100', enableCellEdit: true, type: 'number', cellFilter: 'number: 0'},
				{ name: 'catering', displayName: 'Catering', width : '100', enableCellEdit: true, type: 'number', cellFilter: 'number: 0'},
				{ name: 'keb_siswa', displayName: 'Keb. Siswa', width : '100', enableCellEdit: true, type: 'number', cellFilter: 'number: 0'},
				{ name: 'ekskul', displayName: 'Ekskul', width : '100', enableCellEdit: true, type: 'number', cellFilter: 'number: 0'},
				{ name: 'keterangan', displayName: 'Keterangan'},
				{ name: 'created_at', displayName: 'Created At', visible: false, width : '100',  enableCellEdit: false},
				{ name: 'updated_at', displayName: 'Updated At', visible: false, width : '100',  enableCellEdit: false}
			]
    	};

    	

    	if($routeParams.idkelas){
    	}else{
     		var columnActionTpl = 	'<div class="col-action">' + 
	    								'<a href="" ng-click="grid.appScope.gridAction.onPrintClick(row.entity)"' + 
	    						  			' data-toggle="tooltip" data-original-title="Cetak Info Tagihan">' + 
	    						  			'<span class="badge bg-orange"><i class="fa fa-print"></i></span>' + 
	    						  		'</a>' +
	    						  	'</div>';
    		gridOptions.columnDefs.push({
    			name :' ',
    			enableFiltering : false,
    			width : '50',
				cellTemplate : columnActionTpl
    		});
    	}

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
			exporterCsvFilename: 'coa.csv',
		    exporterPdfDefaultStyle: {
		    	fontSize: 9
		   	},
		    exporterPdfTableStyle: {
		    	margin: [0, 5, 0, 15]
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

		$scope.gridDirtyRows = [];
		$scope.gridEdit = { 
    		enableMinHeightCheck : true,
			minRowsToShow : 20,
			enableGridMenu: true,
			enableSelectAll: true,
			virtualizationThreshold: 20,
			enableFiltering: true,
			enableCellEditOnFocus: true,
			columnDefs : [
				{ name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
				{ name: 'id', displayName: 'ID', visible: false, width : '50' ,  enableCellEdit: false},
				{ name: 'idrombel', displayName: 'Id Rombel', visible: false, width : '50',  enableCellEdit: false},
				{ name: 'siswaid', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
				{ name: 'kelasid', displayName: 'KelasId', visible: false, width : '50',  enableCellEdit: false},
				{ name: 'nama_siswa', displayName: 'Nama Siswa', width : '300',  enableCellEdit: false},
				{ name: 'tahun_ajaran_id', displayName: 'Tahun Ajaran', visible: false, width : '50',  enableCellEdit: false},
				{ 
					name: 'spp', 
					displayName: 'SPP', 
					width : '100', 
					// enableCellEdit: true,
					type: 'number', 
					cellFilter: 'number: 0'
				},
				{ name: 'komite_sekolah', displayName: 'Komite Sekolah', width : '100', enableCellEdit: true, type: 'number', cellFilter: 'number: 0'},
				{ name: 'catering', displayName: 'Catering', width : '100', enableCellEdit: true, type: 'number', cellFilter: 'number: 0'},
				{ name: 'keb_siswa', displayName: 'Keb. Siswa', width : '100', enableCellEdit: true, type: 'number', cellFilter: 'number: 0'},
				{ name: 'ekskul', displayName: 'Ekskul', width : '100', enableCellEdit: true, type: 'number', cellFilter: 'number: 0'},
				{ name: 'keterangan', displayName: 'Keterangan', enableCellEdit: true, type: 'string'},
				{ name: 'created_at', displayName: 'Created At', visible: false, width : '100',  enableCellEdit: false},
				{ name: 'updated_at', displayName: 'Updated At', visible: false, width : '100',  enableCellEdit: false},
				{ name: 'created_by', displayName: 'Created By', visible: false, width : '100',  enableCellEdit: false},
				{ name: 'updated_by', displayName: 'Updated By', visible: false, width : '100',  enableCellEdit: false}
			],
		    onRegisterApi: function(gridApi){
		      	$scope.gridApi = gridApi;
				gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
					if(oldValue != newValue && ((parseInt(newValue) || newValue == 0)) && rowEntity != null){
						$scope.gridDirtyRows[rowEntity.idrombel] = rowEntity;
					}else if(colDef.name == 'keterangan' && oldValue != newValue && rowEntity != null){
						$scope.gridDirtyRows[rowEntity.idrombel] = rowEntity;
					}
					$scope.$apply();
				});
				// gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
		    }
		};
		
		/******************* GRID CONFIG **********************************/
    	
    	/*********************** Filter Grid ******************************/
		$scope.kelas = {
			options: [
				{id: 24, nama_kelas: 'Al Kautsar'},
				{id: 25, nama_kelas: 'An Naba'},
				{id: 26, nama_kelas: 'Ash Shafaat'}
			],
			selected: null
		};
		
		$scope.month = helperService.month();
		$scope.month_start = helperService.month();
		$scope.month_end = helperService.month();
		$scope.jenis_tagihan = 1;
		$scope.tahun_ajaran_id = sekolahProfil.tahun_ajaran_id;
		$scope.tahun_ajaran_name = sekolahProfil.tahun_ajaran;
		$scope.tahun_ajaran_list = [];
		/*********************** Action ******************************/
		

		function errorHandle(error){
			var msg = error.data.name;
			toastr.warning(msg, 'Warning');
		}

		

		function getDataInfo(paramdata){
			cfpLoadingBar.start();
			$resourceApi.getListActive(paramdata)
			.then(function (result) {
                if(result.success){
                	if(result.rows.length > 0){
                		angular.forEach(result.rows, function(dt, index) {
							var romnum = index + 1;
			                result.rows[index]["index"] = romnum;

			                result.rows[index]["spp"] = parseInt(result.rows[index]["spp"]);
			                result.rows[index]["komite_sekolah"] = parseInt(result.rows[index]["komite_sekolah"]);
			                result.rows[index]["catering"] = parseInt(result.rows[index]["catering"]);
			                result.rows[index]["keb_siswa"] = parseInt(result.rows[index]["keb_siswa"]);
			                result.rows[index]["ekskul"] = parseInt(result.rows[index]["ekskul"]);
			            })
			            $scope.gridEdit.data = result.rows;
			            $scope.kelas.selected = paramdata.kelasid;

			            $scope.month_start.selected = $routeParams.month;
			            $scope.month_start.year = sekolahProfil.tahun_awal;
			            $scope.month_end.selected = 6;
			            $scope.month_end.year = sekolahProfil.tahun_akhir;
                	}else{
                		toastr.info('Data kosong', 'Info');
                	}
					
				}
				cfpLoadingBar.complete();
            }, errorHandle);
		}

		function getData(paramdata){
			cfpLoadingBar.start();
			$resourceApi.getList(paramdata)
			.then(function (result) {
                if(result.success){
                	if(result.rows.length > 0){
						angular.forEach(result.rows, function(dt, index) {
							var romnum = index + 1;
			                result.rows[index]["index"] = romnum;

			                result.rows[index]["spp"] = parseInt(result.rows[index]["spp"]);
			                result.rows[index]["komite_sekolah"] = parseInt(result.rows[index]["komite_sekolah"]);
			                result.rows[index]["catering"] = parseInt(result.rows[index]["catering"]);
			                result.rows[index]["keb_siswa"] = parseInt(result.rows[index]["keb_siswa"]);
			                result.rows[index]["ekskul"] = parseInt(result.rows[index]["ekskul"]);
			            })
			            $scope.grid.data = result.rows;
			        }else{
			        	toastr.info('Data kosong', 'Info');
			        }
				}
				cfpLoadingBar.complete();
            }, errorHandle);
		}

		/**
		 * Save data 
		 * @param gridData Object, all dirty grid data
		 */
		function saveAll(params){
        	cfpLoadingBar.start();
			$resourceApi.insert(params)
			.then(function (result) {
                if(result.success){
					toastr.success('Data berhasil disimpan', 'Success');
		    		$scope.gridDirtyRows = [];
		    		getDataInfo({
						'kelasid' : $routeParams.idkelas,
						'jenis_tagihan' : $scope.jenis_tagihan
	        		});
	        		// $location.path( "keuangan/info-tagihan");
				}else{
					toastr.warning('Data gagal tersimpan.<br/>' + result.message, 'Warning');
					cfpLoadingBar.complete();
				}
            }, errorHandle);
		}

		$scope.toggleSelectAll = function(checked) {	
	        for (var i = 0; i < $scope.grid.data.length; i++) {
	            $scope.grid.data[i].isCheck = checked;
	        }
	    };
		
		$scope.gridAction = {
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
				$scope.profil = authService.getProfile();
				$scope.monthPrint = date.getMonth();
				$scope.monthYear = date.getFullYear();

		        ngDialog.open({
		            template: $scope.viewdir + 'print.html',
		            className: 'ngdialog-theme-flat',
		            scope: $scope
		        });
			},
			onPrintSelectedClick : function(event){
				var date = new Date();
				$scope.rows = [];
				var index = 0;
				for(var idx in $scope.grid.data){
					if($scope.grid.data[idx].isCheck){
						$scope.rows[index] = $scope.grid.data[idx];
						$scope.rows[index].total = $scope.rows[index].spp + 
									$scope.rows[index].komite_sekolah +
									$scope.rows[index].catering +
									$scope.rows[index].keb_siswa +
									$scope.rows[index].ekskul;
						index++;
					}
				}
				$scope.profil = authService.getProfile();
				$scope.monthPrint = date.getMonth();
				$scope.monthYear = date.getFullYear();

				if($scope.rows.length > 0){
					ngDialog.open({
			            template: $scope.viewdir + 'printMultiple.html',
			            className: 'ngdialog-theme-flat',
			            scope: $scope
			        });
				}
		        
			}
		};

		$scope.onSearchClick = function (event) {
			if($scope.kelas.selected == null || $scope.kelas.selected == ''){
				toastr.warning('Silahkan pilih kelas', 'Warning');
				return false;
			}

			if($scope.month.selected == null || $scope.month.selected == ''){
				toastr.warning('Silahkan pilih bulan', 'Warning');
				return false;
			}else{
				$scope.month.year = ($scope.month.selected >= 1 &&  $scope.month.selected <= 6) ? 
									(sekolahProfil.tahun_akhir) : sekolahProfil.tahun_awal;
			}

			getData({
    			'page' : 1,
				'per-page' : 0,
				'kelasid' : $scope.kelas.selected,
				'month' : $scope.month.selected,
				'year' : $scope.month.year
    		});
    	}
		
		$scope.onSetInfoClick = function(event){
			if(!$scope.kelas.selected){
				alert('Silahkan pilih kelas');
				return false;
			}
			if(!$scope.month.selected){
				alert('Silahkan pilih bulan');
				return false;
			}
			$location.path( "/keuangan/info-tagihan/" + $scope.kelas.selected + '/' + $scope.month.selected );
		}

		$scope.onSaveClick = function(event){
			// console.log($scope.gridDirtyRows);
			// return;
			if($scope.gridDirtyRows != null && $scope.gridDirtyRows.length > 0){
				var params ={
					rows : $scope.gridDirtyRows,
					month_start : $scope.month_start.selected,
					year_start : $scope.month_start.year,
					month_end : $scope.month_end.selected,
					year_end : $scope.month_end.year,
					kelasid : $scope.kelas.selected,
					jenis_tagihan : $scope.jenis_tagihan,
					tahun_ajaran_id : $scope.tahun_ajaran_id,
					sekolahid : authService.getProfile().sekolahid
				}
				saveAll(params);
			}else{
				// alert('And belum melakukan perubahan. Silahkan ubah data info tagihan');
				toastr.info('And belum melakukan perubahan. Silahkan ubah data info tagihan', 'Info');
			}
		}

		/**
		 * Save data 
		 * @param rowData Object, data row selected
		 */
		$scope.save = function(rowData){
			if(rowData.id){
				$http.put($CONST_VAR.restDirectory + 'tagihaninfoinputs/' + rowData.id,rowData)
				.success(function(data, status, header) {
					getData({
		    			'page' : 1,
						'per-page' : 0,
						'kelasid' : $scope.kelas.selected,
						'month' : $scope.month.selected,
						'year' : $scope.month.year
		    		});
				})
				.error(function (data, status, header, config) {

            	});
			}else{
				$http.post($CONST_VAR.restDirectory + 'tagihaninfoinputs',rowData)
				.success(function(data, status, header) {
					// var header = header();
					getData($scope.grid.pageNumber);
				})
				.error(function (data, status, header, config) {

            	});
			}
		}

		$scope.delete = function(){
		}

		$scope.onBtnHistoryClick = function (event) {
    		console.log(event);
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

		$scope.onJenisTagihanChange = function(value){
			$scope.jenis_tagihan = value;
			getDataInfo({
				'kelasid' : $routeParams.idkelas,
				'jenis_tagihan' : $scope.jenis_tagihan
    		});
			if($scope.jenis_tagihan == 1){
				$scope.gridEdit.columnDefs[10].visible = false;
				$scope.gridEdit.columnDefs[11].visible = false;
				$scope.gridEdit.columnDefs[7].visible = true;
				$scope.gridEdit.columnDefs[8].visible = true;
				$scope.gridEdit.columnDefs[9].visible = true;
				$scope.form2IsBulanan = true;
			}else{
				$scope.gridEdit.columnDefs[7].visible = false;
				$scope.gridEdit.columnDefs[8].visible = false;
				$scope.gridEdit.columnDefs[9].visible = false;
				$scope.gridEdit.columnDefs[10].visible = true;
				$scope.gridEdit.columnDefs[11].visible = true;
				$scope.form2IsBulanan = false;
			}
			$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
		}

		$scope.form2 = {
			spp : '',
			komite_sekolah : '',
			catering : '',
			keb_siswa : '',
			ekskul : ''
		}
		$scope.form2IsBulanan = true;

		$scope.onAddMultipleClick = function(){
			$scope.form2.spp = '';
			$scope.form2.komite_sekolah = '';
			$scope.form2.catering = '';
			$scope.form2.keb_siswa = '';
			$scope.form2.ekskul = '';

			ngDialog.open({
	            template: $scope.viewdir + 'form2.html',
	            className: 'ngdialog-theme-flat custom-width-50',
	            scope: $scope,
	            width: '300px',
	            height: '100%'
	        });
		}

		$scope.onAddMiltiple = function(){
			for(var idx in $scope.gridEdit.data){
				if($scope.form2IsBulanan){
					$scope.gridEdit.data[idx].spp = $scope.form2.spp;
					$scope.gridEdit.data[idx].komite_sekolah = $scope.form2.komite_sekolah;
					$scope.gridEdit.data[idx].catering = $scope.form2.catering;
				}else{
					$scope.gridEdit.data[idx].keb_siswa = $scope.form2.keb_siswa;
					$scope.gridEdit.data[idx].ekskul = $scope.form2.ekskul;
				}
				$scope.gridDirtyRows[idx] = $scope.gridEdit.data[idx];
			}
			ngDialog.close();
		}

		$scope.onMonthChange = function(value){
			$scope.month_start.year = ($scope.month_start.selected >= 1 &&  $scope.month_start.selected <= 6) ? 
									(sekolahProfil.tahun_akhir) : sekolahProfil.tahun_awal;
			$scope.month_end.year = ($scope.month_end.selected >= 1 &&  $scope.month_end.selected <= 6) ? 
									(sekolahProfil.tahun_akhir) : sekolahProfil.tahun_awal;
			$scope.gridDirtyRows = $scope.gridEdit.data;
		}

		function getTahuunAjaran(){
			TahunAjaranService.getList()
			.then(function (result) {
	            if(result.success){
		            $scope.tahun_ajaran_list = result.rows;
				}
	        }, function(error){
	        	toastr.warning('Tahun Ajaran tidak bisa dimuat. Silahkan klik tombol tambah', 'Warning');
	        });
		}

		function init(){
			$http.get($CONST_VAR.restDirectory + 'kelas/list',{
				params : {
					sekolahid : authService.getProfile().sekolahid,
					kelasid : $routeParams.idkelas,
					'per-page' : 0,
				}
			})
			.success(function(data, status, header) {
				var header = header();
				if(data.success){
					$scope.kelas.options = data.rows;
				}
				$scope.month.selected = helperService.getMonthId(date.getMonth());
				$scope.month.year = date.getFullYear();
			})
			.error(function (data, status, header, config) {
				alert('Unable to load data kelas')
        	});

        	if($routeParams.idkelas){
        		getTahuunAjaran();

        		getDataInfo({
					'kelasid' : $routeParams.idkelas,
					'jenis_tagihan' : $scope.jenis_tagihan
        		});
        		$scope.gridEdit.columnDefs[10].visible = false;
				$scope.gridEdit.columnDefs[11].visible = false;
				$scope.gridEdit.columnDefs[7].visible = true;
				$scope.gridEdit.columnDefs[8].visible = true;
				$scope.gridEdit.columnDefs[9].visible = true;
				$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        	}
		}
		$scope.$on('$viewContentLoaded', function(){
			// init();
		});

		

		$timeout(function() {
			init();
		}, 1000);
    }
    TagihanInfoController.$inject = injectParams;

    app.register.controller('TagihanInfoController', TagihanInfoController);
});