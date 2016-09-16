'use strict';



define(['app'], function (app) {

    var injectParams = [
            '$CONST_VAR',
            '$scope', 
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
        var date = new Date();
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
                                    row['total'] = row.saldo_w5; //setTotal(row);
                                    $scope.data.outstanding[romnum3] = row;

                                    sum.saldo_w1 += parseInt(row.saldo_w1);
                                    sum.saldo_w2 += parseInt(row.saldo_w2);
                                    sum.saldo_w3 += parseInt(row.saldo_w3);
                                    sum.saldo_w4 += parseInt(row.saldo_w4);
                                    sum.saldo_w5 += parseInt(row.saldo_w5);
                                    sum.saldo_w6 += parseInt(row.saldo_w6);
                                    sum.total += parseInt(row.total);

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
                $scope.filter.month = date.getMonth() + 1;
                get({
                    month : $scope.filter.month,
                    year : $scope.filter.year
                });
                $scope.filter.month = date.getMonth() + 1;
            }

            

            $scope.onSearchClick = function(event){
                if($scope.filter.month == '' || $scope.filter.month == null){
                    toastr.warning('Bulan tidak boleh kosong.', 'Warning');
                    return false;
                }

                if($scope.filter.year == '' || $scope.filter.year == null){
                    toastr.warning('Tahun tidak boleh kosong.', 'Warning');
                    return false;
                }
                get({
                    month : $scope.filter.month,
                    year : $scope.filter.year,
                    
                });
            }

            // $scope.onDetailClick = function(rowdata){
            //     $location.path( "/akuntansi/rgl/detail/" + rowdata.mcoahno);
            // }

            $scope.print = function(divName){
                printElement(document.getElementById(divName));
                window.print();
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
                        $scope.rowTerbilang = helperService.terbilang($scope.rowPrintTotal());
                        $scope.profil = authService.getProfile();
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

            $scope.onBulanChange = function(event){
                $scope.filter.year = ($scope.filter.month >= 1 &&  $scope.filter.month <= 6) ? 
                                        (date.getFullYear() + 1) : date.getFullYear();
                // $scope.onSearchClick();
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