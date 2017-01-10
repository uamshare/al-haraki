'use strict';



define(['app'], function (app) {

    var injectParams = [
            '$CONST_VAR',
            '$scope',
            '$filter',
            '$location', 
            '$routeParams', 
            '$http', 
            '$log', 
            '$timeout',
            'authService',
            'CashflowService',
            'cfpLoadingBar',
            'toastr',
            'helperService',
            'COAService',
            'uiGridGroupingConstants'
        ];

    var CashflowController = function (
            $CONST_VAR,
            $scope,
            $filter,
            $location, 
            $routeParams, 
            $http, 
            $log, 
            $timeout,
            authService,
            CashflowService,
            cfpLoadingBar,
            toastr,
            helperService,
            COAService,
            uiGridGroupingConstants
        ) 
    {
        $scope.viewdir = $CONST_VAR.viewsDirectory + 'akuntansi/cashflow/';
        var $resourceApi = CashflowService;
        var date = helperService.dateTimeZone();
        //========================Grid Config =======================
        function errorHandle(error){
            var msg = error.data.name;
            toastr.warning(msg, 'Warning');
        }

        var indexController = function(){
            $scope.month = helperService.month().options;
            $scope.filter = {
                month : date.getMonth(),
                year : date.getFullYear()
            }
            
            $scope.data = {
                autodebet : [],
                penerimaan : [],
                pengeluaran : [],
                outstanding : [],
                sum : {
                    penerimaan : null,
                    pengeluaran : null,
                    outstanding : null,
                    footer : null
                }
            }

            function setTotal(row){
                return parseInt(row.saldo_w1) + parseInt(row.saldo_w2) + parseInt(row.saldo_w3) +
                       parseInt(row.saldo_w4) + parseInt(row.saldo_w5) + parseInt(row.saldo_w6);
            }
            function getSum(data){
                var sum = {
                    saldo_w1 : 0,
                    saldo_w2 : 0,
                    saldo_w3 : 0,
                    saldo_w4 : 0,
                    saldo_w5 : 0,
                    saldo_w6 : 0,
                    total : 0
                };
                for(var idx in data){
                    var row = data[idx];
                    sum.saldo_w1 += parseInt(row.saldo_w1);
                    sum.saldo_w2 += parseInt(row.saldo_w2);
                    sum.saldo_w3 += parseInt(row.saldo_w3);
                    sum.saldo_w4 += parseInt(row.saldo_w4);
                    sum.saldo_w5 += parseInt(row.saldo_w5);
                    sum.saldo_w6 += parseInt(row.saldo_w6);
                    sum.total += parseInt(row.total);
                }
                return sum;
            }

            $scope.rangeWeek = [];
            $scope.nama_sekolah = authService.getSekolahProfile().nama_sekolah;
            function get(paramdata){
                paramdata['sekolahid'] = authService.getSekolahProfile().sekolahid;
                paramdata['tahun_ajaran_id'] = authService.getSekolahProfile().tahun_ajaran_id;
                cfpLoadingBar.start();
                $resourceApi.get(paramdata)
                .then(function (result) {
                    if(result.success){
                        var romnum1,romnum2,romnum3;
                        romnum1 = 0; romnum2 = 0; romnum3 = 0;
                        var sum = {
                            saldo_w1 : 0,
                            saldo_w2 : 0,
                            saldo_w3 : 0,
                            saldo_w4 : 0,
                            saldo_w5 : 0,
                            saldo_w6 : 0,
                            total : 0
                        };
                        for(var idx in result.rows.data){
                            var row = result.rows.data[idx];
                            switch(row.t_type){
                                case '0':
                                    // row['index'] = romnum1 + 1;
                                    // row['total'] = setTotal(row);
                                    // $scope.data.autodebet[romnum1] = row;
                                    // romnum1++;
                                    // break;
                                case '1':
                                    row['index'] = romnum1 + 1;
                                    row['total'] = setTotal(row);
                                    $scope.data.penerimaan[romnum1] = row;

                                    sum.saldo_w1 += parseInt(row.saldo_w1);
                                    sum.saldo_w2 += parseInt(row.saldo_w2);
                                    sum.saldo_w3 += parseInt(row.saldo_w3);
                                    sum.saldo_w4 += parseInt(row.saldo_w4);
                                    sum.saldo_w5 += parseInt(row.saldo_w5);
                                    sum.saldo_w6 += parseInt(row.saldo_w6);
                                    sum.total += parseInt(row.total);

                                    romnum1++;
                                    break;
                                case '2':
                                    row['index'] = romnum2 + 1;
                                    row['total'] = setTotal(row);
                                    $scope.data.pengeluaran[romnum2] = row;

                                    sum.saldo_w1 -= parseInt(row.saldo_w1);
                                    sum.saldo_w2 -= parseInt(row.saldo_w2);
                                    sum.saldo_w3 -= parseInt(row.saldo_w3);
                                    sum.saldo_w4 -= parseInt(row.saldo_w4);
                                    sum.saldo_w5 -= parseInt(row.saldo_w5);
                                    sum.saldo_w6 -= parseInt(row.saldo_w6);
                                    sum.total -= parseInt(row.total);

                                    romnum2++;
                                    break;
                                case '3':
                                    row['index'] = romnum3 + 1;
                                    row['total'] = row.saldo_w6; //setTotal(row);
                                    row['saldo_w6'] = 0;
                                    $scope.data.outstanding[romnum3] = row;

                                    // sum.saldo_w1 += parseInt(row.saldo_w1);
                                    // sum.saldo_w2 += parseInt(row.saldo_w2);
                                    // sum.saldo_w3 += parseInt(row.saldo_w3);
                                    // sum.saldo_w4 += parseInt(row.saldo_w4);
                                    // sum.saldo_w5 += parseInt(row.saldo_w5);
                                    // sum.saldo_w6 += parseInt(row.saldo_w6);
                                    sum.total = sum.total - parseInt(row.total);

                                    romnum3++;
                                    break;
                            }
                            
                        }
                        
                        $scope.data.sum.penerimaan = getSum($scope.data.penerimaan);
                        $scope.data.sum.pengeluaran = getSum($scope.data.pengeluaran);
                        $scope.data.sum.footer = sum;

                        $scope.rangeWeek = result.rows.periode.rangeWeek;
                        // console.log($scope.rangeWeek);

                        $scope.monthName = helperService.getMonthName($scope.filter.month - 1);
                        // $scope.rangeWeek = result.rows.periode;
                    }
                    cfpLoadingBar.complete();
                }, errorHandle);
            }

            $scope.rangeDayOnWeek = function(index){
                console.log($scope.rangeWeek);
                // return rangeWeek[index].start.substr(11, 2) + ' - ' + rangeWeek[index].end.substr(11, 2);
            }

            this.init = function(){
                $scope.filter.month = date.getMonth() + 1;
                get({
                    month : $scope.filter.month,
                    year : $scope.filter.year
                });
                $scope.filter.month = date.getMonth() + 1;
            }

            $scope.monthBefore = helperService.getMonthName($scope.filter.month - 1).toUpperCase();
            $scope.yearBefore = helperService.getYearByMonth($scope.filter.month - 1);

            $scope.onSearchClick = function(event){
                if($scope.filter.month == '' || $scope.filter.month == null){
                    toastr.warning('Bulan tidak boleh kosong.', 'Warning');
                    return false;
                }

                if($scope.filter.year == '' || $scope.filter.year == null){
                    toastr.warning('Tahun tidak boleh kosong.', 'Warning');
                    return false;
                }

                $scope.monthBefore = helperService.getMonthName($scope.filter.month - 2).toUpperCase();
                $scope.yearBefore = helperService.getYearByMonth($scope.filter.month - 2)();
                get({
                    month : $scope.filter.month,
                    year : $scope.filter.year,
                    
                });
            }

            $scope.onBulanChange = function(event){
                // $scope.filter.year = ($scope.filter.month >= 1 &&  $scope.filter.month <= 6) ? 
                //                         (date.getFullYear() + 1) : date.getFullYear();
                // $scope.onSearchClick();
                $scope.form.year = (selectmonth >= 1 &&  selectmonth <= 6) ? 
                                        (authService.getSekolahProfile().tahun_akhir) : authService.getSekolahProfile().tahun_awal;
            }

            var exportTo = {
                pdf : function (griddata, rangeWeek){
                    var pdfdata = setGridToContentPdf(griddata, rangeWeek);
                    var docDefinition = {
                        pageSize: 'LETTER',
                        pageOrientation: 'landscape',
                        pageMargins: [40, 150, 40, 60],
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
                            headerSum: {
                                bold: true,
                                color: '#000',
                                padding : 5,
                                fontSize: 9
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
                    pdfMake.createPdf(docDefinition).open("cashflow.pdf");
                },
                xls : function(griddata){
                    function download(id){
                        var dt = helperService.dateTimeZone();
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
                        var ctx = { worksheet : name || 'Cashflow ' + postfix, table : table.innerHTML }
                        // window.location.href = uri + base64(format(template, ctx));
                        // var win = window.open( uri + base64(format(template, ctx)) ,'_blank') ;
                        // win.document.title = 'oustanding_' + postfix + '.xlsx';
                        // win.document.open().write(format( template, ctx ));

                        
                        var a = document.createElement('a');
                        a.href = uri + base64(format(template, ctx));
                        a.download = 'cashflow' + postfix + '.xls';
                        a.click();
                        // return false;
                    }
                    return download('print-cashflow');
                },

                _title : 'Rekap Arus Kas ' + authService.getSekolahProfile().nama_sekolah,
                _titleDate : 'PER - DD ' + helperService.getMonthName($scope.filter.month - 1) + ' ' + 
                              $scope.filter.year,
            }

            /*
             *
             * @param gt, grid.treeBase.tree
             */
            function setGridToContentPdf(griddata, rangeWeek){
                var content = [], table;

                function formatValueNumber(val){
                    if((typeof val !='undefined' && parseInt(val))){
                        return $filter('number')(val, 0);
                    }
                    return '';
                }

                function setHeaderTable(rangeWeek){
                    var rowbody = [],
                        countweek = rangeWeek.length,
                        arr1 = [], arr2 = [], arr3=[];

                    var headerTitle = helperService.getMonthName($scope.filter.month - 1) + ' ' + 
                              $scope.filter.year
                    arr1 = [
                        {text: 'No', style: 'header', rowSpan: 3, alignment: 'center', margin: [0, 20, 0, 0]},
                        {text: 'Nama Akun', style:'header', rowSpan: 3, alignment: 'center', margin: [0, 20, 0, 0]},
                        {text: 'No Akun', style: 'header', rowSpan: 3, alignment: 'center', margin: [0, 20, 0, 0]},
                        {text: headerTitle, style: 'header', colSpan: countweek, alignment: 'center', margin: [0, 10, 0, 0]}
                    ];
                    arr2 = ['','',''];
                    arr3 = ['','',''];
                    for(var i = 0;i<countweek;i++){
                        if(i > 0){
                            arr1.push('');
                        }
                        arr2.push({
                            text: 'Minggu ' + (i + 1),
                            style: 'header',
                            alignment: 'center'
                        });
                        arr3.push({
                            text: rangeWeek[i].start.substr(-2) + ' s/d ' + rangeWeek[i].end.substr(-2),
                            style: 'header',
                            alignment: 'center'
                        });
                    }
                    arr1.push({text: 'Total', style: 'header', rowSpan: 3, alignment: 'center', margin: [0, 20, 0, 0]});
                    arr2.push('');
                    arr3.push('');

                    rowbody.push(arr1);
                    rowbody.push(arr2);
                    rowbody.push(arr3);

                    return rowbody;
                }

                function setBodyTable(griddata, rangeWeek){
                    var rowbody = [],
                        countweek = rangeWeek.length,
                        arr1 = [], arr2 = [], arr3=[],
                        index = 0;

                    /*****************************************************************
                     PENERIMAAN
                     *****************************************************************/
                    var index1 = index;
                    rowbody[index1] = [
                        {text: 'PENERIMAAN', style: 'headerSum', colSpan: (countweek + 4), alignment: 'left'},
                        '','',''
                    ];

                    // data penerimaan
                    for(var idx in griddata.penerimaan){
                        var row = griddata.penerimaan[idx];
                        index++;

                        rowbody[index] = [
                            {text: row.index.toString(), alignment: 'left'},
                            {text: row.name, alignment: 'left'},
                            {text: row.mcoadno, alignment: 'left'}
                        ];

                        for(var i = 0;i<countweek;i++){
                            rowbody[index].push({
                                text : formatValueNumber(row['saldo_w' + (i + 1)]),
                                alignment: 'right'
                            });
                        }
                        
                        rowbody[index].push({ text : formatValueNumber(row.total), alignment: 'right'});
                    }
                    index++;
                    var index2 = index;
                    rowbody[index2] = [
                        {text: 'TOTAL PENERIMAAN', style: 'headerSum', colSpan:3, alignment: 'left'},
                        '',
                        ''
                    ];
                    /*****************************************************************
                     PENGELUARAN
                     *****************************************************************/
                    index++;
                    var index3 = index;
                    rowbody[index3] = [
                        {text: 'PENGELUARAN', style: 'headerSum', colSpan: (countweek + 4), alignment: 'left'},
                        '','',''
                    ];
                    // data pengeluaran
                    for(var idx in griddata.pengeluaran){
                        var row = griddata.pengeluaran[idx];
                        index++;

                        rowbody[index] = [
                            {text: row.index.toString(), alignment: 'left'},
                            {text: row.name, alignment: 'left'},
                            {text: row.mcoadno, alignment: 'left'}
                        ];

                        for(var i = 0;i<countweek;i++){
                            rowbody[index].push({
                                text : formatValueNumber(row['saldo_w' + (i + 1)]),
                                alignment: 'right'
                            });
                        }
                        
                        rowbody[index].push({ text : formatValueNumber(row.total), alignment: 'right'});
                    }
                    index++;
                    var index4 = index;
                    rowbody[index4] = [
                        {text: 'TOTAL PENGELUARAN', style: 'headerSum', colSpan:3, alignment: 'left'},
                        '',
                        ''
                    ];
                    index++;
                    var index5 = index;
                    rowbody[index5] = [
                        {text: 'OUTSTANDING s/d ' + $scope.monthBefore + ' ' + $scope.yearBefore, style: 'headerSum', colSpan : (countweek + 3), alignment: 'left'},
                        '',
                        ''
                    ];

                    index++;
                    var index6 = index;
                    rowbody[index6] = [
                        {text: 'SALDO ' + $scope.nama_sekolah, style: 'headerSum', colSpan : (countweek + 3), alignment: 'left'},
                        '',
                        ''
                    ];

                    for(var i = 0;i<countweek;i++){
                        rowbody[index1].push('');
                        rowbody[index2].push({
                            text : formatValueNumber(griddata.sum.penerimaan['saldo_w' + (i + 1)]),
                            style: 'headerSum',
                            alignment: 'right'
                        });

                        rowbody[index3].push('');
                        rowbody[index4].push({
                            text : formatValueNumber(griddata.sum.pengeluaran['saldo_w' + (i + 1)]),
                            style: 'headerSum',
                            alignment: 'right'
                        });

                        rowbody[index5].push('');
                        rowbody[index6].push('');
                    }

                    rowbody[index2].push({
                        text : formatValueNumber(griddata.sum.penerimaan.total),
                        style: 'headerSum',
                        alignment: 'right'
                    });
                    rowbody[index4].push({
                        text : formatValueNumber(griddata.sum.pengeluaran.total),
                        style: 'headerSum',
                        alignment: 'right'
                    });
                    rowbody[index5].push({
                        text : formatValueNumber(griddata.outstanding[0].total),
                        style: 'headerSum',
                        alignment: 'right'
                    });
                    rowbody[index6].push({
                        text : formatValueNumber(griddata.sum.footer.total),
                        style: 'headerSum',
                        alignment: 'right'
                    });

                    return rowbody;
                }

                function setFooterTable(griddata, rangeWeek){
                    var rowbody = [],
                        countweek = rangeWeek.length,
                        arr1 = [], arr2 = [], arr3=[], colswidth = [];
                    return {
                        style: 'table',
                        table: {
                            widths: [20, 100, 50, 50, 50, 50, 50, 50, '*'],
                            body : rowbody
                        }
                    };
                }

                function setTable(){
                    var rowbody = [],
                        countweek = rangeWeek.length, colswidth = [];

                    colswidth = [20, '*', 35];

                    for(var i = 0;i<countweek;i++){
                        colswidth.push(60);
                    }
                    colswidth.push(65);

                    var header = setHeaderTable(rangeWeek);
                    var body = setBodyTable(griddata, rangeWeek)
                    rowbody = header.concat(body);

                    return {
                        style: 'table',
                        table: {
                            widths: colswidth,
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
                    text: 'PER - ' + helperService.getMonthName($scope.filter.month - 1) + ' ' + 
                              $scope.filter.year,
                    alignment: 'center'
                });

                content.push(setTable(griddata, rangeWeek));
                return content;
            }

            function setGridToContentXLS(griddata, rangeWeek){
                var content = [],
                    gt = griddata.grid.treeBase.tree,
                    rdate = 'PER - ' + helperService.formatDateID(date),
                    sekolah = 'SMPIT';


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
                    titleDate : 'PER - DD ' + helperService.getMonthName($scope.filter.month - 1) + ' ' + 
                              $scope.filter.year,
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
                exportTo[type]($scope.data, $scope.rangeWeek);  
            }
        }

        var detailController = function(){
        }

        var controller;
        switch($location.$$url){
            // case '/akuntansi/cashflow/detail/' + $routeParams.id:
            //     controller = new detailController();
            //     break;
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
    CashflowController.$inject = injectParams;


    app.register.controller('CashflowController', CashflowController);

});