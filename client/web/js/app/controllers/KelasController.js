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
            'KelasService',
            'cfpLoadingBar',
            'toastr'
        ];

    var KelasController = function (
            $CONST_VAR,
            $scope, 
            $location, 
            $routeParams, 
            $http, 
            $log, 
            $timeout,
            KelasService,
            cfpLoadingBar,
            toastr
        ) 
    {
        $scope.viewdir = $CONST_VAR.viewsDirectory + 'master/kelas/';
        var $resourceApi = KelasService;
        //========================Grid Config =======================
        
        var grid = {
            columnDefs : [
                { name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
                { name: 'id', displayName: 'ID', visible: false, width : '50' ,  enableCellEdit: false},
                { name: 'kelas', displayName: 'Kelas', visible: true, width : '75',  enableCellEdit: false},
                { name: 'nama_kelas', displayName: 'Nama Kelas', visible: true, enableCellEdit: false},
                { name: 'sekolahid', displayName: 'Sekolah', visible: false, width : '75',  enableCellEdit: false},
                { name: 'created_at', displayName: 'Created At', visible: false, width : '75',  enableCellEdit: false},
                { name: 'updated_at', displayName: 'Updated At', visible: false, width : '75',  enableCellEdit: false}
            ]
        }
        var columnActionTpl =   '<div class="col-action">' + 
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
            cellTemplate : columnActionTpl
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

        $scope.form = {
            id : '',
            kelas : '',
            nama_kelas : '',
            sekolahid : '',
            created_at : '',
            updated_at : ''
        }

        $scope.kelasList = [1,2,3,4,5,6,7,8,9];
        $scope.sekolah = [
            {id : '1', nama : 'SDIT'},
            {id : '2', nama : 'SMPIT'}
        ];

        function errorHandle(error){
            var msg = error.data.name;
            toastr.warning(msg, 'Warning');
        }

        function reset(){
            $scope.form.id = '';
            $scope.form.kelas = '';
            $scope.form.nama_kelas = '';
            $scope.form.sekolahid = '';
        }

        $scope.getList = function (paramdata){
            cfpLoadingBar.start();
            $resourceApi.get(paramdata.page, paramdata.perPage)
            .then(function (result) {
                if(result.success){
                    angular.forEach(result.rows, function(dt, index) {
                        var romnum = index + 1;
                        result.rows[index]["index"] = romnum;
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
                    toastr.success('Data telah dihapus', 'Success');
                    cfpLoadingBar.complete();
                    $scope.getList({
                        page : 1,
                        perPage : 20
                    });
                    // if(result.success){
                    //     console.log(result);
                    //     toastr.success('Data telah dihapus', 'Success');
                    //     cfpLoadingBar.complete();
                    //     $scope.getList({
                    //         page : 1,
                    //         perPage : 20
                    //     });
                    // }else{
                    //     toastr.success('Data gagal dihapus.<br/>' + result.message, 'Success');
                    //     cfpLoadingBar.complete();
                    // }
                }, errorHandle);
            }

            var del = confirm("Anda yakin akan menghapus data `" + rowdata.nama_kelas + "`");
            if (del == true) {
                deleteData(rowdata.id);
            }
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
                    toastr.success('Data gagal tersimpan.<br/>' + result.message, 'Success');
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

        $scope.grid.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                $scope.grid.pageNumber = newPage;
                $scope.grid.pageSize = pageSize;
                $scope.grid.virtualizationThreshold = pageSize; 
                $scope.getList({
                    page : newPage,
                    perPage : pageSize
                });
            });
        }

        function initIndex(){
            $scope.getList({
                page : 1,
                perPage : 20
            });
        }

        function initAdd(){
            
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

        function init(){
            if($routeParams.id){
                initEdit($routeParams.id);
            }else{
                initIndex();
            }
        }

        $scope.$on('$viewContentLoaded', function(){
            // init();
        });
        
        $timeout(function() {
            init();
        }, 1000);
    }
    KelasController.$inject = injectParams;


    app.register.controller('KelasController', KelasController);

});