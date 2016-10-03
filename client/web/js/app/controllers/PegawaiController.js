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
            'PegawaiService',
            'cfpLoadingBar',
            'toastr'
        ];

    var PegawaiController = function (
            $CONST_VAR,
            $scope,
            $location,
            $routeParams,
            $http,
            $log,
            $timeout,
            authService,
            PegawaiService,
            cfpLoadingBar,
            toastr
        )
    {
        $scope.viewdir = $CONST_VAR.viewsDirectory + 'master/karyawan/';

        //========================Grid Config =======================

        var grid = {
            columnDefs : [
                { name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
                { name: 'id', displayName: 'ID', visible: false, width : '50' ,  enableCellEdit: false},
                { name: 'nik', displayName: 'NIK', visible: true, width : '150',  enableCellEdit: false},
                { name: 'nuptk', displayName: 'NUPTK', visible: true, width : '150',  enableCellEdit: false},
                { name: 'nama_pegawai', displayName: 'Nama Karyawan', visible: true, width : '400',  enableCellEdit: false},
                { name: 'agama', displayName: 'Agama', visible: true, width : '150',  enableCellEdit: false}
            ]
        }

        var columnActionTpl =   '<div class="col-action" ng-show="row.entity.id">' +
                                    '<a href="" ng-click="grid.appScope.onEditClick(row.entity)" >' +
                                        '<span class="badge bg-blue"><i class="fa fa-edit"></i></span>' +
                                    '</a>&nbsp;' +
                                    '<a href="" ng-click="grid.appScope.onDeleteClick(row.entity)" >' +
                                        '<span class="badge bg-red"><i class="fa fa-trash"></i></span>' +
                                    '</a>' +
                                '</div>';
        $scope.grid = {
            paginationPageSizes: [20, 30, 50, 100, 200],
            paginationPageSize: 20,
            pageNumber : 1,
            useExternalPagination : true,
            enableMinHeightCheck : true,
            minRowsToShow : 20,
            enableGridMenu: true,
            enableSelectAll: true,
            virtualizationThreshold: 20,
            enableFiltering: true,
            enableCellEditOnFocus: true,
            columnDefs : grid.columnDefs
        };

        $scope.onEditClick = function(rowdata){
            $location.path( "/master/karyawan/edit/" + rowdata.id);
        }

        function initEdit(id){
            cfpLoadingBar.start();
            $resourceApi.getById(id)
            .then(function (result) {
              console.log(result);
                if(result.success){

                }
                cfpLoadingBar.complete();
            }, errorHandle);
        }

        grid.columnDefs.push({
            name :' ',
            enableFiltering : false,
            width : '75',
            enableSorting : false,
            enableCellEdit: false,
            cellTemplate : columnActionTpl,
            cellClass: 'grid-align-right',
            customTreeAggregationFinalizerFn: function( aggregation ) {
                aggregation.rendered = aggregation.value;
            },
        });

        $scope.grid.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                $scope.grid.pageNumber = newPage;
                $scope.grid.pageSize = pageSize;
                $scope.grid.virtualizationThreshold = pageSize;
                $scope.getList({
                    page : newPage,
                    'per-page' : pageSize
                });
            });
            $scope.gridApi.grid.registerDataChangeCallback(function(e) {
                $scope.gridApi.treeBase.expandAllRows();
            });
        }

        function getData(data){
            $http.get($CONST_VAR.restDirectory + 'pegawais',{
                params : data
            })
            .success(function(data, status, header) {
                var header = header();
                if(data.success){
                    angular.forEach(data.rows, function(dt, index) {
                        var romnum = index + 1;
                        data.rows[index]["index"] = romnum;

                    })
                    $scope.grid.data = data.rows;
                }
            });
        }

        $scope.$on('$viewContentLoaded', function(){
            init();
        });

        function init(){
            getData();
        }

        $scope.getList = function (paramdata){
                cfpLoadingBar.start();
                $resourceApi.get(paramdata.page, paramdata.perPage)
                .then(function (result) {
                    if(result.success){
                        angular.forEach(result.rows, function(dt, index) {
                            var romnum = (paramdata.page > 1) ? (((paramdata.page - 1) * $scope.grid.pageSize) + index + 1) : (index + 1);
                            result.rows[index]["index"] = romnum;
                        })
                        $scope.grid.data = result.rows;
                        $scope.grid.totalItems = result.total;
                        $scope.grid.paginationCurrentPage = paramdata.page;
                    }
                    cfpLoadingBar.complete();
                }, errorHandle);
            }

        switch($location.$$url){
            case '/master/karyawan/add':
                controller = new addEditController();
                break;
            case '/master/karyawan/edit/' + $routeParams.id:
                controller = new addEditController();
                break;
        }

        $scope.onAddClick = function(event){
            $location.path( "/master/karyawan/add");
        }
    }
    PegawaiController.$inject = injectParams;


    app.register.controller('PegawaiController', PegawaiController);

});
