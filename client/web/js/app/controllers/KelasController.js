'use strict';



define(['app'], function (app) {

    var injectParams = [
            '$CONST_VAR',
            '$scope',
            '$location',
            '$routeParams',
            '$http',
            '$log',
            'ngDialog',
            '$timeout',
            'authService',
            'KelasService',
            'cfpLoadingBar',
            'toastr',
            'SiswaRombelService',
            'helperService'
        ];

    var KelasController = function (
            $CONST_VAR,
            $scope,
            $location,
            $routeParams,
            $http,
            $log,
            ngDialog,
            $timeout,
            authService,
            KelasService,
            cfpLoadingBar,
            toastr,
            SiswaRombelService,
            helperService
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
                    { name: 'index', displayName : 'No', width : '50', enableFiltering : false, enableColumnMenu : false},
                    { name: 'id', displayName: 'ID', visible: false, width : '50', enableCellEdit: false, enableColumnMenu : false},
                    { name: 'kelasid', displayName: 'KelasID', visible: false, width : '50' ,  enableCellEdit: false},
                    { name: 'siswaid', displayName: 'SiswaID', visible: false, width : '50' ,  enableCellEdit: false},
                    { name: 'kelas', displayName: 'Kelas', visible: false, width : '75',  enableCellEdit: false},
                    { name: 'nama_kelas', displayName: 'Nama Kelas', visible: false, width : '75',  enableCellEdit: false},

                    { name: 'nis', displayName: 'NIS', visible: true, width : '100', enableCellEdit: true},
                    { name: 'nisn', displayName: 'NISN', visible: true, width : '100', enableCellEdit: true},
                    // { name: 'nama_siswa', displayName: 'Nama Siswa', visible: true, enableCellEdit: false},
                    { 
                        name: 'nama_siswa', 
                        displayName: 'Nama Siswa', 
                        visible: true, 
                        enableCellEdit: false,
                        cellTemplate:'<div class="ui-grid-cell-contents ng-binding ng-scope">' +
                                   '<a class="column-link" href="#/master/siswa/view/{{row.entity.siswaid}}">{{row.entity.nama_siswa}}</a>' +
                                   '</div>'
                    },
                    { name: 'nama_panggilan', displayName: 'Nama Panggilan', visible: false, width : '150', enableCellEdit: false},
                    { name: 'jk', displayName: 'JK', visible: true, width : '50', enableCellEdit: false},
                    { name: 'asal_sekolah', displayName : 'Sekolah Asal', visible: false, width : '50', enableFiltering : true , enableCellEdit: false},
                    { name: 'tempat_lahir', displayName: 'Tempat Lahir', visible: true, width : '150' , enableCellEdit: false},
                    { name: 'tanggal_lahir', displayName: 'Tanggal Lahir', visible: true, width : '150', enableCellEdit: false},
                    { name: 'anak_ke', displayName: 'Anak Ke', visible: false, width : '300', enableCellEdit: false},
                    { name: 'jml_saudara', displayName: 'Jml Saudara', visible: false, width : '150', enableCellEdit: false},
                    { name: 'berat', displayName: 'Berat', visible: false, width : '150', enableCellEdit: false},
                    { name: 'tinggi', displayName : 'Tinggi', visible: false, width : '50', enableFiltering : true , enableCellEdit: false},
                    { name: 'gol_darah', displayName: 'Gol Darag', visible: false, width : '50' , enableCellEdit: false},
                    { name: 'riwayat_kesehatan', displayName: 'Riwayat Kesehatan', visible: false, width : '300', enableCellEdit: false},
                    { name: 'alamat', displayName: 'Alamat', visible: false, width : '300', enableCellEdit: false},
                    { name: 'kelurahan', displayName: 'Kelurahan', visible: false, width : '150', enableCellEdit: false},
                    { name: 'kecamatan', displayName: 'Kecamatan', visible: false, width : '150', enableCellEdit: false},
                    { name: 'kota', displayName : 'Kota', visible: false, width : '50', enableFiltering : true , enableCellEdit: false},
                    { name: 'kodepos', displayName: 'Kode POS', visible: false, width : '50' , enableCellEdit: false},
                    { name: 'tlp_rumah', displayName: 'Tlp Rumah', visible: false, width : '100', enableCellEdit: false},
                    { name: 'nama_ayah', displayName: 'Ayah', visible: false, width : '300', enableCellEdit: false},
                    { name: 'hp_ayah', displayName: 'HP', visible: false, width : '150', enableCellEdit: false},
                    { name: 'pekerjaan_ayah', displayName: 'Pekerjaan', visible: false, width : '150', enableCellEdit: false},
                    { name: 'tempat_kerja_ayah', displayName : 'Tempat Kerja', visible: false, width : '50', enableFiltering : true , enableCellEdit: false},
                    { name: 'jabatan_ayah', displayName: 'Jabatan', visible: false, width : '50' , enableCellEdit: false},
                    { name: 'pendidikan_ayah', displayName: 'Pendidikan', visible: false, width : '100', enableCellEdit: false},
                    { name: 'email_ayah', displayName: 'Email', visible: false, width : '300', enableCellEdit: false},
                    { name: 'nama_ibu', displayName: 'Ibu', visible: false, width : '150', enableCellEdit: false},
                    { name: 'hp_ibu', displayName: 'HP', visible: false, width : '150', enableCellEdit: false},
                    { name: 'pekerjaan_ibu', displayName : 'Pekerjaan', visible: false, width : '50', enableFiltering : true , enableCellEdit: false},
                    { name: 'tempat_kerja_ibu', displayName: 'Tempat Kerja', visible: false, width : '50' , enableCellEdit: false},
                    { name: 'jabatan_ibu', displayName: 'Jabatan', visible: false, width : '100', enableCellEdit: false},
                    { name: 'pendidikan_ibu', displayName: 'Pendidikan', visible: false, width : '300', enableCellEdit: false},
                    { name: 'email_ibu', displayName: 'Email', visible: false, width : '150', enableCellEdit: false},
                    { name: 'jenis_tempat_tinggal', displayName: 'Tempat Tinggal', visible: false, width : '150', enableCellEdit: false},
                    { name: 'jarak_ke_sekolah', displayName: 'Jarak (km)', visible: false, width : '150', enableCellEdit: false},
                    { name: 'sarana_transportasi', displayName: 'Transportasi', visible: false, width : '150', enableCellEdit: false},
                    { name: 'keterangan', displayName: 'Keterangan', visible: false, width : '350', enableCellEdit: false},
                    { name: 'sekolahid', displayName: 'Sekolah', visible: false, width : '75',  enableCellEdit: false},
                    { name: 'tahun_ajaran_id', displayName: 'Tahun Ajaran', visible: false, width : '75',  enableCellEdit: false},
                    { name: 'created_at', displayName: 'Created At', visible: false, width : '75',  enableCellEdit: false},
                    { name: 'updated_at', displayName: 'Updated At', visible: false, width : '75',  enableCellEdit: false}
                ]
            }

            var columnActionTpl =   '<div class="col-action" ng-show="row.entity.id">' +
                                        '<a href="" ng-click="grid.appScope.onEditClick(row.entity)" >' +
                                            '<span class="badge bg-blue"><i class="fa fa-edit"></i></span>' +
                                        '</a>&nbsp;' +
                                    '</div>';
            grid.columnDefs.push({
                name :' ',
                enableFiltering : false,
                width : '75',
                enableSorting : false,
                enableCellEdit: false,
                cellTemplate : columnActionTpl,
                cellClass: 'grid-align-right'
            });


            $scope.gridSiswa = {
                enableMinHeightCheck : true,
                minRowsToShow : 35,
                enableGridMenu: true,
                enableSelectAll: true,
                enableFiltering: true,
                enableCellEditOnFocus: true,
                exporterCsvFilename: 'siswa.csv',
                exporterMenuPdf : false,
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
            $scope.kelas = [];
            $scope.sekolah = [
                {id : '1', nama : 'SDIT'},
                {id : '2', nama : 'SMPIT'}
            ];

            function getkelas(params){
                KelasService.getList(params)
                .then(function (result) {
                    if(result.success){
                        if(result.success){
                            $scope.kelas = result.rows;
                        }
                    }   
                }, function(error){
                    toastr.warning('Kelas tidak bisa dimuat. Silahkan klik tombol tambah', 'Warning');
                });
            }

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
                paramdata['scenario'] = '1' // include all siswa;

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

            $scope.formEdit = {
                id : '',
                siswaid : '',
                nama_siswa : '',
                kelasid : '',
                sekolahid : authService.getSekolahProfile().sekolahid,
                tahun_ajaran_id : authService.getSekolahProfile().tahun_ajaran_id,
            }

            $scope.onEditClick = function(rowdata){
                $scope.formEdit.id = parseInt(rowdata.id);
                $scope.formEdit.siswaid = parseInt(rowdata.siswaid);
                $scope.formEdit.nama_siswa = rowdata.nama_siswa;
                $scope.formEdit.kelasid = parseInt(rowdata.kelasid);

                // console.log($scope.formEdit.kelasid);

                ngDialog.open({
                    template: $scope.viewdir + 'edit_form.html',
                    className: 'ngdialog-theme-flat dialog-custom1 dialog-gray custom-width-50',
                    scope: $scope,
                    width: '100%',
                    height: '100%'
                });
                $scope.formEdit.kelasid = rowdata.kelasid;
            }

            $scope.onCancelEditClick = function(){
                $scope.formEdit.kelasid = 2;
                // ngDialog.close();
            }

            $scope.onSaveEditClick = function(){
                if($scope.formEdit.siswaid == '' || $scope.formEdit.siswaid == null){
                    toastr.warning('Siswa tidak boleh kosong.', 'Warning');
                    return false;
                }

                if($scope.formEdit.kelasid == '' || $scope.formEdit.kelasid == null){
                    toastr.warning('Kelas tidak boleh kosong.', 'Warning');
                    return false;
                }

                function successHandle(result){
                    if(result.success){
                        toastr.success('Data telah tersimpan', 'Success');
                        ngDialog.close();
                        cfpLoadingBar.complete();
                        getSiswa({
                            kelasid : $routeParams.id
                        });
                    }else{
                        toastr.error('Data gagal tersimpan.' + result.message, 'Error');
                        cfpLoadingBar.complete();
                    }
                }
                cfpLoadingBar.start();
                SiswaRombelService.update($scope.formEdit)
                .then(successHandle, errorHandle);
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
                        $scope.gridSiswa.exporterCsvFilename = result.rows.kelas + "_" + result.rows.nama_kelas + '.csv';
                    }
                    cfpLoadingBar.complete();
                }, errorHandle);
            }

            var exportTo = {
                pdf : function (griddata, rangeWeek){
                },
                xls : function(griddata){
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
                        var ctx = { worksheet : name || 'Siswa ' + postfix, table : table.innerHTML }

                        var a = document.createElement('a');
                        a.href = uri + base64(format(template, ctx));
                        a.download = 'cashflow' + postfix + '.xls';
                        a.click();
                        // return false;
                    }
                    return download('grid2');
                }
            }

            $scope.onExport = function(type){
                exportTo[type]($scope.data, $scope.rangeWeek);  
            }

            this.init = function(){
                $scope.form.sekolahid = authService.getSekolahProfile().sekolahid.toString();
                if($routeParams.id || $location.$$url == '/master/kelas/view'){
                    initEdit($routeParams.id);
                    getSiswa({
                        kelasid : $routeParams.id
                    });
                    getkelas({
                        page : 1,
                        "per-page" : 0,
                        sekolahid : authService.getSekolahProfile().sekolahid
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
            case '/master/kelas/view':
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
