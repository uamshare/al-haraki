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
            'KelasService',
            'cfpLoadingBar',
            'toastr',
            'SiswaRombelService'
        ];

    var KelasController = function (
            $CONST_VAR,
            $scope,
            $location,
            $routeParams,
            $http,
            $log,
            $timeout,
            authService,
            KelasService,
            cfpLoadingBar,
            toastr,
            SiswaRombelService
        )
    {
        $scope.viewdir = $CONST_VAR.viewsDirectory + 'master/kelas/';
        var $resourceApi = KelasService;
        //========================Grid Config =======================



        function errorHandle(error){
            var msg = error.data.name;
            toastr.warning(msg, 'Warning');
        }

        var indexController = function(){
            var grid = {
                columnDefs : [
                    { name: 'index', displayName : 'No', width : '50', visible: false, enableFiltering : false ,  enableCellEdit: false},
                    { name: 'id', displayName: 'ID', visible: false, width : '50' ,  enableCellEdit: false},
                    { name: 'kelas', displayName: 'Kelas', visible: false, width : '75',  enableCellEdit: false},
                    {
                        name: 'kelasRender',
                        displayName: 'Kelas',
                        grouping: { groupPriority: 1 },
                        sort: { priority: 1, direction: 'asc' },
                        width: '200',
                    },
                    { name: 'nama_kelas', displayName: 'Nama Kelas', visible: true, enableCellEdit: false},
                    { name: 'siswacount', displayName: 'Jml Siswa', width : '120', visible: true, enableCellEdit: false},
                    { name: 'sekolahid', displayName: 'Sekolah', visible: false, width : '75',  enableCellEdit: false},
                    { name: 'created_at', displayName: 'Created At', visible: false, width : '75',  enableCellEdit: false},
                    { name: 'updated_at', displayName: 'Updated At', visible: false, width : '75',  enableCellEdit: false}
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

            $scope.getList = function (paramdata){
                paramdata['sekolahid'] = authService.getSekolahProfile().sekolahid;
                paramdata['tahun_ajaran_id'] = authService.getSekolahProfile().tahun_ajaran_id;
                cfpLoadingBar.start();
                $resourceApi.getList(paramdata)
                .then(function (result) {
                    if(result.success){
                        angular.forEach(result.rows, function(dt, index) {
                            var romnum = (paramdata.page > 1) ? (((paramdata.page - 1) * $scope.grid.pageSize) + index + 1) : (index + 1);
                            result.rows[index]["index"] = romnum;
                            result.rows[index]["kelasRender"] = 'Kelas - ' + result.rows[index].kelas;
                            result.rows[index]["siswacount"] = result.rows[index].siswacount + ' Siswa';
                        })
                        $scope.grid.data = result.rows;
                        $scope.grid.totalItems = result.total;
                        $scope.grid.paginationCurrentPage = paramdata.page;
                    }
                    cfpLoadingBar.complete();
                }, errorHandle);
            }

            $scope.onAddClick = function(event){
                $location.path( "/master/kelas/add");
            }

            $scope.onEditClick = function(rowdata){
                $location.path( "/master/kelas/edit/" + rowdata.id);
            }

            $scope.onDeleteClick = function(rowdata){
                function deleteData(id){
                    cfpLoadingBar.start();
                    $resourceApi.delete(id)
                    .then(function(result){
                        if(result.success){
                            toastr.success('Data telah dihapus', 'Success');
                            cfpLoadingBar.complete();
                            $scope.getList({
                                page : 1,
                                'per-page' : 20
                            });
                        }else{
                            toastr.error('Data gagal dihapus.' + result.message, 'Error');
                            cfpLoadingBar.complete();
                        }

                    }, errorHandle);
                }

                var del = confirm("Anda yakin akan menghapus data `" + rowdata.nama_kelas + "`");
                if (del == true) {
                    deleteData(rowdata.id);
                }
            }

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

            this.init = function(){
                $scope.getList({
                    page : 1,
                    'per-page' : 20
                });
            }
        }

        var addEditController = function(){
            var grid = {
                columnDefs : [
                    { name: 'index', displayName : 'No', width : '50', visible: true, enableFiltering : false ,  enableCellEdit: false},
                    { name: 'id', displayName: 'ID', visible: false, width : '50' ,  enableCellEdit: false},
                    { name: 'kelasid', displayName: 'KelasID', visible: false, width : '50' ,  enableCellEdit: false},
                    { name: 'siswaid', displayName: 'SiswaID', visible: false, width : '50' ,  enableCellEdit: false},
                    { name: 'kelas', displayName: 'Kelas', visible: false, width : '75',  enableCellEdit: false},
                    { name: 'nama_kelas', displayName: 'Nama Kelas', visible: false, width : '75',  enableCellEdit: false},
                    { name: 'nis', displayName: 'NIS', visible: true, width : '120', enableCellEdit: false},
                    { name: 'nisn', displayName: 'NISN', visible: true, width : '120', enableCellEdit: false},
                    { name: 'nama_siswa', displayName: 'Nama Siswa', visible: true, enableCellEdit: false},
                    { name: 'sekolahid', displayName: 'Sekolah', visible: false, width : '75',  enableCellEdit: false},
                    { name: 'tahun_ajaran_id', displayName: 'Tahun Ajaran', visible: false, width : '75',  enableCellEdit: false},
                    { name: 'created_at', displayName: 'Created At', visible: false, width : '75',  enableCellEdit: false},
                    { name: 'updated_at', displayName: 'Updated At', visible: false, width : '75',  enableCellEdit: false}
                ]
            }

            $scope.gridSiswa = {
                enableMinHeightCheck : true,
                minRowsToShow : 35,
                enableGridMenu: true,
                enableSelectAll: true,
                enableFiltering: true,
                enableCellEditOnFocus: true,
                columnDefs : grid.columnDefs
            };

            $scope.form = {
                id : '',
                kelas : '',
                nama_kelas : '',
                sekolahid : authService.getSekolahProfile().sekolahid,
                created_at : '',
                updated_at : ''
            }

            $scope.kelasList = [1,2,3,4,5,6,7,8,9];
            $scope.sekolah = [
                {id : '1', nama : 'SDIT'},
                {id : '2', nama : 'SMPIT'}
            ];

            function reset(){
                $scope.form.id = '';
                $scope.form.kelas = '';
                $scope.form.nama_kelas = '';
                $scope.form.sekolahid = authService.getSekolahProfile().sekolahid;
            }

            function getSiswa(paramdata){
                paramdata['page'] = 1;
                paramdata['per-page'] = 0;
                paramdata['sekolahid'] = authService.getSekolahProfile().sekolahid;
                paramdata['tahun_ajaran_id'] = authService.getSekolahProfile().tahun_ajaran_id;

                cfpLoadingBar.start();
                SiswaRombelService.get(paramdata)
                .then(function (result) {
                    if(result.success){
                        angular.forEach(result.rows, function(dt, index) {
                            var romnum = (paramdata.page > 1) ? (((paramdata.page - 1) * $scope.grid.pageSize) + index + 1) : (index + 1);
                            result.rows[index]["index"] = romnum;
                        })
                        $scope.gridSiswa.data = result.rows;
                    }
                    cfpLoadingBar.complete();
                }, errorHandle);
            }

            $scope.onSaveClick = function(event){
                if($scope.form.kelas == '' || $scope.form.kelas == null){
                    toastr.warning('Kelas tidak boleh kosong.', 'Warning');
                    return false;
                }

                if($scope.form.nama_kelas == '' || $scope.form.nama_kelas == null){
                    toastr.warning('Nama Kelas tidak boleh kosong.', 'Warning');
                    return false;
                }

                if($scope.form.sekolahid == '' || $scope.form.sekolahid == null){
                    toastr.warning('Sekolah tidak boleh kosong.', 'Warning');
                    return false;
                }

                function successHandle(result){
                    if(result.success){
                        toastr.success('Data telah tersimpan', 'Success');
                        reset();
                        cfpLoadingBar.complete();
                        $location.path( "/master/kelas/");
                    }else{
                        toastr.error('Data gagal tersimpan.' + result.message, 'Error');
                        cfpLoadingBar.complete();
                    }
                }
                cfpLoadingBar.start();
                if($scope.form.id != ''){
                    $resourceApi.update($scope.form)
                    .then(successHandle, errorHandle);
                }else{
                    $resourceApi.insert($scope.form)
                    .then(successHandle, errorHandle);
                }
            }

            $scope.onResetClick = function(event){
                reset();
            }

            function initEdit(id){
                cfpLoadingBar.start();
                $resourceApi.getById(id)
                .then(function (result) {
                    if(result.success){
                        $scope.form.id = result.rows.id;
                        $scope.form.kelas = result.rows.kelas;
                        $scope.form.nama_kelas = result.rows.nama_kelas;
                        $scope.form.sekolahid = result.rows.sekolahid;
                        $scope.form.created_at = result.rows.created_at;
                        $scope.form.updated_at = result.rows.updated_at;
                    }
                    cfpLoadingBar.complete();
                }, errorHandle);
            }

            this.init = function(){
                $scope.form.sekolahid = authService.getSekolahProfile().sekolahid.toString();
                if($routeParams.id){
                    initEdit($routeParams.id);
                    getSiswa({
                        kelasid : $routeParams.id
                    });
                }
            }

        }

        var detailController = function(){

        }

        var controller;
        switch($location.$$url){
            case '/master/kelas/add':
                controller = new addEditController();
                break;
            case '/master/kelas/edit/' + $routeParams.id:
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
            controller.init();
        }, 1000);
    }
    KelasController.$inject = injectParams;


    app.register.controller('KelasController', KelasController);

});
