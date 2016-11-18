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
        'ngDialog',
        'cfpLoadingBar',
        '$timeout',
        'uiGridConstants',
        'uiGridGroupingConstants',
        'tagihanAutodebetService',
        'SiswaRombelService',
        'authService'
	];

    var TagihanAutodebetController = function (
		$CONST_VAR,
        helperService,
        $scope,
        $filter,
        toastr,
        $location, 
        $routeParams, 
        $http, 
        $log, 
        ngDialog,
        cfpLoadingBar,
        $timeout,
        uiGridConstants, 
        uiGridGroupingConstants,
        tagihanAutodebetService,
        SiswaRombelService,
        authService
	) 
    {
    	$scope.viewdir = $CONST_VAR.viewsDirectory + 'keuangan/rekonsiliasi-autodebet/';
    	var $resourceApi = tagihanAutodebetService;
    	var date = new Date();

        function errorHandle(error){
            var msg = (typeof error.data.message != 'undefined') ? error.data.message : error.data.name;
            toastr.warning(msg, 'Warning');
            console.log(error);
        }

        var indexController = function(){
            var gridOptions = {
                columnDefs : [
                    { name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
                    { name: 'idrombel', displayName: 'Id Rombel', visible: false, width : '50',  enableCellEdit: false},
                    { name: 'sekolahid', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
                    { name: 'no_transaksi', displayName: 'No Transaksi', width : '120',  enableCellEdit: false},
                    { name: 'tgl_transaksi', displayName: 'Tgl Transaksi', width : '120',  enableCellEdit: false},
                    { name: 'bulan', displayName: 'Bln', visible: false, width : '150', enableCellEdit: false},
                    { name: 'namabulan', displayName: 'Bulan', visible: true, width : '150', enableCellEdit: false},
                    { name: 'tahun', displayName: 'Tahun', visible: true, width : '120', enableCellEdit: false},
                    { name: 'keterangan', displayName: 'Keterangan', enableCellEdit: false},
                    { name: 'created_by', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
                    { name: 'updated_by', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
                    { name: 'created_at', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
                    { name: 'updated_at', displayName: 'SiswaId', visible: false, width : '50',  enableCellEdit: false},
                ]
            };

            var columnActionTpl =   '<div class="col-action">' + 
                                            '<a href="" ng-click="grid.appScope.onEditClick(row.entity)" >' + 
                                                '<span class="badge bg-blue"><i class="fa fa-list"></i></span>' + 
                                            '</a>&nbsp;' +
                                            '<a href="" ng-click="grid.appScope.onDeleteClick(row.entity)" >' + 
                                                '<span class="badge bg-red"><i class="fa fa-trash"></i></span>' + 
                                            '</a>' +
                                        '</div>';
            // var columnActionTpl =   '<div class="col-action">' + 
            //                                 '<a href="" ng-click="grid.appScope.onDeleteClick(row.entity)" >' + 
            //                                     '<span class="badge bg-red"><i class="fa fa-trash"></i></span>' + 
            //                                 '</a>' +
            //                             '</div>';
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
            };

            $scope.filter = {
                date_start : helperService.date(date).firstDay,
                date_end : date //helperService.date(date).lastDay //
            }

            function setGridCollapse(collapse){
                var box = $('#tagihan-autodebet-grid');
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
                var box = $('#tagihan-autodebet-form');
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
                            result.rows[index]["namabulan"] = helperService.getMonthName(result.rows[index]["bulan"] - 1);
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
                        'per-page' : $CONST_VAR.pageSize,
                        date_start : $scope.filter.date_start,
                        date_end : $scope.filter.date_end
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
                $location.path( "/keuangan/rekonsiliasi-autodebet/edit/" + rowdata.no_transaksi);
            }

            $scope.onDeleteClick = function(rowdata){
                var del = confirm("Anda yakin akan menghapus data `" + rowdata.no_transaksi + "`");
                if (del == true) {
                    deleteData(rowdata.no_transaksi);
                } 
            }

            function terbilang(bilangan) {

                bilangan    = String(bilangan);
                var angka   = new Array('0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0');
                var kata    = new Array('','Satu','Dua','Tiga','Empat','Lima','Enam','Tujuh','Delapan','Sembilan');
                var tingkat = new Array('','Ribu','Juta','Milyar','Triliun');

                var panjang_bilangan = bilangan.length, 
                    i, 
                    j, 
                    kaLimat = '';

                /* pengujian panjang bilangan */
                if (panjang_bilangan > 15) {
                    kaLimat = "Diluar Batas";
                    return kaLimat;
                }

                /* mengambil angka-angka yang ada dalam bilangan, dimasukkan ke dalam array */
                for (i = 1; i <= panjang_bilangan; i++) {
                    angka[i] = bilangan.substr(-(i),1);
                }

                i = 1;
                j = 0;
                kaLimat = "";
                /* mulai proses iterasi terhadap array angka */
                while (i <= panjang_bilangan) {
                    var subkaLimat = "",
                    kata1 = "",
                    kata2 = "",
                    kata3 = "";

                    /* untuk Ratusan */
                    if (angka[i+2] != "0") {
                        if (angka[i+2] == "1") {
                        kata1 = "Seratus";
                        } else {
                        kata1 = kata[angka[i+2]] + " Ratus";
                        }
                    }

                    /* untuk Puluhan atau Belasan */
                    if (angka[i+1] != "0") {
                        if (angka[i+1] == "1") {
                            if (angka[i] == "0") {
                                kata2 = "Sepuluh";
                            }else if (angka[i] == "1") {
                                kata2 = "Sebelas";
                            }else {
                                kata2 = kata[angka[i]] + " Belas";
                            }
                        }else {
                            kata2 = kata[angka[i+1]] + " Puluh";
                        }
                    }

                    /* untuk Satuan */
                    if (angka[i] != "0") {
                        if (angka[i+1] != "1") {
                            kata3 = kata[angka[i]];
                        }
                    }

                    /* pengujian angka apakah tidak nol semua, lalu ditambahkan tingkat */
                    if ((angka[i] != "0") || (angka[i+1] != "0") || (angka[i+2] != "0")) {
                        subkaLimat = kata1+" "+kata2+" "+kata3+" "+tingkat[j]+" ";
                    }

                    /* gabungkan variabe sub kaLimat (untuk Satu blok 3 angka) ke variabel kaLimat */
                    kaLimat = subkaLimat + kaLimat;
                    i = i + 3;
                    j = j + 1;
                }

                /* mengganti Satu Ribu jadi Seribu jika diperlukan */
                if ((angka[5] == "0") && (angka[6] == "0")) {
                    kaLimat = kaLimat.replace("Satu Ribu","Seribu");
                }

                return kaLimat + "Rupiah";
            }

            $scope.onPrintClick = function(rowdata){
                var date = new Date();
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
                        $scope.rowTerbilang = terbilang($scope.rowPrintTotal());
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
                no_transaksi : '',
                tgl_transaksi : date,
                sekolahid : authService.getSekolahProfile().sekolahid,
                keterangan : '',
                file_import : '',
                bulan : '',
                tahun : '',
                tahun_ajaran_id : authService.getSekolahProfile().tahun_ajaran_id,
                created_at : null,
                updated_at : null,
                created_by : '',
                updated_by : ''
            };

            $scope.gridDetailDirtyRows = [];
            var validIconTpl =  '<div class="col-action ui-grid-cell-contents">' + 
                                    '<i ng-show="!row.groupHeader && row.entity.invalid" class="fa fa-warning" color="red"></i>' +
                                    '<i ng-show="!row.groupHeader && !row.entity.invalid" class="fa fa-check-square" color="green"></i>' +            
                                '</div>';

            var rowTemplate = function() {
            return '<div ng-class="{invalid: row.entity.invalid}" ' +
                'style="cursor: pointer" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
                'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader}" ui-grid-cell></div>';
            };

            // $scope.onClick1 = row => console.log(row.treeNode.aggregations[0]);

            $scope.gridDetail = { 
                enableMinHeightCheck : true,
                minRowsToShow : 25,
                enableGridMenu: false,
                // enableSelectAll: true,
                enableFiltering: true,
                enableCellEditOnFocus: true,
                showGridFooter: true,
                showColumnFooter: true,
                rowTemplate: rowTemplate(),
                columnDefs : [
                    { name: 'index', displayName : 'No', width : '50', enableFiltering : false , visible: false, enableCellEdit: false},
                    { 
                        name: 'index', 
                        displayName : '', 
                        width : '50', 
                        enableFiltering : false , 
                        visible: true, 
                        enableCellEdit: false,
                        cellTemplate : validIconTpl,
                        cellClass: 'grid-align-center',
                    },
                    { name: 'id', displayName: 'Id', visible: false, width : '50',  enableCellEdit: false},
                    { name: 'idrombel', displayName: 'IdRombel', visible: false, width : '50',  enableCellEdit: false},
                    { name: 'kelasid', displayName: 'KelasId', visible: false, width : '50',  enableCellEdit: false},
                    { 
                        name: 'nama_kelas',
                        displayName: 'Kelas',
                        grouping: { groupPriority: 1 }, 
                        sort: { priority: 1, direction: 'asc' }, 
                        visible: false,
                        width: '175'
                    },
                    { name: 'no_transaksi', displayName: 'No Transaksi', visible: false, width : '120',  enableCellEdit: false},
                    { 
                        name: 'nis', displayName: 'NIS', width : '120', visible: true, enableCellEdit: false,
                        cellTemplate: '<div class="ui-grid-cell-contents">'+
                              '<div class="" ng-if="row.groupHeader">{{row.treeNode.aggregations[0].rendered}}</div>'+
                              '<div ng-if="!row.groupHeader">{{grid.getCellValue(row, col)}}</div></div>'
                    },
                    { name: 'nisn', displayName: 'NISN', width : '120', visible: false, enableCellEdit: false},
                    { name: 'nama_siswa', displayName: 'Nama Siswa (System)', width : '300', enableCellEdit: false},
                    { name: 'nama_siswa_xls', displayName: 'Nama Siswa (XLSX)', width : '300', enableCellEdit: false},
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
                        footerCellFilter : 'number: 0',
                        footerCellClass : 'grid-align-right'
                    },
                    { 
                        name: 'komite_sekolah', 
                        displayName: 'KS', 
                        width : '100', 
                        type: 'number', 
                        cellFilter: 'number: 0',
                        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
                        customTreeAggregationFinalizerFn: function( aggregation ) {
                            aggregation.rendered = aggregation.value;
                            return aggregation.rendered;
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
                            return aggregation.rendered;
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
                            return aggregation.rendered;
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
                            return aggregation.rendered;
                        },
                        cellClass: 'grid-align-right',
                        footerCellClass : 'grid-align-right',
                        footerCellFilter : 'number: 0'
                    },
                    { 
                        name: 'total', 
                        displayName: 'Total', 
                        width : '100', 
                        type: 'number', 
                        cellFilter: 'number: 0',
                        treeAggregationType: uiGridGroupingConstants.aggregation.SUM,
                        customTreeAggregationFinalizerFn: function( aggregation ) {
                            aggregation.rendered = aggregation.value;
                            return aggregation.rendered;
                        },
                        cellClass: 'grid-align-right',
                        footerCellClass : 'grid-align-right',
                        footerCellFilter : 'number: 0'
                    },
                    { name: 'no_rekening', displayName: 'NO Rek', width : '150', enableCellEdit: false},
                    { name: 'nama_no_rekening', displayName: 'Atas Nama', width : '150', enableCellEdit: false},
                    { name: 'created_at', displayName: 'Created At', visible: false, width : '100',  enableCellEdit: false},
                    { name: 'updated_at', displayName: 'Updated At', visible: false, width : '100',  enableCellEdit: false},
                    { name: 'invalid', displayName: 'Invalid', visible: false, width : '100',  enableCellEdit: false}
                ],

                gridMenuShowHideColumns : false,
                enableColumnMenus : false,

                onRegisterApi: function(gridApi){
                    $scope.gridApi = gridApi;
                    // gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                    //     if(oldValue != newValue && (parseInt(newValue))){
                    //         $scope.gridDetailDirtyRows.push(rowEntity);
                    //     }
                    //     $scope.$apply();
                    // });
                    $scope.gridApi.grid.registerDataChangeCallback(function(e) {
                        $scope.gridApi.treeBase.expandAllRows();
                    });
                }
            };


            function reset(){
                // reset form
                $scope.form.tgl_transaksi = date;
                $scope.form.sekolahid = authService.getSekolahProfile().sekolahid;
                $scope.form.keterangan = '';
                $scope.form.file_import = '';
                $scope.form.bulan = helperService.getMonthId(date.getMonth());
                $scope.form.tahun = date.getFullYear();
                $scope.form.tahun_ajaran_id = authService.getSekolahProfile().tahun_ajaran_id;
                $scope.form.created_at = null;
                $scope.form.updated_at = null;
                $scope.form.created_by = '',
                $scope.form.updated_by = ''

                // reset grid
                $scope.gridDetail.data = [];
            }

            function refreshNo(){
                $resourceApi.getNewNoTransaksi({
                    sekolahid : authService.getSekolahProfile().sekolahid
                })
                .then(function (result) {
                    if(result.success){
                        $scope.form.no_transaksi = result.rows;
                        $scope.form.tgl_transaksi = date;
                        // $scope.form.bulan = helperService.getMonthId(date.getMonth());
                        // $scope.form.tahun = date.getFullYear();
                    }
                }, function(error){
                    toastr.warning('No Transaksi tidak bisa dimuat. Silahkan klik tombol tambah', 'Warning');
                });
            }

            function getRowDetailByNo(noTransaksi){
                cfpLoadingBar.start();
                $resourceApi.getDetail({
                    no_transaksi : noTransaksi
                })
                .then(function (result) {
                    if(result.success){
                        $scope.gridDetail.data = [];
                        if(result.rows.length <= 0 )return false;
                        
                        angular.forEach(result.rows, function(dt, index) {
                            var romnum = index + 1;
                            result.rows[index]["index"] = romnum;
                            result.rows[index]["spp"] = helperService.parseInt(result.rows[index]["spp"]);
                            result.rows[index]["komite_sekolah"] = helperService.parseInt(result.rows[index]["komite_sekolah"]);
                            result.rows[index]["catering"] = helperService.parseInt(result.rows[index]["catering"]);
                            result.rows[index]["keb_siswa"] = helperService.parseInt(result.rows[index]["keb_siswa"]);
                            result.rows[index]["ekskul"] = helperService.parseInt(result.rows[index]["ekskul"]);
                            result.rows[index]["total"] = helperService.parseInt(result.rows[index]["total"]);

                            result.rows[index]["invalid"] = (result.rows[index]["nama_siswa"] != result.rows[index]["nama_siswa_xls"]);
                            result.rows[index]["nama_kelas"] = result.rows[index]["kelas"] + ' - ' + result.rows[index]["nama_kelas"];

                        });

                        $scope.gridDetail.data = result.rows;
                        
                    }
                    cfpLoadingBar.complete();
                }, function(error){
                    toastr.warning('Rincian Autodebet tidak bisa dimuat.', 'Warning');
                    cfpLoadingBar.complete();
                });
            }

            function getById(id){
                cfpLoadingBar.start();
                $resourceApi.getById(id)
                .then(function (result) {
                    if(result.success){
                        var rowdata = result.rows;

                        $scope.form.no_transaksi = rowdata.no_transaksi;
                        $scope.form.tgl_transaksi = rowdata.tgl_transaksi;
                        $scope.form.sekolahid = rowdata.sekolahid;
                        $scope.form.keterangan = rowdata.keterangan;
                        $scope.form.file_import = rowdata.file_import;
                        $scope.form.tahun_ajaran_id = rowdata.tahun_ajaran_id;
                        $scope.form.bulan = rowdata.bulan;
                        $scope.form.tahun = rowdata.tahun;
                        $scope.form.created_by = rowdata.created_by;
                        $scope.form.created_at = rowdata.created_at;
                        
                        getRowDetailByNo(rowdata.no_transaksi);
                    }
                    cfpLoadingBar.complete();
                }, errorHandle);
            }

            $scope.xlsDataValid = true;
            function mergeXlsdataAndRombel(params, xlsdata){
                params['sekolahid'] = authService.getSekolahProfile().sekolahid;
                params['tahun_ajaran_id'] = authService.getSekolahProfile().tahun_ajaran_id;
                cfpLoadingBar.start();
                SiswaRombelService.getList(params)
                .then(function (result) {
                    if(result.success){
                        var rowdata = {}; //result.rows;
                        $scope.gridDetail.data = [];
                        for(var idx in result.rows){
                            var resultNIS = helperService.trim(result.rows[idx].nis);
                            rowdata[resultNIS] = result.rows[idx];
                        }

                        for(var nis in xlsdata){
                            if(typeof rowdata[nis] !='undefined' && rowdata[nis] != null && rowdata[nis] != ''){
                                // rowdata[result.rows[idx].nis] = result.rows[idx];
                                if(helperService.trim(rowdata[nis].nama_siswa) != helperService.trim(xlsdata[nis].nama_siswa)){
                                    $scope.xlsDataValid = false;
                                }
                                $scope.gridDetail.data.push({
                                    index : xlsdata[nis].index,
                                    idrombel : rowdata[nis].id,
                                    kelasid : rowdata[nis].kelasid,
                                    nama_kelas : rowdata[nis].kelas + ' - ' + rowdata[nis].nama_kelas,
                                    no_transaksi : xlsdata[nis].no_transaksi,
                                    nis : xlsdata[nis].nis,
                                    nisn : xlsdata[nis].nisn,
                                    nama_siswa : rowdata[nis].nama_siswa,
                                    nama_siswa_xls : xlsdata[nis].nama_siswa,
                                    spp : xlsdata[nis].spp,
                                    komite_sekolah : xlsdata[nis].komite_sekolah,
                                    catering : xlsdata[nis].catering,
                                    keb_siswa : xlsdata[nis].keb_siswa,
                                    ekskul : xlsdata[nis].ekskul,
                                    total : xlsdata[nis].total,
                                    invalid : (helperService.trim(rowdata[nis].nama_siswa) != helperService.trim(xlsdata[nis].nama_siswa))
                                });
                            }else{
                                toastr.warning('NIS ' + nis + ' tidak ditemukan.', 'Warning');
                            }
                        }
                        
                    }
                    cfpLoadingBar.complete();
                }, errorHandle);
            }

            function handleFile(e) {

                // ep.showErrors=false;
                var ep = new ExcelPlus({showErrors : false, flashUsed : true});
                var a = ep.openLocal({
                    "flashPath":"/js/excelplus/2.4/swfobject/",
                    "labelButton":"Open an Excel file"
                }, function(c){
                    // console.log(c);
                    try {
                        var SheetNames = ep.getSheetNames();
                        if(SheetNames.indexOf("Header") < 0 && SheetNames.indexOf("header") < 0){
                            toastr.warning('Format file template tidak sesuai. Sheet Header tidak ditemukan', 'Warning');
                            return false;
                        }

                        if(SheetNames.indexOf("Konten") < 0 && SheetNames.indexOf("konten") < 0){
                            toastr.warning('Format file template tidak sesuai. Sheet Konten tidak ditemukan', 'Warning');
                            return false;
                        }

                        var XLSheader = ep.selectSheet("Header").readAll(),
                            XLSdata = ep.selectSheet("Konten").readAll();
                        var num = 1;
                        var nodata = true;
                        var rows = {},
                            paramsRombel = [];

                        for(var idx in XLSdata){
                            if(idx > 0 && XLSdata[idx][1] != null){
                                var xls_spp = helperService.parseInt(XLSdata[idx][6]) || 0,
                                    xls_komite_sekolah = helperService.parseInt(XLSdata[idx][7]) || 0,
                                    xls_catering = helperService.parseInt(XLSdata[idx][8]) || 0,
                                    xls_keb_siswa = helperService.parseInt(XLSdata[idx][9]) || 0,
                                    xls_ekskul = helperService.parseInt(XLSdata[idx][10]) || 0,
                                    checkZeroData = xls_spp + xls_komite_sekolah + xls_catering + xls_keb_siswa + xls_ekskul;

                                nodata = false;

                                rows[XLSdata[idx][1]] = {
                                        index : num,
                                        no_transaksi : $scope.form.no_transaksi,
                                        nis : helperService.trim(XLSdata[idx][1]),
                                        nisn : XLSdata[idx][2],
                                        nama_siswa : XLSdata[idx][3],
                                        spp : xls_spp,
                                        komite_sekolah : xls_komite_sekolah,
                                        catering : xls_catering,
                                        keb_siswa : xls_keb_siswa,
                                        ekskul : xls_ekskul,
                                        total : checkZeroData
                                }
                                paramsRombel.push(helperService.trim(XLSdata[idx][1]));
                                num++;
                            }
                        }
                        
                        if(nodata){
                            toastr.info('Data kosong.', 'Info');
                            return false;
                        }
                        mergeXlsdataAndRombel({nis : paramsRombel.toString()}, rows);
                    }
                    catch(err) {
                        // document.getElementById("demo").innerHTML = err.message;
                        console.log(err.message);
                    }
                })
            }

            this.init = function(){
                if($routeParams.id){
                    getById($routeParams.id);
                    $scope.isButtonAddHide = false;
                    $scope.isHideFile = true;
                    $scope.isView = true;
                }else{
                    refreshNo();
                    reset();
                    handleFile();
                    $scope.isButtonAddHide = false;
                    $scope.isHideFile = false;
                    $scope.isView = false;
                }
            }

            $scope.isView = false;
            $scope.onSaveClick = function(event){

                if(!$scope.xlsDataValid){
                    toastr.warning('Data tidak valid, silahkan perbaiki dan upload ulang.', 'Warning');
                    return false;
                }

                if($scope.form.no_transaksi == '' || $scope.form.no_transaksi == null){
                    toastr.warning('No Transaksi tidak boleh kosong.', 'Warning');
                    return false;
                }

                if($scope.form.tgl_transaksi == '' || $scope.form.tgl_transaksi == null){
                    toastr.warning('Tgl Transaksi tidak boleh kosong.', 'Warning');
                    return false;
                }

                if($scope.form.bulan == '' || $scope.form.bulan == null){
                    toastr.warning('Bulan tidak boleh kosong.', 'Warning');
                    return false;
                }

                if($scope.form.tahun == '' || $scope.form.tahun == null){
                    toastr.warning('Tahun tidak boleh kosong.', 'Warning');
                    return false;
                }

                $scope.gridDetailDirtyRows = $scope.gridDetail.data;
                if($scope.gridDetailDirtyRows.length <= 0){
                    toastr.warning('Rincian Autodebet kosong.', 'Warning');
                    return false;
                }

                // return;

                var params = {
                    form : $scope.form,
                    grid : $scope.gridDetailDirtyRows
                }

                function success(result){
                    if(result.success){
                        toastr.success('Data telah tersimpan', 'Success');
                        reset();
                        refreshNo();
                        cfpLoadingBar.complete();
                        $location.path( "/keuangan/rekonsiliasi-autodebet");
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
                reset();
                // $location.path( "/keuangan/kwitansi-pembayaran/");
            }

            $scope.onDownloadTpl = function(){
                var win = window.open(BASEURL + "public/tpl/general_template_autodebet.xlsx", '_blank');
                if (win) {
                    //Browser has allowed it to be opened
                    win.focus();
                } else {
                    //Browser has blocked it
                    alert('Please allow popups for this website');
                }
            }

            $scope.onBulanChange = function(){
                $scope.form.tahun = ($scope.form.bulan >= 1 &&  $scope.form.bulan <= 6) ? 
                                        (date.getFullYear() + 1) : date.getFullYear();
            }
        }

        var controller;
        switch($location.$$url){
            case '/keuangan/rekonsiliasi-autodebet/add' :
                controller = new addEditController();
                break;
            case '/keuangan/rekonsiliasi-autodebet/edit/' + $routeParams.id :
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
			// init();
            controller.init();
		}, 1000);
    }
    TagihanAutodebetController.$inject = injectParams;

    app.register.controller('TagihanAutodebetController', TagihanAutodebetController);
});