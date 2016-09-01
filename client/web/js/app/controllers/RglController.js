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
            'RglService',
            'cfpLoadingBar',
            'toastr',
            'helperService'
        ];

    var RglController = function (
            $CONST_VAR,
            $scope, 
            $location, 
            $routeParams, 
            $http, 
            $log, 
            $timeout,
            authService,
            RglService,
            cfpLoadingBar,
            toastr,
            helperService
        ) 
    {
        $scope.viewdir = $CONST_VAR.viewsDirectory + 'akuntansi/rgl/';
        var $resourceApi = RglService;
        var date = new Date();
        //========================Grid Config =======================
        function errorHandle(error){
            var msg = error.data.name;
            toastr.warning(msg, 'Warning');
        }

        var indexController = function(){
            var gridOptions = {
                columnDefs : [
                    { name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
                    { name: 'mcoahno', displayName: 'No Akun', width : '120',  enableCellEdit: false},
                    { name: 'mcoahname', displayName: 'Nama Akun',  enableCellEdit: false},
                    { 
                        name: 'saldo_a', 
                        displayName: 'Saldo Awal', 
                        enableCellEdit: false,
                        type: 'number', 
                        width : 120,
                        cellFilter: 'number: 0',
                        cellClass: 'grid-align-right',
                        headerCellClass : 'grid-align-right'
                    },
                    { 
                        name: 'saldo_c', 
                        displayName: 'Aging', 
                        visible: true, 
                        enableCellEdit: false,
                        width : 120,
                        type: 'number', 
                        cellFilter: 'number: 0',
                        cellClass: 'grid-align-right',
                        headerCellClass : 'grid-align-right'
                    },
                    { 
                        name: 'saldo_e', 
                        displayName: 'Saldo Akhir', 
                        enableCellEdit: false,
                        width : 120,
                        type: 'number', 
                        cellFilter: 'number: 0',
                        cellClass: 'grid-align-right',
                        headerCellClass : 'grid-align-right'
                    }
                ]
            };

            // var columnActionTpl =   '<div class="col-action">' + 
            //                                 '<a href="" ng-click="grid.appScope.onPrintClick(row.entity)" >' + 
            //                                     '<span class="badge bg-orange"><i class="fa fa-print"></i></span>' + 
            //                                 '</a>&nbsp;' + 
            //                                 '<a href="" ng-click="grid.appScope.onDetailClick(row.entity)" >' + 
            //                                     '<span class="badge bg-blue"><i class="fa fa-list"></i></span>' + 
            //                                 '</a>&nbsp;'
            //                             '</div>';
            var columnActionTpl =   '<div class="col-action">' + 
                                            '<a href="" ng-click="grid.appScope.onDetailClick(row.entity)" >' + 
                                                '<span class="badge bg-blue"><i class="fa fa-list"></i></span>' + 
                                            '</a>&nbsp;'
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
                // paginationPageSizes: [20, 30, 50, 100, 200],
                // paginationPageSize: $CONST_VAR.pageSize,
                // pageNumber : 1,
                useExternalPagination : true,
                enableMinHeightCheck : true,
                minRowsToShow : 22, //$CONST_VAR.pageSize,
                enableGridMenu: true,
                enableSelectAll: true,
                // virtualizationThreshold: $CONST_VAR.pageSize,
                enableFiltering: true,
                columnDefs : gridOptions.columnDefs,
            };

            $scope.filter = {
                date_start : helperService.date(date).firstDay,
                date_end : date //helperService.date(date).lastDay //
            }
            
            function get(paramdata){
                cfpLoadingBar.start();
                $resourceApi.getList(paramdata)
                .then(function (result) {
                    if(result.success){
                        angular.forEach(result.rows, function(dt, index) {
                            var romnum = index + 1;
                            result.rows[index]["index"] = romnum;
                        })
                        $scope.grid.data = result.rows;
                    }
                    cfpLoadingBar.complete();
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
                // gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                //     $scope.grid.pageNumber = newPage;
                //     $scope.grid.pageSize = pageSize;
                //     $scope.grid.virtualizationThreshold = pageSize; 

                //     get({
                //         page : newPage,
                //         'per-page' : $scope.grid.virtualizationThreshold,
                //         date_start : $scope.filter.date_start,
                //         date_end : $scope.filter.date_end
                //     });
                // });
            }

            $scope.print = function(divName){
                printElement(document.getElementById(divName));
                window.print();
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

            $scope.onDetailClick = function(rowdata){
                $location.path( "/akuntansi/rgl/detail/" + rowdata.mcoahno);
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
        }

        var detailController = function(){
            $scope.filter = {
                date_start : helperService.date(date).firstDay,
                date_end : date //helperService.date(date).lastDay //
            }

            $scope.list = {
                header : {
                    mcoahno : '',
                    mcoahname : '',
                    saldoAwal : '',
                    saldoAkhir : ''
                },
                rows : []
            }
            function getById(paramdata){
                cfpLoadingBar.start();
                $resourceApi.getById(paramdata)
                .then(function (result) {
                    if(result.success){
                        // var rowdata = result.rows;
                        if(result.rows.length > 0){
                            $scope.list.header.mcoahno = result.rows[0].mcoahno;
                            $scope.list.header.mcoahname = result.rows[0].mcoahname;
                            $scope.list.header.saldoAwal = parseInt(result.rows[0].saldo_a);
                            $scope.list.rows = result.rows;
                            $scope.list.header.saldoAkhir = parseInt($scope.list.header.saldoAwal);
                            for(var idx in result.rows){
                                $scope.list.rows[idx]['index'] = parseInt(idx) + 1;
                                $scope.list.rows[idx]['debet_c'] = parseInt($scope.list.rows[idx]['debet_c']);
                                $scope.list.rows[idx]['credit_c'] = parseInt($scope.list.rows[idx]['credit_c']);
                                $scope.list.header.saldoAkhir +=  $scope.list.rows[idx]['debet_c'] - $scope.list.rows[idx]['credit_c'];
                                $scope.list.rows[idx]['saldo'] = $scope.list.header.saldoAkhir;
                            }
                            // $scope.list.header.saldoAkhir = result.rows[0].saldo_a;
                            console.log($scope.list.rows);
                        }else{
                            $scope.list.header.mcoahno = $routeParams.id;
                            $scope.list.header.mcoahname = '';
                            $scope.list.header.saldoAwal = 0;
                            $scope.list.header.saldoAkhir = 0;
                            $scope.list.rows = [];
                        }
                    }
                    cfpLoadingBar.complete();
                }, errorHandle);
            }

            this.init = function(){
                if($routeParams.id){
                    getById({
                        id : $routeParams.id,
                        date_start : $scope.filter.date_start,
                        date_end : $scope.filter.date_end
                    });
                }
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
                getById({
                    id : $routeParams.id,
                    date_start : $scope.filter.date_start,
                    date_end : $scope.filter.date_end
                });
            }

        }

        var controller;
        switch($location.$$url){
            case '/akuntansi/rgl/detail/' + $routeParams.id:
                controller = new detailController();
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
    RglController.$inject = injectParams;


    app.register.controller('RglController', RglController);

});