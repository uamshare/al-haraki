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
            'SiswaRombelService',
            'TahunAjaranService'
        ];

    var RombelController = function (
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
            SiswaRombelService,
            TahunAjaranService
        )
    {
        $scope.viewdir = $CONST_VAR.viewsDirectory + 'master/rombel/';
        var $resourceApi = SiswaRombelService;
        //========================Grid Config =======================

        function errorHandle(error){
            var msg = error.data.name;
            toastr.warning(msg, 'Warning');
        }

        var indexController = function(){
            
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
                    { name: 'nisn', displayName: 'NISN', visible: false, width : '120', enableCellEdit: false},
                    { name: 'nama_siswa', displayName: 'Nama Siswa', visible: true, enableCellEdit: false},
                    { name: 'sekolahid', displayName: 'Sekolah', visible: false, width : '75',  enableCellEdit: false},
                    { name: 'tahun_ajaran_id', displayName: 'Tahun Ajaran', visible: false, width : '75',  enableCellEdit: false},
                    { name: 'created_at', displayName: 'Created At', visible: false, width : '75',  enableCellEdit: false},
                    { name: 'updated_at', displayName: 'Updated At', visible: false, width : '75',  enableCellEdit: false}
                ]
            }

            $scope.gridRombel1 = {
                enableMinHeightCheck : true,
                minRowsToShow : 35,
                enableGridMenu: true,
                enableSelectAll: true,
                enableFiltering: true,
                enableCellEditOnFocus: true,
                enableGroupHeaderSelection : true,
                columnDefs : [
                    { name: 'index', displayName : 'No', width : '50', visible: false, enableFiltering : false ,  enableCellEdit: false},
                    { name: 'id', displayName: 'ID', visible: false, width : '50' ,  enableCellEdit: false},
                    { name: 'kelasid', displayName: 'KelasID', visible: false, width : '50' ,  enableCellEdit: false},
                    { name: 'siswaid', displayName: 'SiswaID', visible: false, width : '50' ,  enableCellEdit: false},
                    { name: 'kelas', displayName: 'Kelas', visible: false, width : '75',  enableCellEdit: false},
                    { name: 'nama_kelas', displayName: 'Nama Kelas', visible: false, width : '75',  enableCellEdit: false},
                    {
                        name: 'kelasRender',
                        displayName: 'Kelas',
                        grouping: { groupPriority: 1 },
                        sort: { priority: 1, direction: 'asc' },
                        width: '135',
                    },
                    { name: 'nis', displayName: 'NIS', visible: true, width : '120', enableCellEdit: false},
                    { name: 'nisn', displayName: 'NISN', visible: false, width : '120', enableCellEdit: false},
                    { name: 'nama_siswa', displayName: 'Nama Siswa', visible: true, enableCellEdit: false},
                    { name: 'sekolahid', displayName: 'Sekolah', visible: false, width : '75',  enableCellEdit: false},
                    { name: 'tahun_ajaran_id', displayName: 'Tahun Ajaran', visible: false, width : '75',  enableCellEdit: false},
                    { name: 'created_at', displayName: 'Created At', visible: false, width : '75',  enableCellEdit: false},
                    { name: 'updated_at', displayName: 'Updated At', visible: false, width : '75',  enableCellEdit: false}
                ]
            };

            $scope.gridRombel2 = {
                enableMinHeightCheck : true,
                minRowsToShow : 35,
                enableGridMenu: true,
                enableSelectAll: true,
                enableFiltering: true,
                enableCellEditOnFocus: true,
                columnDefs : grid.columnDefs
            };

            $scope.filter = {
                kelas: [],
                tahun_ajaran1 : [],
                tahun_ajaran2 : []
            };

            $scope.filter1 = {
                kelas : '',
                tahun_ajaran : '',
            }

            $scope.filter2 = {
                kelas : '',
                tahun_ajaran : '',
            }

            function getTahunAjaran(prev){
                if(typeof prev == 'undefined') prev = false;

                var awal,akhir;
                var sekolahProfile = authService.getSelectedTahun(); // authService.getSekolahProfile()
                if(prev){
                    awal = parseInt(sekolahProfile.tahun_awal) - 1;
                    akhir = parseInt(sekolahProfile.tahun_akhir) - 1;
                }else{
                    awal = parseInt(sekolahProfile.tahun_awal);
                    akhir = parseInt(sekolahProfile.tahun_akhir);
                }
                return {
                    id : awal.toString() + akhir.toString().substr(-2),
                    name : awal.toString() + ' / ' + akhir.toString()
                }
            }

            function getSiswaRombel(paramdata, grid){
                paramdata['page'] = 1;
                paramdata['per-page'] = 0;
                paramdata['sekolahid'] = authService.getSekolahProfile().sekolahid;

                cfpLoadingBar.start();
                SiswaRombelService.get(paramdata)
                .then(function (result) {
                    if(result.success){
                        $scope[grid].data = [];
                        for(var idx in result.rows){
                            var romnum = parseInt(idx) + 1;
                            result.rows[idx]["index"] = romnum;
                            result.rows[idx]["kelasRender"] = result.rows[idx].kelas + ' - ' + result.rows[idx].nama_kelas;
                        }
                        $scope[grid].data = result.rows;
                    }
                    cfpLoadingBar.complete();
                }, errorHandle);
            }

            function getkelas(params){
                KelasService.getList(params)
                .then(function (result) {
                    if(result.success){
                        if(result.success){
                            $scope.filter.kelas = result.rows;
                        }
                        $scope.filter.tahun_ajaran1 = getTahunAjaran(true);
                        $scope.filter.tahun_ajaran2 = getTahunAjaran();
                        $scope.filter1.tahun_ajaran = $scope.filter.tahun_ajaran1.id;
                        $scope.filter2.tahun_ajaran = $scope.filter.tahun_ajaran2.id;

                        getSiswaRombel({
                            tahun_ajaran_id : $scope.filter1.tahun_ajaran,
                            tahun_ajaran_id_new : $scope.filter2.tahun_ajaran,
                            scenario : 'rombel_old'
                        }, 'gridRombel1');
                    }   
                }, function(error){
                    toastr.warning('Kelas tidak bisa dimuat. Silahkan klik tombol tambah', 'Warning');
                });
            }

            function addGridRombel2(gridata, idx){
                var index = (typeof idx != 'undefined') ? idx : $scope.gridRombel2.data.length + 1;
                $scope.gridRombel2.data.push({
                    "index": index,
                    "id": (typeof detail != 'undefined') ? detail.kode : '',
                    "kelasid": $scope.form.no_kwitansi,
                    "siswaid": (typeof detail != 'undefined') ? detail.rincian : '',
                    "kelas": (typeof detail != 'undefined') ? detail.jumlah : 0,
                    "nama_kelas": 1,
                    "nis": 1,
                    "nisn": 1,
                    "nama_siswa": 1,
                    "sekolahid": 1,
                    "tahun_ajaran_id": 1
                });
            }

            function selectAllChildren(gridApi, rowEntity){
                if(rowEntity.children.length==0){
                    gridApi.selection.selectRow(rowEntity.row.entity);
                }else{
                    var childrens = rowEntity.children;
                    for (var j = 0, length = childrens.length; j < length; j++) {
                        selectAllChildren(gridApi,childrens[j]);
                    }
                }
            }
            function unSelectAllChildren(gridApi, rowEntity){
                if(rowEntity.children.length==0){
                    gridApi.selection.unSelectRow(rowEntity.row.entity);
                }else{
                    var childrens = rowEntity.children;
                    for (var j = 0, length = childrens.length; j < length; j++) {
                        unSelectAllChildren(gridApi,childrens[j]);
                    }
                }
            }

            $scope.gridRombel1.onRegisterApi = function(gridApi){
                $scope.gridApi1 = gridApi;
                // $scope.gridApi1.grid.registerDataChangeCallback(function(e) {
                //     $scope.gridApi1.treeBase.expandAllRows();
                // });
                $scope.gridApi1.selection.on.rowSelectionChanged($scope, function (row) {
                    if(row.internalRow==true && row.isSelected==true){
                        var childRows = row.treeNode.children;
                        for (var j = 0, length = childRows.length; j < length; j++) {
                            selectAllChildren($scope.gridApi1,childRows[j]);
                        }
                    }
                    if(row.internalRow==true && row.isSelected==false){
                        var childRows   = row.treeNode.children;
                        for (var j = 0, length = childRows.length; j < length; j++) {
                            unSelectAllChildren($scope.gridApi1,childRows[j]);
                        }
                    }
                });
            };
            
            $scope.gridRombel2.onRegisterApi = function(gridApi){
                $scope.gridApi2 = gridApi;
            };

            function moveToRight(){
                $scope.gridRombelSelection.rombel1 = $scope.gridApi1.selection.getSelectedRows();
                // console.log($scope.gridRombelSelection.rombel1);
                function successHandle(result){
                    if(result.success){
                        $scope.onFilterChange(2);
                        getSiswaRombel({
                            tahun_ajaran_id : $scope.filter1.tahun_ajaran,
                            scenario : 'rombel_old'
                        }, 'gridRombel1');
                        cfpLoadingBar.complete();
                        // $location.path( "/master/kelas/");
                    }else{
                        toastr.error('Data gagal tersimpan.' + result.message, 'Error');
                        cfpLoadingBar.complete();
                    }
                }
                cfpLoadingBar.start();
                $resourceApi.insert({
                    kelasid : $scope.filter2.kelas,
                    sekolahid : authService.getSekolahProfile().sekolahid,
                    tahun_ajaran_id : $scope.filter2.tahun_ajaran,
                    rombels : $scope.gridRombelSelection.rombel1
                })
                .then(successHandle, errorHandle);
            }

            function moveToLeft(){
                $scope.gridRombelSelection.rombel2 = $scope.gridApi2.selection.getSelectedRows();
                console.log($scope.gridRombelSelection.rombel2);

                function successHandle(result){
                    if(result.success){
                        $scope.onFilterChange(2);
                        getSiswaRombel({
                            tahun_ajaran_id : $scope.filter1.tahun_ajaran,
                            scenario : 'rombel_old'
                        }, 'gridRombel1');
                        cfpLoadingBar.complete();
                    }else{
                        toastr.error('Error.' + result.message, 'Error');
                        cfpLoadingBar.complete();
                    }
                }
                var arrId = [];
                for(var idx in $scope.gridRombelSelection.rombel2){
                    arrId.push($scope.gridRombelSelection.rombel2[idx].id);
                }

                cfpLoadingBar.start();
                $resourceApi.deleteRombelBySelection(arrId.toString())
                .then(successHandle, errorHandle);
            }

            $scope.gridRombelSelection = {
                rombel1 : [],
                rombel2 : []
            }

            $scope.onMoveRombelClick = function(side){
                // if(($scope.filter1.kelas == '' || $scope.filter1.kelas == null)){
                //     toastr.warning('Kelas Rombel sebelah kiri belum dipilih', 'Warning');
                //     return false;
                // }

                if(($scope.filter2.kelas == '' || $scope.filter2.kelas == null)){
                    toastr.warning('Kelas Rombel sebelah kanan belum dipilih', 'Warning');
                    return false;
                }

                eval(side + '()');
            }

            $scope.onFilterChange = function(type){
                if(($scope['filter' + type].kelas == '' || $scope['filter' + type].kelas == null)){
                    return false;
                }
                getSiswaRombel({
                    tahun_ajaran_id : $scope['filter' + type].tahun_ajaran,
                    kelasid : $scope['filter' + type].kelas
                }, 'gridRombel' + type);

            }
            this.init = function(){
                // $scope.form.sekolahid = authService.getSekolahProfile().sekolahid.toString();
                getkelas({
                    page : 1,
                    "per-page" : 0,
                    sekolahid : authService.getSekolahProfile().sekolahid
                });
            }

        }

        var controller;
        switch($location.$$url){
            case '/master/rombel/kelola':
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
    RombelController.$inject = injectParams;


    app.register.controller('RombelController', RombelController);

});
