'use strict';

define(['app'], function (app) {

    var injectParams = [
			'$CONST_VAR',
            'helperService',
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

    var SiswaImportController = function (
    		$CONST_VAR,
            helperService,
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
				{ name: 'index', displayName : 'No', width : '50', enableFiltering : false, enableCellEdit: false, enableColumnMenu : false},
				{ name: 'id', displayName: 'ID', visible: false, width : '50', enableCellEdit: false, enableColumnMenu : false},
				{ name: 'nis', displayName: 'NIS', visible: true, width : '100', enableCellEdit: true},
                { name: 'nisn', displayName: 'NISN', visible: true, width : '100', enableCellEdit: true},
				{ name: 'nama_siswa', displayName: 'Nama Siswa', visible: true, width : '300', enableCellEdit: false},
				{ name: 'nama_panggilan', displayName: 'Nama Panggilan', visible: true, width : '150', enableCellEdit: false},
				{ name: 'jk', displayName: 'JK', width : '50', enableCellEdit: false},
                { name: 'asal_sekolah', displayName : 'Sekolah Asal', width : '150', enableFiltering : true , enableCellEdit: false},
                { name: 'tempat_lahir', displayName: 'Tempat Lahir', visible: true, width : '150' , enableCellEdit: false},
                { name: 'tanggal_lahir', displayName: 'Tanggal Lahir', visible: true, width : '150', enableCellEdit: false},
                { name: 'anak_ke', displayName: 'Anak Ke', visible: true, width : '50', enableCellEdit: false},
                { name: 'jml_saudara', displayName: 'Jml Saudara', visible: true, width : '75', enableCellEdit: false},
                { name: 'berat', displayName: 'Berat', width : '75', enableCellEdit: false},
                { name: 'tinggi', displayName : 'Tinggi', width : '75', enableFiltering : true , enableCellEdit: false},
                { name: 'gol_darah', displayName: 'Gol Darag', visible: true, width : '50' , enableCellEdit: false},
                { name: 'riwayat_kesehatan', displayName: 'Riwayat Kesehatan', visible: true, width : '300', enableCellEdit: false},
                { name: 'alamat', displayName: 'Alamat', visible: true, width : '300', enableCellEdit: false},
                { name: 'kelurahan', displayName: 'Kelurahan', visible: true, width : '150', enableCellEdit: false},
                { name: 'kecamatan', displayName: 'Kecamatan', width : '150', enableCellEdit: false},
                { name: 'kota', displayName : 'Kota', width : '150', enableFiltering : true , enableCellEdit: false},
                { name: 'kodepos', displayName: 'Kode POS', visible: true, width : '100' , enableCellEdit: false},
                { name: 'tlp_rumah', displayName: 'Tlp Rumah', visible: true, width : '100', enableCellEdit: false},
                { name: 'nama_ayah', displayName: 'Ayah', visible: true, width : '200', enableCellEdit: false},
                { name: 'hp_ayah', displayName: 'HP', visible: true, width : '150', enableCellEdit: false},
                { name: 'pekerjaan_ayah', displayName: 'Pekerjaan', width : '150', enableCellEdit: false},
                { name: 'tempat_kerja_ayah', displayName : 'Tempat Kerja', width : '50', enableFiltering : true , enableCellEdit: false},
                { name: 'jabatan_ayah', displayName: 'Jabatan', visible: true, width : '150' , enableCellEdit: false},
                { name: 'pendidikan_ayah', displayName: 'Pendidikan', visible: true, width : '125', enableCellEdit: false},
                { name: 'email_ayah', displayName: 'Email', visible: true, width : '150', enableCellEdit: false},
                { name: 'nama_ibu', displayName: 'Ibu', visible: true, width : '150', enableCellEdit: false},
                { name: 'hp_ibu', displayName: 'HP', width : '150', enableCellEdit: false},
                { name: 'pekerjaan_ibu', displayName : 'Pekerjaan', width : '150', enableFiltering : true , enableCellEdit: false},
                { name: 'tempat_kerja_ibu', displayName: 'Tempat Kerja', visible: true, width : '150' , enableCellEdit: false},
                { name: 'jabatan_ibu', displayName: 'Jabatan', visible: true, width : '100', enableCellEdit: false},
                { name: 'pendidikan_ibu', displayName: 'Pendidikan', visible: true, width : '150', enableCellEdit: false},
                { name: 'email_ibu', displayName: 'Email', visible: true, width : '150', enableCellEdit: false},
                { name: 'jenis_tempat_tinggal', displayName: 'Tempat Tinggal', width : '150', enableCellEdit: false},
                { name: 'jarak_ke_sekolah', displayName: 'Jarak (km)', visible: true, width : '75', enableCellEdit: false},
                { name: 'sarana_transportasi', displayName: 'Transportasi', width : '150', enableCellEdit: false},
                { name: 'keterangan', displayName: 'Keterangan', width : '350', enableCellEdit: false}
			]
    	}

        $scope.onEditClick = function(rowdata){
            $location.path( "/master/siswa/edit/" + rowdata.id);
        }

        $scope.gridDetailDirtyRows = [];
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
			
		};

        $scope.grid.onRegisterApi = function(gridApi){
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                if(oldValue != newValue && (parseInt(newValue))){
                    $scope.gridDetailDirtyRows[rowEntity.index] = rowEntity;
                }
                $scope.$apply();
            });
        }

        function errorHandle(error){
            var msg = error.data.name;
            toastr.warning(msg, 'Warning');
        }

        function initIndex(){
            
        }

        function mergeXlsdataAndRombel(params, xlsdata){
            params['sekolahid'] = authService.getSekolahProfile().sekolahid;
            // params['tahun_ajaran_id'] = authService.getSelectedTahun().id;
            cfpLoadingBar.start();
            SiswaService.getList(params)
            .then(function (result) {
                if(result.success){
                    var rowdata = {}; //result.rows;
                    var num = 1;
                    $scope.grid.data = [];
                    for(var idx in result.rows){
                        if(typeof result.rows[idx].nis !='undefined' && result.rows[idx].nis != null 
                                && result.rows[idx].nis != ''){
                            rowdata[result.rows[idx].nis] = result.rows[idx];
                        }
                        
                    }
                    
                    var siswaid;
                    for(var nis in xlsdata){
                        if(typeof rowdata[nis] !='undefined' && rowdata[nis] != null && rowdata[nis] != ''){
                            siswaid = rowdata[nis].id;
                        }else{
                            siswaid = null;
                        }
                        $scope.grid.data.push({
                            index : num.toString(),
                            id : siswaid,
                            nis : xlsdata[nis][1],
                            nisn : xlsdata[nis][2],
                            nama_siswa : xlsdata[nis][3],
                            nama_panggilan : xlsdata[nis][4],
                            jk  : xlsdata[nis][5],
                            asal_sekolah  : xlsdata[nis][6],
                            tempat_lahir  : xlsdata[nis][7],
                            tanggal_lahir  : xlsdata[nis][8],
                            anak_ke  : xlsdata[nis][9],
                            jml_saudara  : xlsdata[nis][10],
                            berat  : xlsdata[nis][11],
                            tinggi  : xlsdata[nis][12],
                            gol_darah  : xlsdata[nis][13],
                            riwayat_kesehatan  : xlsdata[nis][14],
                            alamat  : xlsdata[nis][15],
                            kelurahan  : xlsdata[nis][16],
                            kecamatan  : xlsdata[nis][17],
                            kota  : xlsdata[nis][18],
                            kodepos  : xlsdata[nis][19],
                            tlp_rumah  : xlsdata[nis][20],
                            nama_ayah  : xlsdata[nis][21],
                            hp_ayah  : xlsdata[nis][22],
                            pekerjaan_ayah  : xlsdata[nis][23],
                            tempat_kerja_ayah  : xlsdata[nis][24],
                            jabatan_ayah  : xlsdata[nis][25],
                            pendidikan_ayah  : xlsdata[nis][26],
                            email_ayah  : xlsdata[nis][27],
                            nama_ibu  : xlsdata[nis][28],
                            hp_ibu  : xlsdata[nis][29],
                            pekerjaan_ibu  : xlsdata[nis][30],
                            tempat_kerja_ibu  : xlsdata[nis][31],
                            jabatan_ibu  : xlsdata[nis][32],
                            pendidikan_ibu  : xlsdata[nis][33],
                            email_ibu  : xlsdata[nis][34],
                            jenis_tempat_tinggal  : xlsdata[nis][35],
                            jarak_ke_sekolah  : xlsdata[nis][36],
                            sarana_transportasi  : xlsdata[nis][37],
                            keterangan  : xlsdata[nis][38]
                        });
                        num++;
                    }
                    
                }
                cfpLoadingBar.complete();
            }, errorHandle);
        }

        function loadXlsdata(xlsdata){
            cfpLoadingBar.start();
            var siswaid;
            var num=1;
            for(var nis in xlsdata){
                $scope.grid.data.push({
                    index : num.toString(),
                    id : null,
                    nis : xlsdata[nis][1],
                    nisn : xlsdata[nis][2],
                    nama_siswa : xlsdata[nis][3],
                    nama_panggilan : xlsdata[nis][4],
                    jk  : xlsdata[nis][5],
                    asal_sekolah  : xlsdata[nis][6],
                    tempat_lahir  : xlsdata[nis][7],
                    tanggal_lahir  : xlsdata[nis][8],
                    anak_ke  : xlsdata[nis][9],
                    jml_saudara  : xlsdata[nis][10],
                    berat  : xlsdata[nis][11],
                    tinggi  : xlsdata[nis][12],
                    gol_darah  : xlsdata[nis][13],
                    riwayat_kesehatan  : xlsdata[nis][14],
                    alamat  : xlsdata[nis][15],
                    kelurahan  : xlsdata[nis][16],
                    kecamatan  : xlsdata[nis][17],
                    kota  : xlsdata[nis][18],
                    kodepos  : xlsdata[nis][19],
                    tlp_rumah  : xlsdata[nis][20],
                    nama_ayah  : xlsdata[nis][21],
                    hp_ayah  : xlsdata[nis][22],
                    pekerjaan_ayah  : xlsdata[nis][23],
                    tempat_kerja_ayah  : xlsdata[nis][24],
                    jabatan_ayah  : xlsdata[nis][25],
                    pendidikan_ayah  : xlsdata[nis][26],
                    email_ayah  : xlsdata[nis][27],
                    nama_ibu  : xlsdata[nis][28],
                    hp_ibu  : xlsdata[nis][29],
                    pekerjaan_ibu  : xlsdata[nis][30],
                    tempat_kerja_ibu  : xlsdata[nis][31],
                    jabatan_ibu  : xlsdata[nis][32],
                    pendidikan_ibu  : xlsdata[nis][33],
                    email_ibu  : xlsdata[nis][34],
                    jenis_tempat_tinggal  : xlsdata[nis][35],
                    jarak_ke_sekolah  : xlsdata[nis][36],
                    sarana_transportasi  : xlsdata[nis][37],
                    keterangan  : xlsdata[nis][38]
                });
                num++;
            }
            cfpLoadingBar.complete();
        }

        function handleFile(e) {
            var ep = new ExcelPlus({showErrors : false, flashUsed : true});
            var a = ep.openLocal({
                "flashPath":"/js/excelplus/2.4/swfobject/",
                "labelButton":"Open an Excel file"
            }, function(c){
                cfpLoadingBar.start();
                try {
                    var SheetNames = ep.getSheetNames();
                    if(SheetNames.indexOf("Konten") < 0 && SheetNames.indexOf("konten") < 0){
                        toastr.warning('Format file template tidak sesuai. Sheet Konten tidak ditemukan', 'Warning');
                        return false;
                    }

                    var XLSdata = ep.selectSheet("Konten").readAll();
                    
                    var nodata = true;
                    var rows = {},
                        paramsRombel = [];
                    for(var idx in XLSdata){
                        if(idx > 0){
                            if(rows.hasOwnProperty(XLSdata[idx][1])){
                                console.log(XLSdata[idx][1]);
                            }
                            rows[XLSdata[idx][1]] = XLSdata[idx];
                        }
                    }
                    // mergeXlsdataAndRombel({page : 1, 'per-page' : 0}, rows);
                    loadXlsdata(rows);
                }
                catch(err) {
                    // document.getElementById("demo").innerHTML = err.message;
                    console.log(err.message);
                }
                cfpLoadingBar.complete();   
            })
        }

        function init(){
            handleFile();
        }

		$scope.$on('$viewContentLoaded', function(){
			init();
		});

        $scope.onDownloadTpl = function(){
            var win = window.open(BASEURL + "public/tpl/general_template_siswa.xlsx", '_blank');
            if (win) {
                //Browser has allowed it to be opened
                win.focus();
            } else {
                //Browser has blocked it
                alert('Please allow popups for this website');
            }
        }

        $scope.onSaveClick = function(event){
            $scope.gridDetailDirtyRows = $scope.grid.data;
            if($scope.gridDetailDirtyRows.length <= 0){
                toastr.warning('Data siswa masih kosong.', 'Warning');
                return false;
            }

            var params = {
                sekolahid : authService.getSekolahProfile().sekolahid,
                scenario : '1', // scenario import siswa
                grid : $scope.gridDetailDirtyRows
            }

            function successHandle(result){
                if(result.success){
                    toastr.success('Data telah tersimpan', 'Success');
                    cfpLoadingBar.complete();
                    $scope.gridDetailDirtyRows = [];
                    $scope.grid.data = [];
                    $location.path( "/master/siswa/");
                }else{
                    toastr.error('Data gagal tersimpan.' + result.message, 'Error');
                    cfpLoadingBar.complete();
                }
            }
            cfpLoadingBar.start();
            $resourceApi.insert(params)
            .then(successHandle, errorHandle);
        }

		$scope.onAddClick = function(event){
			$location.path( "/master/siswa/add");
		}
    }
    SiswaImportController.$inject = injectParams;


    app.register.controller('SiswaImportController', SiswaImportController);

});
