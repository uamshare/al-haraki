'use strict';


define(['app'], function (app) {
	var injectParams = [
			'$CONST_VAR',
    		'$scope', 
    		'$location', 
    		'$routeParams', 
    		'$http', 
    		'$log', 
    		'$timeout'
    	];

    var InfotagihanController = function (
    		$CONST_VAR,
    		$scope, 
    		$location, 
    		$routeParams, 
    		$http, 
    		$log, 
    		$timeout
    	) 
    {
    	$scope.viewdir = $CONST_VAR.viewsDirectory + 'keuangan/info-tagihan/';

    	/******************* GRID CONFIG **********************************/
    	var grid = {
    		columnDefs : [
				{ name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
				{ name: 'id', displayName: 'ID', visible: false, width : '50' ,  enableCellEdit: false},
				{ name: 'idrombel', displayName: 'Id Rombel', visible: false, width : '50',  enableCellEdit: false},
				{ name: 'siswaid', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
				{ name: 'kelasid', displayName: 'KelasId', visible: false, width : '50',  enableCellEdit: false},
				{ name: 'nama_siswa', displayName: 'Nama Siswa', width : '300',  enableCellEdit: false},
				{ name: 'year_ajaran_id', displayName: 'year Ajaran', visible: false, width : '50',  enableCellEdit: false},
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
    	}
		$scope.grid = { 
    		enableMinHeightCheck : true,
			minRowsToShow : 20,
			enableGridMenu: true,
			enableSelectAll: true,
			virtualizationThreshold: 20,
			enableFiltering: true,
			enableCellEditOnFocus: true,
			columnDefs : grid.columnDefs,
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

		$scope.gridEdit = { 
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
				gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
					if(oldValue != newValue && (parseInt(newValue))){
						$scope.save(rowEntity);
					}
					$scope.$apply();
				});
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
		
		$scope.month = {
			options: [
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
			],
			selected: null,
			year : null
		};

		$scope.month_start = {
			options: [
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
			],
			selected: null
		};
		$scope.month_end = {
			options: [
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
			],
			selected: null
		};
		/*********************** Action ******************************/
		$scope.getData = function(data){
			$http.get($CONST_VAR.restDirectory + 'tagihaninfoinput/list',{
				params : data
			})
			.success(function(data, status, header) {
				var header = header();
				if(data.success){
					angular.forEach(data.rows, function(dt, index) {
						var romnum = index + 1;
		                data.rows[index]["index"] = romnum;

		                data.rows[index]["spp"] = parseInt(data.rows[index]["spp"]);
		                data.rows[index]["komite_sekolah"] = parseInt(data.rows[index]["komite_sekolah"]);
		                data.rows[index]["catering"] = parseInt(data.rows[index]["catering"]);
		                data.rows[index]["keb_siswa"] = parseInt(data.rows[index]["keb_siswa"]);
		                data.rows[index]["ekskul"] = parseInt(data.rows[index]["ekskul"]);
		            })
		            $scope.grid.data = data.rows;
				}
			});
		}

		$scope.getDataByMonth = function(paramdata){
			$http.get($CONST_VAR.restDirectory + 'tagihaninfoinput/listbymonth',{
				params : paramdata
			})
			.success(function(data, status, header) {
				var header = header();
				if(data.success){
					angular.forEach(data.rows, function(dt, index) {
						var romnum = index + 1;
		                data.rows[index]["index"] = romnum;

		                data.rows[index]["spp"] = parseInt(data.rows[index]["spp"]);
		                data.rows[index]["komite_sekolah"] = parseInt(data.rows[index]["komite_sekolah"]);
		                data.rows[index]["catering"] = parseInt(data.rows[index]["catering"]);
		                data.rows[index]["keb_siswa"] = parseInt(data.rows[index]["keb_siswa"]);
		                data.rows[index]["ekskul"] = parseInt(data.rows[index]["ekskul"]);
		            })
		            $scope.gridEdit.data = data.rows;
		            $scope.kelas.selected = paramdata.kelasid;
		            $scope.month_start.selected = paramdata.month;
		            // console.log($scope.kelas.options);
				}
			});
		}

		$scope.onSearchClick = function (event) {
			if($scope.kelas.selected){
				$scope.getData({
	    			'page' : 1,
					'per-page' : 0,
					'kelasid' : $scope.kelas.selected,
					'month' : $scope.month.selected,
					'year' : $scope.month.year
	    		});
			}else{
				alert('Silahkan pilih kelas');
			}
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

		/**
		 * Save data 
		 * @param rowData Object, data row selected
		 */
		$scope.save = function(rowData){
			if(rowData.id){
				$http.put($CONST_VAR.restDirectory + 'tagihaninfoinputs/' + rowData.id,rowData)
				.success(function(data, status, header) {
					$scope.getData({
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
					$scope.getData($scope.grid.pageNumber);
				})
				.error(function (data, status, header, config) {

            	});
			}
		},

		$scope.delete = function(){
		},

		$scope.onBtnHistoryClick = function (event) {
    		console.log(event);
    	}
		
		$scope.$on('$viewContentLoaded', function(){
			init();
		});

		function init(){
			var date = new Date();
			$http.get($CONST_VAR.restDirectory + 'kelas/list',{
				params : {
					sekolahid : 2,
					kelasid : $routeParams.idkelas
				}
			})
			.success(function(data, status, header) {
				var header = header();
				if(data.success){
					$scope.kelas.options = data.rows;
				}
				$scope.month.selected = date.getMonth();
				$scope.month.year = date.getFullYear();
			})
			.error(function (data, status, header, config) {
				alert('Unable to load data kelas')
        	});
        	if($routeParams.idkelas){
        		$scope.getDataByMonth({
        			'page' : 1,
					'per-page' : 0,
					'kelasid' : $routeParams.idkelas,
					'month' : $routeParams.month
        		});
        	}
		}
		
    }
    InfotagihanController.$inject = injectParams;

    app.register.controller('InfotagihanController', InfotagihanController);
});