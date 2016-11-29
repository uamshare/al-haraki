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
        'TagihanInfoService',
        'KelasService',
        'uiGridGroupingConstants',
        'authService'
    ];

    var RekapOutstandingTagihanController = function (
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
        TagihanInfoService,
        KelasService,
        uiGridGroupingConstants,
        authService
    ) 
    {
        $scope.viewdir = $CONST_VAR.viewsDirectory + 'keuangan/rekap-outstanding-tagihan/';
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
            year : '',
            date_start : helperService.date(date).firstDay,
            date_end : date //helperService.date(date).lastDay //
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
                    visible: false
                },
                { 
                    name: 'nama_siswa', 
                    displayName: 'Nama Siswa', 
                    width : '300',  
                    enableCellEdit: false,
                    cellTemplate: '<div class="" ng-if="row.groupHeader">{{row.treeNode.aggregations[0].rendered}}</div>'+
                              '<div ng-if="!row.groupHeader" class="ui-grid-cell-contents ng-binding ng-scope">' +
                              '<a href="" ng-click="grid.appScope.onSiswaClick(row.entity)" class="column-link">{{row.entity.nama_siswa}}</a>' +
                              '</div>'
                },
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
            enableExpandAll  : true,

            gridMenuShowHideColumns : false,
            enableColumnMenus : false,

            onRegisterApi: function(gridApi){
                $scope.gridApi = gridApi;
                $scope.gridApi.grid.registerDataChangeCallback(function(e) {
                    $scope.gridApi.treeBase.expandAllRows();
                    setGridToContentXLS(gridApi);
                });
            }
        };

        $scope.month = helperService.month().options;

        function getData(paramdata){
            paramdata['tahun_ajaran_id'] = authService.getSekolahProfile().tahun_ajaran_id;
            cfpLoadingBar.start();
            $resourceApi.getList(paramdata)
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
                        if(checkZeroData != 0){
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
                        toastr.info('Data Outstanding SPP kosong.', 'Info');
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
                sekolahid : authService.getSekolahProfile().sekolahid,
                kelasid : $routeParams.idkelas,
                'per-page' : 0
            });
        } 

        $scope.onSiswaClick = function(entity, namakelas){
            var paramdata = [];
            paramdata['tahun_ajaran_id'] = authService.getSekolahProfile().tahun_ajaran_id;
            paramdata['sekolahid'] = authService.getSekolahProfile().sekolahid;
            paramdata['idrombel'] = entity.idrombel;
            cfpLoadingBar.start();
            $resourceApi.getListByIdRombel(paramdata)
            .then(function (result) {
                if(result.success){
                    for(var i in result.rows){
                        result.rows[i]['index'] = parseInt(i) + 1;
                        result.rows[i]['bulan'] = helperService.getMonthName(parseInt(result.rows[i]['bulan']) - 1);
                    }
                    $scope.rows = result.rows;
                    $scope.dataEntity = entity;
                }
                cfpLoadingBar.complete();
            }, errorHandle);

            ngDialog.open({
                template: $CONST_VAR.viewsDirectory + 'keuangan/kwitansi-pembayaran/' + 'grid_bayar.html',
                className: 'ngdialog-theme-flat dialog-custom1 dialog-gray custom-width-75',
                scope: $scope
            });
        }

        $scope.onSearchClick = function(event){
            if($scope.filter.kelas.length <= 0){
                toastr.warning('Kelas tidak boleh kosong.', 'Warning');
                return false;
            }

            // if($scope.filter.month == '' || $scope.filter.month == null){
            //     toastr.warning('Bulan tidak boleh kosong.', 'Warning');
            //     return false;
            // }

            // if($scope.filter.date_start == '' || $scope.filter.date_start == null){
            //     toastr.warning('Tgl Awal tidak boleh kosong.', 'Warning');
            //     return false;
            // }

            if($scope.filter.date_end == '' || $scope.filter.date_end == null){
                toastr.warning('S/D Tgl tidak boleh kosong.', 'Warning');
                return false;
            }
            getData({
                'page' : 1,
                'per-page' : 0,
                'kelasid' : $scope.filter.kelas.toString(),
                // 'month' : $scope.filter.month,
                // 'year' : $scope.filter.year,
                // 'date_start' : $scope.filter.date_start,
                'date_end' : $scope.filter.date_end,
                'status' : 1
            });
        }

        $scope.onResetClick = function(event){
            $scope.filter.kelas = [];
            $scope.filter.month = helperService.getMonthId(date.getMonth());
            $scope.filter.year = date.getFullYear();
            $scope.filter.date_start = helperService.date(date).firstDay;
            $scope.filter.date_end = date;
            $scope.grid.data = [];
        }

        $scope.onBulanChange = function(){
            $scope.filter.year = ($scope.filter.month >= 1 &&  $scope.filter.month <= 6) ? 
                                    (date.getFullYear() + 1) : date.getFullYear();
            // $scope.onSearchClick();
        }

        $scope.j_direktur = "Dir. Pendidikan SIT Al Haraki";
        $scope.nama_direktur = "Susi P. Krisnawan, S.H";
        $scope.j_kepala_sekolah = "Kepala " + authService.getSekolahProfile().nama_sekolah;
        $scope.nama_kepala_sekolah = authService.getSekolahProfile().kepala_sekolah; //"Chairulllah, M. Pd. I";
        $scope.tempat   = "Depok";
        $scope.tanggal  = date.getDate() + ' ' + 
                            helperService.getMonthName(date.getMonth()) + ' ' + 
                            date.getFullYear();

        var exportTo = {
            pdf : function (gridApi){
                var pdfdata = setGridToContentPdf(gridApi);
                // console.log(pdfdata);
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
                            fontSize: 8,
                            text: currentPage.toString() + '/' + pageCount, 
                            alignment: 'center', //(currentPage % 2) ? 'left' : 'right' 
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
                        },
                        colApproval : {
                            margin: [10, 20, 10, 50],
                        }
                    },
                };
                pdfMake.createPdf(docDefinition).open("Oustanding_tagihan.pdf");
            },
            xls : function(gridApi){
                function download(id){
                    var dt = new Date();
                    var day = dt.getDate();
                    var month = dt.getMonth() + 1;
                    var year = dt.getFullYear();
                    var hour = dt.getHours();
                    var mins = dt.getMinutes();
                    var postfix = year.toString() + month.toString() + day.toString() + '-' + hour.toString() + mins.toString();

                    var uri = 'data:application/vnd.ms-excel;base64,'
                    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
                    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
                    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }

                    var table = document.getElementById(id);
                    var ctx = { worksheet : name || 'Outstanding ' + postfix, table : table.innerHTML }
                    // window.location.href = uri + base64(format(template, ctx));
                    // var win = window.open( uri + base64(format(template, ctx)) ,'_blank') ;
                    // win.document.title = 'oustanding_' + postfix + '.xlsx';
                    // win.document.open().write(format( template, ctx ));

                    
                    var a = document.createElement('a');
                    a.href = uri + base64(format(template, ctx));
                    a.download = 'oustanding_' + postfix + '.xls';
                    a.click();
                    // return false;
                }
                return download('print-oustanding');
            },

            _title : 'DATA OUTSTANDING SPP ' + authService.getSekolahProfile().nama_sekolah,
            _titleDate : 'PER - ' + helperService.formatDateID(date),
        }

        /*
         *
         * @param gt, grid.treeBase.tree
         */
        function setGridToContentPdf(gridApi){
            var content = [],
                gt = gridApi.grid.treeBase.tree,
                rdate = exportTo._titleDate;

            function formatValueNumber(val){
                if((typeof val !='undefined' && parseInt(val))){
                    return $filter('number')(val, 0);
                }
                return '';
            }

            function setTableLabel(label){
                return {text: 'Kelas ' + label};
            }

            var s_spp             = 0;
            var s_komite_sekolah  = 0;
            var s_catering        = 0;
            var s_keb_siswa       = 0;
            var s_ekskul          = 0;
            var s_total          = 0;

            /**
             *
             * @params {obj} ObjectgridApi.grid.treeBase.tree
             */
            function setTableData(obj){
                var rows = obj.children,
                    rowdata,
                    rowbody = [];

                // Set Header Table
                rowbody.push([
                    {rowSpan: 2, text: 'NO', style: 'header', alignment: 'center'},
                    {rowSpan: 2, text: 'Nama Siswa', style: 'header', alignment: 'center'},
                    { 
                        text: rdate, 
                        // style: 'header', 
                        colSpan: 7, 
                        alignment: 'center' 
                    },{},{},{},{},{},{}
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

                    if( spp != '' || komite_sekolah != '' || catering != '' || keb_siswa != '' || ekskul != '')
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

                // Summary
                s_spp             += parseInt(obj.aggregations[1].value);
                s_komite_sekolah  += parseInt(obj.aggregations[2].value);
                s_catering        += parseInt(obj.aggregations[3].value);
                s_keb_siswa       += parseInt(obj.aggregations[4].value);
                s_ekskul          += parseInt(obj.aggregations[5].value);
                
                s_total           += parseInt(obj.aggregations[1].value) +
                                     parseInt(obj.aggregations[2].value) +
                                     parseInt(obj.aggregations[3].value) +
                                     parseInt(obj.aggregations[4].value) +
                                     parseInt(obj.aggregations[5].value);

                // Set Footer Table
                var sum_spp             = formatValueNumber(obj.aggregations[1].value);
                var sum_komite_sekolah  = formatValueNumber(obj.aggregations[2].value);
                var sum_catering        = formatValueNumber(obj.aggregations[3].value);
                var sum_keb_siswa       = formatValueNumber(obj.aggregations[4].value);
                var sum_ekskul          = formatValueNumber(obj.aggregations[5].value);

                rowbody.push([
                    {text: 'TOTAL', style: 'header', colSpan: 3, alignment: 'right'},
                    {},{},
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
                text: exportTo._title,
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

            // Set Content Summary
            s_spp             = formatValueNumber(s_spp);
            s_komite_sekolah  = formatValueNumber(s_komite_sekolah);
            s_catering        = formatValueNumber(s_catering);
            s_keb_siswa       = formatValueNumber(s_keb_siswa);
            s_ekskul          = formatValueNumber(s_ekskul);
            s_total          = formatValueNumber(s_total);

            content.push({
                style: 'table',
                table: {
                    widths: [250, 100],
                    body : [
                        [
                            {text: 'SPP', style: 'header',  alignment: 'left'},
                            {text: s_spp, style: 'header', alignment: 'right'},
                        ],
                        [
                            {text: 'KOMITE SEKOLAH', style: 'header', alignment: 'left'},
                            {text: s_komite_sekolah, style: 'header', alignment: 'right'},
                        ],
                        [
                            {text: 'CATERING', style: 'header',  alignment: 'left'},
                            {text: s_catering, style: 'header', alignment: 'right'},
                        ],[
                            {text: 'KEBUTUHAN SISWA', style: 'header', alignment: 'left'},
                            {text: s_keb_siswa, style: 'header', alignment: 'right'},
                        ],
                        [
                            {text: 'EKSKUL', style: 'header', alignment: 'left'},
                            {text: s_ekskul, style: 'header', alignment: 'right'},
                        ],
                        [
                            {text: 'TOTAL', style: 'header', alignment: 'left'},
                            {text: s_total, style: 'header', alignment: 'right'},
                        ]
                    ]
                }
            });

            // Set Content Approval
            content.push({
                // style: 'table',
                margin : [10, 25, 10, 10],
                table: {
                    widths: ['50%', '50%'],
                    body : [
                        [
                            {text: 'Mengetahui, ', alignment: 'left'},
                            {
                                text: $scope.tempat + ', ' + $scope.tanggal, 
                                alignment: 'right'
                            },
                        ],
                        ['',''],['',''],['',''],['',''],['',''],['',''],['',''],
                        ['',''],['',''],['',''],['',''],
                        [
                            {
                                alignment: 'left',
                                decoration: 'underline',
                                text: $scope.nama_direktur
                            },
                            {
                                alignment: 'right',
                                decoration: 'underline',
                                text: $scope.nama_kepala_sekolah
                            }
                        ],
                        [
                            {
                                alignment: 'left',
                                italics: true,
                                text: $scope.j_direktur
                            },
                            {
                                alignment: 'right',
                                italics: true,
                                text: $scope.j_kepala_sekolah
                            }
                        ]
                    ]
                },
                fontSize: 10,
                layout: 'noBorders'
            });
            return content;
        }

        function setGridToContentXLS(gridApi){
            var content = [],
                gt = gridApi.grid.treeBase.tree;


            function formatValueNumber(val){
                if((typeof val !='undefined' && parseInt(val))){
                    return parseInt(val); //$filter('number')(val, 0);
                }

                return '';
            }

            function setTableLabel(label){
                return {text: 'Kelas ' + label};
            }

            var s_spp             = 0;
            var s_komite_sekolah  = 0;
            var s_catering        = 0;
            var s_keb_siswa       = 0;
            var s_ekskul          = 0;
            var s_total          = 0;

            function setTableData(obj){
                var rows = obj.children,
                rowdata,
                rowbody = [];

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

                    if( spp != '' || komite_sekolah != '' || catering != '' || keb_siswa != '' || ekskul != '')
                    {
                        rowbody.push({
                            index : no.toString(),
                            nama_siswa : rowdata.nama_siswa,
                            bulan : '',
                            spp : spp,
                            komite_sekolah : komite_sekolah,
                            catering : catering,
                            keb_siswa : keb_siswa,
                            ekskul : ekskul,
                            keterangan : rowdata.keterangan,
                        });
                    }  
                }

                // Summary
                s_spp             += parseInt(obj.aggregations[1].value);
                s_komite_sekolah  += parseInt(obj.aggregations[2].value);
                s_catering        += parseInt(obj.aggregations[3].value);
                s_keb_siswa       += parseInt(obj.aggregations[4].value);
                s_ekskul          += parseInt(obj.aggregations[5].value);
                
                s_total           += parseInt(obj.aggregations[1].value) +
                                     parseInt(obj.aggregations[2].value) +
                                     parseInt(obj.aggregations[3].value) +
                                     parseInt(obj.aggregations[4].value) +
                                     parseInt(obj.aggregations[5].value);
                return {
                    rows : rowbody,
                    summary : {
                        sum_spp             : formatValueNumber(obj.aggregations[1].value),
                        sum_komite_sekolah  : formatValueNumber(obj.aggregations[2].value),
                        sum_catering        : formatValueNumber(obj.aggregations[3].value),
                        sum_keb_siswa       : formatValueNumber(obj.aggregations[4].value),
                        sum_ekskul          : formatValueNumber(obj.aggregations[5].value)
                    }
                };
            }

            for(var idx in gt){
                content.push({
                    title : 'Kelas ' + gt[idx].aggregations[0].groupVal,
                    data : setTableData(gt[idx])
                });
            }
            
            $scope.templateExport = {
                title : exportTo._title,
                titleDate : exportTo._titleDate,
                table  : content,
                summary : {
                    s_spp             : s_spp,
                    s_komite_sekolah  : s_komite_sekolah,
                    s_catering        : s_catering,
                    s_keb_siswa       : s_keb_siswa,
                    s_ekskul          : s_ekskul,
                    s_total           : s_total
                }
            }
        }        

        $scope.onExport = function(type){
            if($scope.grid.data.length <= 0){
                toastr.warning('Rekap data masih kosong.', 'Warning');
                return false;
            }

            exportTo[type]($scope.gridApi);
        }

        $timeout(function() {
          init();
        }, 1000);
    }
    RekapOutstandingTagihanController.$inject = injectParams;

    app.register.controller('RekapOutstandingTagihanController', RekapOutstandingTagihanController);
});