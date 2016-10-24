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
            'SiswaService',
            'cfpLoadingBar',
            'toastr',
            'ngDialog',
    	];

    var SiswaController = function (
    		$CONST_VAR,
    		$scope,
    		$location,
    		$routeParams,
    		$http,
    		$log,
    		$timeout,
    		authService,
            SiswaService,
            cfpLoadingBar,
            toastr,
            ngDialog
    	)
    {
    	$scope.viewdir = $CONST_VAR.viewsDirectory + 'master/siswa/';
    	var $resourceApi = SiswaService;
    	//========================Grid Config =======================

    	var grid = {
    		columnDefs : [
				{ name: 'index', displayName : 'No', width : '50', enableFiltering : false, enableColumnMenu : false},
                { name: 'id', displayName: 'ID', visible: false, width : '50', enableCellEdit: false, enableColumnMenu : false},
                { name: 'nis', displayName: 'NIS', visible: true, width : '100', enableCellEdit: true},
                { name: 'nisn', displayName: 'NISN', visible: true, width : '100', enableCellEdit: true},
                { name: 'nama_siswa', displayName: 'Nama Siswa', visible: true, enableCellEdit: false},
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
                { name: 'keterangan', displayName: 'Keterangan', visible: false, width : '350', enableCellEdit: false}
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
            cellTemplate : columnActionTpl,
            cellClass: 'grid-align-right'
        });

        $scope.onEditClick = function(rowdata){
            $location.path( "/master/siswa/edit/" + rowdata.id);
        }

    	$scope.grid = {
    		paginationPageSizes: [20, 30, 50, 100, 200, 500, 1000, 2000],
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
            exporterCsvFilename: 'siswa_all.csv',
            exporterMenuPdf : false,
			columnDefs : grid.columnDefs,
		};

		$scope.getList = function (paramdata){
            cfpLoadingBar.start();
            $resourceApi.get(paramdata.page, paramdata.perPage)
            .then(function (result) {
                if(result.success){
                    for(var index in result.rows){
                        var romnum = (paramdata.page > 1) ? (((paramdata.page - 1) * $scope.grid.pageSize) + parseInt(index) + 1) : (parseInt(index) + 1);
                        result.rows[index]["index"] = romnum;
                    }
                    $scope.grid.data = result.rows;
                    $scope.grid.totalItems = result.total;
                    $scope.grid.paginationCurrentPage = paramdata.page;
                }
                cfpLoadingBar.complete();
            }, errorHandle);
        }

        function errorHandle(error){
            var msg = error.data.name;
            toastr.warning(msg, 'Warning');
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

        $scope.onDeleteClick = function(rowdata){
            function deleteData(id){
                cfpLoadingBar.start();
                $resourceApi.delete(id)
                .then(function(result){
                    toastr.success('Data telah dihapus', 'Success');
                    cfpLoadingBar.complete();
                    $scope.getList({
                        page : 1,
                        'per-page' : 20,
                        sekolahid : authService.getSekolahProfile().sekolahid
                    });
                    // if(result.success){
                    //     toastr.success('Data telah dihapus', 'Success');
                    //     cfpLoadingBar.complete();
                    //     $scope.getList({
                    //         page : 1,
                    //         'per-page' : 20,
                    //         sekolahid : authService.getSekolahProfile().sekolahid
                    //     });
                    // }else{
                    //     toastr.error('Data gagal dihapus.' + result.message, 'Error');
                    //     cfpLoadingBar.complete();
                    // }

                }, errorHandle);
            }

            var del = confirm("Anda yakin akan menghapus data `" + rowdata.nama_siswa + "`");
            if (del == true) {
                deleteData(rowdata.id);
            }
        }

		$scope.$on('$viewContentLoaded', function(){
			init();
		});

		function initIndex(){
            $scope.getList({
                page : 1,
                perPage : 20
            });
        }

        $scope.form = {
            id : '',
            nis : '',
            nisn : '',
            nama_siswa : '',
            nama_panggilan : '',
            jk : '',
            agama : '',
            tempat_lahir : '',
            tanggal_lahir : '',
            anak_ke : '',
            jml_saudara : '',
            asal_sekolah : '',
            alamat : '',
            kelurahan : '',
            kecamatan : '',
            kota : '',
            kodepos : '',
            tlp_rumah : '',
            nama_ayah : '',
            hp_ayah : '',
            pekerjaan_ayah : '',
            tempat_kerja_ayah : '',
            jabatan_ayah : '',
            pendidikan_ayah : '',
            email_ayah : '',
            nama_ibu : '',
            hp_ibu : '',
            pekerjaan_ibu : '',
            tempat_kerja_ibu : '',
            jabatan_ibu : '',
            pendidikan_ibu : '',
            email_ibu : '',
            berat : '',
            tinggi : '',
            gol_darah : '',
            riwayat_kesehatan : '',
            jenis_tempat_tinggal : '',
            jarak_ke_sekolah : '',
            sarana_transportasi : '',
            keterangan : '',
            avatar : '',
            sekolahid : authService.getSekolahProfile().sekolahid
        }

        // $scope.formAction = '';
		function initEdit(id){
            cfpLoadingBar.start();
            $resourceApi.getById(id)
            .then(function (result) {
                if(result.success){
                    $scope.form = result.rows;
                }
                $scope.profilAvatar = ($scope.form.avatar == '') ? BASEURL + 'img/profil/user-default.png' : $scope.form.avatar;
                cfpLoadingBar.complete();
            }, errorHandle);
        }

        function reset(){
            $scope.form.id = '';
            $scope.form.nis = '';
            $scope.form.nisn = '';
            $scope.form.nama_siswa = '';
            $scope.form.nama_panggilan = '';
            $scope.form.jk = '';
            $scope.form.agama = '';
            $scope.form.tempat_lahir = '';
            $scope.form.tanggal_lahir = '';
            $scope.form.anak_ke = '';
            $scope.form.jml_saudara = '';
            $scope.form.asal_sekolah = '';
            $scope.form.alamat = '';
            $scope.form.kelurahan = '';
            $scope.form.kecamatan = '';
            $scope.form.kota = '';
            $scope.form.kodepos = '';
            $scope.form.tlp_rumah = '';
            $scope.form.nama_ayah = '';
            $scope.form.hp_ayah = '';
            $scope.form.pekerjaan_ayah = '';
            $scope.form.tempat_kerja_ayah = '';
            $scope.form.jabatan_ayah = '';
            $scope.form.pendidikan_ayah = '';
            $scope.form.email_ayah = '';
            $scope.form.nama_ibu = '';
            $scope.form.hp_ibu = '';
            $scope.form.pekerjaan_ibu = '';
            $scope.form.tempat_kerja_ibu = '';
            $scope.form.jabatan_ibu = '';
            $scope.form.pendidikan_ibu = '';
            $scope.form.email_ibu = '';
            $scope.form.berat = '';
            $scope.form.tinggi = '';
            $scope.form.gol_darah = '';
            $scope.form.riwayat_kesehatan = '';
            $scope.form.jenis_tempat_tinggal = '';
            $scope.form.jarak_ke_sekolah = '';
            $scope.form.sarana_transportasi = '';
            $scope.form.keterangan = '';
            $scope.form.sekolahid = authService.getSekolahProfile().sekolahid;
        }

		function init(){
			if($routeParams.id){
                initEdit($routeParams.id);
                if($location.$$url == '/master/siswa/view/' + $routeParams.id){
                    $scope.formAction = 'view';
                }else{
                    $scope.formAction = 'edit';
                }
            }else{
                initIndex();
            }
		}

        $scope.onSaveClick = function(event){
            if($scope.form.nis == '' || $scope.form.nis == null){
                toastr.warning('NIS tidak boleh kosong.', 'Warning');
                return false;
            }

            if($scope.form.nama_siswa == '' || $scope.form.nama_siswa == null){
                toastr.warning('Nama Siswa tidak boleh kosong.', 'Warning');
                return false;
            }

            function successHandle(result){
                if(result.success){
                    toastr.success('Data telah tersimpan', 'Success');
                    reset();
                    cfpLoadingBar.complete();
                    $location.path( "/master/siswa/");
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

		$scope.onAddClick = function(event){
			// alert('tambah');
			$location.path( "/master/siswa/add");
		}

        if($routeParams.id){
            $scope.onPhotoClick = function(){
                ngDialog.open({
                    template: $scope.viewdir + 'upload.html',
                    className: 'ngdialog-theme-flat custom-width-50',
                    scope: $scope
                });
            }

            // File Upload Config
            var session = new authService.session();
            $scope.options = {
                url: BASEAPIURL + 'siswas/avatar?id=' + $routeParams.id,
                headers : {
                    'access-token' : session.get('accessToken') //sessionStorage.getItem('accessToken')
                },
                done : function (e, data) {
                    var result = data.result;
                    if(result.success){
                        ngDialog.close();
                        toastr.success('Silahkan muat ulang aplikasi untuk melihat hasilnya.', 'Success');
                    }else{
                        toastr.warning('Upload Photo gagal.', 'Warning');
                    }
                    
                }
            };

            $scope.loadingFiles = true;

            var file = $scope.file,
                state;
            if (file && file.url) {
                file.$state = function () {
                    return state;
                };
                file.$destroy = function () {
                    state = 'pending';
                    return $http({
                        url: file.deleteUrl,
                        method: file.deleteType
                    }).then(
                        function () {
                            state = 'resolved';
                            $scope.clear(file);
                        },
                        function () {
                            state = 'rejected';
                        }
                    );
                };
            } else if (file && !file.$cancel && !file._index) {
                file.$cancel = function () {
                    $scope.clear(file);
                };
            }
        }
        
    }
    SiswaController.$inject = injectParams;


    app.register.controller('SiswaController', SiswaController);

});
