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
            'toastr'
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
            toastr
    	)
    {
    	$scope.viewdir = $CONST_VAR.viewsDirectory + 'master/siswa/';
    	var $resourceApi = SiswaService;
    	//========================Grid Config =======================

    	var grid = {
    		columnDefs : [
				{ name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
				{ name: 'id', displayName: 'ID', visible: false, width : '50' ,  enableCellEdit: false},
				{ name: 'nis', displayName: 'NIS', visible: true, width : '100',  enableCellEdit: false},
				{ name: 'nama_siswa', displayName: 'Nama Siswa', visible: true, width : '300',  enableCellEdit: false},
				{ name: 'nama_panggilan', displayName: 'Nama Panggilan', visible: true, width : '200',  enableCellEdit: false},
				{ name: 'jk', displayName: 'JK', width : '50',  enableCellEdit: false},
				{ name: 'agama', displayName: 'Agama', width : '100',  enableCellEdit: false}
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

        $scope.onEditClick = function(rowdata){
            $location.path( "/master/siswa/edit/" + rowdata.id);
        }

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
			columnDefs : grid.columnDefs,
			//Export
			exporterCsvFilename: 'coa.csv',
		    exporterPdfDefaultStyle: {
		    	fontSize: 9
		   	},
		    exporterPdfTableStyle: {
		    	margin: [5, 5, 5, 5]
		    },
		    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: '#000'},
		    exporterPdfHeader: {
		    	text: "My Header",
		    	style: 'headerStyle'
		   	},
		    exporterPdfFooter: function ( currentPage, pageCount ) {
		      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
		    },
		    exporterPdfCustomFormatter: function ( docDefinition ) {
		      docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
		      docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
		      return docDefinition;
		    },
		    exporterPdfOrientation: 'portrait',
		    exporterPdfPageSize: 'LETTER',
		    exporterPdfMaxGridWidth: 500,
		    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location"))
		};

		/*
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
		*/

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

		function initEdit(id){
            cfpLoadingBar.start();
            $resourceApi.getById(id)
            .then(function (result) {
                if(result.success){
                    $scope.form.id = result.rows.id;
                    $scope.form.nis = result.rows.nis;
                    $scope.form.nisn = result.rows.nisn;
                    $scope.form.nama_siswa = result.rows.nama_siswa;
                    $scope.form.nama_panggilan = result.rows.nama_panggilan;
                    $scope.form.jk = result.rows.jk;
                    $scope.form.agama = result.rows.agama;
                    $scope.form.tempat_lahir = result.rows.tempat_lahir;
                    $scope.form.tanggal_lahir = result.rows.tanggal_lahir;
                    $scope.form.anak_ke = result.rows.anak_ke;
                    $scope.form.jml_saudara = result.rows.jml_saudara;
                    $scope.form.asal_sekolah = result.rows.asal_sekolah;
                    $scope.form.alamat = result.rows.alamat;
                    $scope.form.kelurahan = result.rows.kelurahan;
                    $scope.form.kecamatan = result.rows.kecamatan;
                    $scope.form.kota = result.rows.kota;
                    $scope.form.kodepos = result.rows.kodepos;
                    $scope.form.tlp_rumah = result.rows.tlp_rumah;
                    $scope.form.nama_ayah = result.rows.nama_ayah;
                    $scope.form.hp_ayah = result.rows.hp_ayah;
                    $scope.form.pekerjaan_ayah = result.rows.pekerjaan_ayah;
                    $scope.form.tempat_kerja_ayah = result.rows.tempat_kerja_ayah;
                    $scope.form.jabatan_ayah = result.rows.jabatan_ayah;
                    $scope.form.pendidikan_ayah = result.rows.pendidikan_ayah;
                    $scope.form.email_ayah = result.rows.email_ayah;
                    $scope.form.nama_ibu = result.rows.nama_ibu;
                    $scope.form.hp_ibu = result.rows.hp_ibu;
                    $scope.form.pekerjaan_ibu = result.rows.pekerjaan_ibu;
                    $scope.form.tempat_kerja_ibu = result.rows.tempat_kerja_ibu;
                    $scope.form.jabatan_ibu = result.rows.jabatan_ibu;
                    $scope.form.pendidikan_ibu = result.rows.pendidikan_ibu;
                    $scope.form.email_ibu = result.rows.email_ibu;
                    $scope.form.berat = result.rows.berat;
                    $scope.form.tinggi = result.rows.tinggi;
                    $scope.form.gol_darah = result.rows.gol_darah;
                    $scope.form.riwayat_kesehatan = result.rows.riwayat_kesehatan;
                    $scope.form.jenis_tempat_tinggal = result.rows.jenis_tempat_tinggal;
                    $scope.form.jarak_ke_sekolah = result.rows.jarak_ke_sekolah;
                    $scope.form.sarana_transportasi = result.rows.sarana_transportasi;
                    $scope.form.keterangan = result.rows.keterangan;
                    $scope.form.sekolahid = result.rows.sekolahid;
                }
                cfpLoadingBar.complete();
            }, errorHandle);
        }

        $scope.profilAvatar = ($scope.form.avatar == '') ? BASEURL + 'img/profil/user-default.png' : $scope.form.avatar;
        
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
    }
    SiswaController.$inject = injectParams;


    app.register.controller('SiswaController', SiswaController);

});
