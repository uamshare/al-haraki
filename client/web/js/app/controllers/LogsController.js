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
            'LogsService',
            'cfpLoadingBar',
            'toastr',
            'helperService',
            'uiGridGroupingConstants'
        ];

    var LogsController = function (
            $CONST_VAR,
            $scope, 
            $location, 
            $routeParams, 
            $http, 
            $log, 
            $timeout,
            authService,
            LogsService,
            cfpLoadingBar,
            toastr,
            helperService,
            COAService,
            uiGridGroupingConstants
        ) 
    {
        $scope.viewdir = $CONST_VAR.viewsDirectory + 'logs/';
        var $resourceApi = LogsService;
        var date = helperService.dateTimeZone();
        //========================Grid Config =======================
        function errorHandle(error){
            var msg = error.data.name;
            toastr.warning(msg, 'Warning');
        }

        var indexController = function(){
            var gridOptions = {
                columnDefs : [
                    { name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
                    { name: 'id', displayName: 'Id', visible: false, width : '120',  enableCellEdit: false},
                    { name: 'controller_id', displayName: 'Trans Id', visible: false, width : '200',  enableCellEdit: false},
                    { name: 'created_at', displayName: 'Tanggal', visible: true, width : '150',  enableCellEdit: false},
                    { name: 'action_id', displayName: 'Aksi',  width : '120', enableCellEdit: false},
                    { name: 'no_trans', displayName: 'No Transaksi',  width : '120', enableCellEdit: false},
                    { name: 'fullname', displayName: 'User', visible: true, enableCellEdit: false},
                    { name: 'created_by', displayName: 'UserID', visible: false, width : '50',  enableCellEdit: false}
                ]
            };

            var columnActionTpl =   '<div class="col-action">' + 
                                            '<a href="" ng-click="grid.appScope.onDetailClick(row.entity)" >' + 
                                                '<span class="badge bg-blue"><i class="fa fa-list"></i></span>' + 
                                            '</a>&nbsp;'
                                        '</div>';
            // gridOptions.columnDefs.push({
            //     name :' ',
            //     enableFiltering : false,
            //     width : '100',
            //     enableSorting : false,
            //     enableCellEdit: false,
            //     cellClass: 'grid-align-right',
            //     cellTemplate : columnActionTpl
            // }); 

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
                date_end : date
            }

            function cleanJsonString(){

            }
            
            function get(paramdata){
                var controllerid = $routeParams.id.replace(/[\. ,:-]+/g, '');
                paramdata['sekolahid'] = authService.getSekolahProfile().sekolahid;
                paramdata['controllerid'] = controllerid;
                cfpLoadingBar.start();
                $resourceApi.get(paramdata)
                .then(function (result) {
                    if(result.success){
                        angular.forEach(result.rows, function(dt, index) {
                            var romnum = (paramdata.page > 1) ? (((paramdata.page - 1) * $scope.grid.pageSize) + index + 1) : (index + 1);
                            
                            result.rows[index]["index"] = romnum;
                            // var dirty_attributes = JSON.parse(result.rows[index].dirty_attributes);
                            // if(typeof dirty_attributes.rowHeader != 'undefined' && dirty_attributes.rowHeader.no_kwitansi){
                            //     result.rows[index]["no_trans"] = dirty_attributes.rowHeader.no_kwitansi;
                            // }else if(typeof dirty_attributes.rowHeader != 'undefined' && dirty_attributes.rowHeader.no_transaksi){
                            //     result.rows[index]["no_trans"] = dirty_attributes.rowHeader.no_transaksi;
                            // }else if(typeof dirty_attributes.no_kwitansi != ''){
                            //     result.rows[index]["no_trans"] = dirty_attributes.no_kwitansi;
                            // }else if(typeof dirty_attributes.no_transaksi != ''){
                            //     result.rows[index]["no_trans"] = dirty_attributes.no_transaksi;
                            // }else{
                            //     result.rows[index]["no_trans"] = '';
                            // }
                        })
                        $scope.grid.data = result.rows;
                        $scope.grid.totalItems = result.total;
                        $scope.grid.paginationCurrentPage = paramdata.page;
                    }
                    cfpLoadingBar.complete();
                }, errorHandle);
            }

            this.init = function(){
                if($routeParams.id){
                    var controllerid = $routeParams.id.replace(/[\. ,:-]+/g, '');
                    get({
                        page : 1,
                        'per-page' : $CONST_VAR.pageSize,
                        date_start : $scope.filter.date_start,
                        date_end : $scope.filter.date_end
                    });
                }
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

            $scope.onSearchClick = function(event){
                if($scope.filter.date_start == '' || $scope.filter.date_start == null){
                    toastr.warning('Dari Tanggal tidak boleh kosong.', 'Warning');
                    return false;
                }

                if($scope.filter.date_end == '' || $scope.filter.date_end == null){
                    toastr.warning('s/d Tanggal tidak boleh kosong.', 'Warning');
                    return false;
                }
                get({
                    page : 1,
                    'per-page' : $scope.grid.virtualizationThreshold,
                    date_start : $scope.filter.date_start,
                    date_end : $scope.filter.date_end
                });
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
    LogsController.$inject = injectParams;


    app.register.controller('LogsController', LogsController);

});