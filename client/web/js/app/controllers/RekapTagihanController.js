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
        // 'ngDialog',
        'cfpLoadingBar',
        '$timeout',
        'uiGridConstants',
        'TagihanInfoService',
        'KelasService',
        'uiGridGroupingConstants',
        'authService'
	];

    var RekapTagihanController = function (
		$CONST_VAR,
        helperService,
        $scope,
        $filter,
        toastr,
        $location, 
        $routeParams, 
        $http, 
        $log, 
        // ngDialog,
        cfpLoadingBar,
        $timeout,
        uiGridConstants,  
        TagihanInfoService,
        KelasService,
        uiGridGroupingConstants,
        authService
	) 
    {
    	$scope.viewdir = $CONST_VAR.viewsDirectory + 'keuangan/rekap-tagihan/';
    	var $resourceApi = TagihanInfoService;
    	var date = new Date();

    	function errorHandle(error){
			var msg = error.data.name;
			toastr.warning(msg, 'Warning');
		}

		$scope.kelas = [
			{id: 24, nama_kelas: 'Al Kautsar'},
			{id: 25, nama_kelas: 'An Naba'},
			{id: 26, nama_kelas: 'Ash Shafaat'}
		];

		$scope.filter = {
			kelas : [],
			month : '',
			year : ''
		}

		var gridOptions = {
            columnDefs : [
                { name: 'index', displayName : 'No', width : '50', visible: false, enableFiltering : false ,  enableCellEdit: false},
                { name: 'id', displayName: 'ID', visible: false, width : '50' ,  enableCellEdit: false},
                { name: 'idrombel', displayName: 'Id Rombel', visible: false, width : '50',  enableCellEdit: false},
                { name: 'siswaid', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
                { 
                    name: 'kelasid', 
                    displayName: 'KelasId', 
                    visible: false, 
                    width : '75',  
                    enableCellEdit: false
                },
                { 
                    name: 'nama_kelas', 
                    grouping: { groupPriority: 1 }, 
                    sort: { priority: 1, direction: 'asc' }, 
                    width: '200',
                },
                { name: 'nama_siswa', displayName: 'Nama Siswa', width : '300',  enableCellEdit: false},
                { name: 'tahun_ajaran_id', displayName: 'Tahun Ajaran', visible: false, width : '50',  enableCellEdit: false},
                { 
                    name: 'spp', 
                    displayName: 'SPP', 
                    width : '100', 
                    type: 'number', 
                    cellFilter: 'number: 0',
                    treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
                    customTreeAggregationFinalizerFn: function( aggregation ) {
                        aggregation.rendered = aggregation.value;
                        return aggregation.rendered;
                    },
                    cellClass: 'grid-align-right',
                    // aggregationType: uiGridConstants.aggregationTypes.sum,
                    // aggregationHideLabel: true,
                    footerCellFilter : 'number: 0',
                    footerCellClass : 'grid-align-right'
                },
                { 
                    name: 'komite_sekolah', 
                    displayName: 'Komite Sekolah', 
                    width : '100', 
                    type: 'number', 
                    cellFilter: 'number: 0',
                    treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
                    customTreeAggregationFinalizerFn: function( aggregation ) {
                        aggregation.rendered = aggregation.value;
                    },
                    cellClass: 'grid-align-right',
                    footerCellClass : 'grid-align-right',
                    footerCellFilter : 'number: 0'
                },
                { 
                    name: 'catering', 
                    displayName: 'Catering', 
                    width : '100', 
                    type: 'number', 
                    cellFilter: 'number: 0',
                    treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
                    customTreeAggregationFinalizerFn: function( aggregation ) {
                        aggregation.rendered = aggregation.value;
                    },
                    cellClass: 'grid-align-right',
                    footerCellClass : 'grid-align-right',
                    footerCellFilter : 'number: 0'
                },
                { 
                    name: 'keb_siswa', 
                    displayName: 'Keb. Siswa', 
                    width : '100', 
                    type: 'number', 
                    cellFilter: 'number: 0',
                    treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
                    customTreeAggregationFinalizerFn: function( aggregation ) {
                        aggregation.rendered = aggregation.value;
                    },
                    cellClass: 'grid-align-right',
                    footerCellClass : 'grid-align-right',
                    footerCellFilter : 'number: 0'
                },
                { 
                    name: 'ekskul', 
                    displayName: 'Ekskul', 
                    width : '100', 
                    type: 'number', 
                    cellFilter: 'number: 0',
                    treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
                    customTreeAggregationFinalizerFn: function( aggregation ) {
                        aggregation.rendered = aggregation.value;
                    },
                    cellClass: 'grid-align-right',
                    footerCellClass : 'grid-align-right',
                    footerCellFilter : 'number: 0'
                },
                { name: 'keterangan', displayName: 'Keterangan', minWidth: 100},
                { name: 'created_at', displayName: 'Created At', visible: false, width : '100',  enableCellEdit: false},
                { name: 'updated_at', displayName: 'Updated At', visible: false, width : '100',  enableCellEdit: false}
            ]
        };

        $scope.grid = { 
            enableMinHeightCheck : true,
            minRowsToShow : 20,
            enableGridMenu: true,
            enableSelectAll: true,
            virtualizationThreshold: 20,
            enableFiltering: true,
            enableCellEditOnFocus: true,
            columnDefs : gridOptions.columnDefs,
            treeRowHeaderAlwaysVisible: false,

            showGridFooter: true,
            showColumnFooter: true,

            onRegisterApi: function(gridApi){
              $scope.gridApi = gridApi;
            }
        };

		$scope.month = helperService.month().options;

		function getData(paramdata){
			cfpLoadingBar.start();
			$resourceApi.getListPembayaran(paramdata)
			.then(function (result) {
                if(result.success){
                	var nodata = true;
                	$scope.grid.data = [];
					angular.forEach(result.rows, function(dt, index) {
						var romnum = index + 1;
						var checkZeroData = parseInt(result.rows[index]["spp"]) +
											parseInt(result.rows[index]["komite_sekolah"]) +
											parseInt(result.rows[index]["catering"]) +
											parseInt(result.rows[index]["keb_siswa"]) +
											parseInt(result.rows[index]["ekskul"]);
						if(checkZeroData > 0){
							result.rows[index]["index"] = romnum;
			                result.rows[index]["spp"] = parseInt(result.rows[index]["spp"]);
			                result.rows[index]["komite_sekolah"] = parseInt(result.rows[index]["komite_sekolah"]);
			                result.rows[index]["catering"] = parseInt(result.rows[index]["catering"]);
			                result.rows[index]["keb_siswa"] = parseInt(result.rows[index]["keb_siswa"]);
			                result.rows[index]["ekskul"] = parseInt(result.rows[index]["ekskul"]);
			                result.rows[index]["nama_kelas"] = result.rows[index]["kelas"] + ' - ' + result.rows[index]["nama_kelas"];
			                
			                $scope.grid.data[index] = result.rows[index];
			                nodata = false;
						}
		                
		            })
		            // $scope.grid.data = result.rows;
		            if(nodata){
		            	toastr.info('Belum ada pembayaran di bulan yang dipilih.', 'Info');
		            }
				}
				cfpLoadingBar.complete();
            }, errorHandle);
		}

		function getKelas(paramdata){
            cfpLoadingBar.start();
            KelasService.getList(paramdata)
            .then(function (result) {
                if(result.success){
                    $scope.kelas = result.rows;
                }
                cfpLoadingBar.complete();
            }, function(error){
                console.log('Unable to load data kelas');
                console.log(error);
            });
        }

		function init(){
			$scope.filter.month = helperService.getMonthId(date.getMonth());
			$scope.filter.year = date.getFullYear();
			getKelas({
                sekolahid : authService.getProfile().sekolahid,
                kelasid : $routeParams.idkelas,
                'per-page' : 0
            });
		}	

		$scope.onSearchClick = function(event){
			if($scope.filter.kelas.length <= 0){
				toastr.warning('Kelas tidak boleh kosong.', 'Warning');
				return false;
			}

			if($scope.filter.month == '' || $scope.filter.month == null){
				toastr.warning('Bulan tidak boleh kosong.', 'Warning');
				return false;
			}
			getData({
    			'page' : 1,
				'per-page' : 0,
				'kelasid' : $scope.filter.kelas.toString(),
				'month' : $scope.filter.month,
				'year' : $scope.filter.year,
				'status' : 1
    		});

		}

		$scope.onResetClick = function(event){
			$scope.filter.kelas = [];
            $scope.filter.month = helperService.getMonthId(date.getMonth());
            $scope.filter.year = date.getFullYear();
		}

		$scope.onBulanChange = function(event){
            $scope.filter.year = ($scope.filter.month >= 1 &&  $scope.filter.month <= 6) ? 
                                    (date.getFullYear() + 1) : date.getFullYear();
            // $scope.onSearchClick();
        }

        /*
         *
         * @param gt, grid.treeBase.tree
         */
        function setGridToContentPdf(gridApi){
            var content = [],
                gt = gridApi.grid.treeBase.tree,
                rdate = 'PER - ' + helperService.formatDateID(date),
                sekolah = 'SMPIT';

            function formatValueNumber(val){
                if((typeof val !='undefined' && parseInt(val))){
                    return $filter('number')(val, 0);
                }

                return '';
            }

            function setTableLabel(label){
                return {text: 'Kelas ' + label};
            }

            /**
             *
             * @params {obj} ObjectgridApi.grid.treeBase.tree
             */
            function setTableData(obj){
                var rows = obj.children,
                    rowdata,
                    rowbody = []
                    

                // Set Header Table
                rowbody.push([
                    {rowSpan: 2, text: 'NO', style: 'header', alignment: 'center'},
                    {rowSpan: 2, text: 'Nama Siswa', style: 'header', alignment: 'center'},
                    { 
                        text: rdate, 
                        // style: 'header', 
                        colSpan: 7, 
                        alignment: 'center' 
                    },
                    {},
                    {},
                    {},
                    {},
                    {},
                    {}
                ]);
                rowbody.push([
                    '', 
                    '',
                    {text: 'Bulan', style: 'header', alignment: 'center'},
                    {text: 'SPP', style: 'header', alignment: 'center'},
                    {text: 'KS', style: 'header', alignment: 'center'},
                    {text: 'Catering', style: 'header', alignment: 'center'},
                    {text: 'Keb. Siswa', style: 'header', alignment: 'center'},
                    {text: 'Ekskul', style: 'header', alignment: 'center'},
                    {text: 'Keterangan', style: 'header', alignment: 'center'},
                ]);

                // Set Body Table
                for(var idx in rows){
                    rowdata = rows[idx].row.entity;

                    var no = parseInt(idx) + 1;
                    var spp = formatValueNumber(rowdata.spp);
                    var komite_sekolah = formatValueNumber(rowdata.komite_sekolah);
                    var catering = formatValueNumber(rowdata.catering);
                    var keb_siswa = formatValueNumber(rowdata.keb_siswa);
                    var ekskul = formatValueNumber(rowdata.ekskul);
                    var keterangan = (rowdata.keterangan != null) ? rowdata.keterangan : '';

                    if( spp != '' ||
                        komite_sekolah != '' ||
                        catering != '' ||
                        keb_siswa != '' ||
                        ekskul != ''
                       )
                    {
                        rowbody.push([
                            no.toString(), 
                            rowdata.nama_siswa,
                            '', 
                            {text: spp, alignment: 'right'},
                            {text: komite_sekolah, alignment: 'right'},
                            {text: catering, alignment: 'right'},
                            {text: keb_siswa, alignment: 'right'},
                            {text: ekskul, alignment: 'right'},
                            keterangan
                        ]);
                    }
                    
                }

                // Set Footer Table
                var sum_spp             = formatValueNumber(obj.aggregations[1].value);
                var sum_komite_sekolah  = formatValueNumber(obj.aggregations[2].value);
                var sum_catering        = formatValueNumber(obj.aggregations[3].value);
                var sum_keb_siswa       = formatValueNumber(obj.aggregations[4].value);
                var sum_ekskul          = formatValueNumber(obj.aggregations[5].value);
                rowbody.push([
                    {text: 'TOTAL', style: 'header', colSpan: 3, alignment: 'right'},
                    {},
                    {},
                    {text: sum_spp, style: 'header', alignment: 'right'},
                    {text: sum_komite_sekolah, style: 'header', alignment: 'right'},
                    {text: sum_catering, style: 'header', alignment: 'right'},
                    {text: sum_keb_siswa, style: 'header', alignment: 'right'},
                    {text: sum_ekskul, style: 'header', alignment: 'right'},
                    {text: '', style: 'header'},
                ]);

                return {
                    style: 'table',
                    table: {
                        widths: [20, 100, 50, 50, 50, 50, 50, 50, '*'],
                        body : rowbody
                    }
                };
            }

            content.push({
                margin: [10,10,10,0],
                text: 'DATA PEMBAYARAN SPP ' + sekolah + ' AL HARAKI',
                alignment: 'center'
            });
            content.push({
                margin: [0,0,0,10],
                text: rdate,
                alignment: 'center'
            });

            for(var idx in gt){
                content.push(setTableLabel(gt[idx].aggregations[0].groupVal));
                content.push(setTableData(gt[idx]));
                
            }

            return content;
        }

        var exportTo = {
        	'pdf' : function(){
        		var pdfdata = setGridToContentPdf($scope.gridApi);
	            var docDefinition = {
	                pageSize: 'LETTER',
	                // pageOrientation: 'landscape',
	                pageMargins: [40, 150, 40, 60],
	                // header: {
	                //     margin: 100,
	                //     columns : [
	                //         {text: 'Al HARAKI',alignment: 'center'},
	                //     ]
	                // },
	                header: {},
	                content: pdfdata,
	                
	                footer: function(currentPage, pageCount) { 
	                    // return currentPage.toString() + ' of ' + pageCount;
	                    return { 
	                        color: 'black',
	                        margin: 25,
	                        text: currentPage.toString() + ' of ' + pageCount, 
	                        alignment: 'right', //(currentPage % 2) ? 'left' : 'right' 
	                    };
	                },
	                styles: {
	                    topHeader: {
	                        bold: true,
	                        color: '#000',
	                        margin: [0, 25, 0, 25],
	                    },
	                    header: {
	                        bold: true,
	                        color: '#000',
	                        padding : 5,
	                        fontSize: 10
	                    },
	                    table: {
	                        color: 'black',
	                        margin: [0, 5, 0, 15],
	                        fontSize: 9
	                    },
	                    footer : {
	                        color: 'black',
	                        margin: [40, 80, 40, 60],
	                        // margin: [10, 15, 10, 15],
	                        fontSize: 9
	                    }
	                },
	            };
	            pdfMake.createPdf(docDefinition).open("Oustanding_tagihan.pdf");
        	},
            'xlsx' : function(griddata){
                
            }
        };

        $scope.onExport = function(type){
            if($scope.grid.data.length <= 0){
                toastr.warning('Rekap data masih kosong.', 'Warning');
                return false;
            }

            // console.log();
            exportTo[type]();
        }

		$scope.$on('$viewContentLoaded', function(){
			// init();
		});

		$timeout(function() {
			init();
		}, 1000);
    }
    RekapTagihanController.$inject = injectParams;

    app.register.controller('RekapTagihanController', RekapTagihanController);
});