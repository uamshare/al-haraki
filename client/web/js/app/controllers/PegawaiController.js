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
        var $resourceApi = PegawaiService;
        //========================Grid Config =======================

        function errorHandle(error){
            var msg = error.data.name;
            toastr.warning(msg, 'Warning');
        }

        var indexController = function(){
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

            $scope.getList = function(paramdata){
                paramdata['sekolahid'] = authService.getSekolahProfile().sekolahid;
                cfpLoadingBar.start();
                $resourceApi.get(paramdata)
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
                // $scope.gridApi.grid.registerDataChangeCallback(function(e) {
                //     $scope.gridApi.treeBase.expandAllRows();
                // });
            }
            
            $scope.onAddClick = function(event){
                $location.path( "/master/karyawan/add");
            }

            $scope.onEditClick = function(rowdata){
                $location.path( "/master/karyawan/edit/" + rowdata.id);
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

                var del = confirm("Anda yakin akan menghapus data `" + rowdata.nama_pegawai + "`");
                if (del == true) {
                    deleteData(rowdata.id);
                }
            }

            this.init = function(){
                $scope.getList({
                    page : 1,
                    'per-page' : 20
                });
            }
        }
        
        var addEditController = function(){
            $scope.form = {
                id : '',
                nik : '',
                nuptk : '',
                nama_pegawai : '',
                nama_panggilan : '',
                sekolahid : authService.getSekolahProfile().sekolahid,
                // jk : '',
                // berat : '',
                // tinggi : '',
                // gol_darah : '',
                // agama : '',
                // tempat_lahir : '',
                // tanggal_lahir : '',
                avatar : '',
                created_at : '',
                updated_at : ''
            }

            function reset(){
                $scope.form.id = '';
                $scope.form.kelas = '';
                $scope.form.nama_kelas = '';
                $scope.form.sekolahid = authService.getSekolahProfile().sekolahid;
            }

            $scope.profilAvatar = ($scope.form.avatar == '') ? BASEURL + 'img/profil/user-default.png' : $scope.form.avatar;
            $scope.onSaveClick = function(event){
                if($scope.form.nik == '' || $scope.form.nik == null){
                    toastr.warning('NIK tidak boleh kosong.', 'Warning');
                    return false;
                }

                if($scope.form.nama_pegawai == '' || $scope.form.nama_pegawai == null){
                    toastr.warning('Nama Karyawan tidak boleh kosong.', 'Warning');
                    return false;
                }

                function successHandle(result){
                    if(result.success){
                        toastr.success('Data telah tersimpan', 'Success');
                        reset();
                        cfpLoadingBar.complete();
                        $location.path( "/master/karyawan/");
                    }else{
                        if(typeof result[0] != 'undefined'){
                            result.message = result[0].message;
                        }
                        toastr.error('Data gagal tersimpan. ' + result.message, 'Error');
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

            function getById(id){
                cfpLoadingBar.start();
                $resourceApi.getById(id)
                .then(function (result) {
                    if(result.success){
                        // for(var key in result.rows){
                        //     if(typeof $scope.form[key] != 'undefined'){
                        //         $scope.form[key] = result.rows[key]
                        //     }
                        // }
                        $scope.form = result.rows;
                    }
                    cfpLoadingBar.complete();
                }, errorHandle);
            }

            this.init = function(id){
                if($routeParams.id){
                    getById($routeParams.id);
                    // getById({
                    //     kelasid : $routeParams.id
                    // });
                }
            }
        }

        $scope.$on('$viewContentLoaded', function(){
            // init();
        });

        var controller;
        switch($location.$$url){
            case '/master/karyawan/add':
                controller = new addEditController();
                break;
            case '/master/karyawan/edit/' + $routeParams.id:
                controller = new addEditController();
                break;
            default :
                controller = new indexController();
                break;
        }

        $timeout(function() {
            controller.init();
        }, 1000);
    }
    PegawaiController.$inject = injectParams;


    app.register.controller('PegawaiController', PegawaiController);

});
