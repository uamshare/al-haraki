require.config({
    baseUrl: BASEURL + 'js/app',
    // urlArgs: false, //'v=0.0.0.0.1'
    urlArgs: "bust=" + (new Date()).getTime()
});

require(
    [
        'app',
        // 'services/routeResolver',
        // 'directives/comboKelas',
        'services/authService',
        'services/helperService',
        'services/httpInterceptors',
        //Master
        'services/SiswaService',
        'services/PegawaiService',
        'services/KelasService',
        //AKUNTANSI
        'services/COAService',
        'services/jurnalHarianService',
        'services/RglService',
        // Pengaturan
        'services/GrupAksesService',
        'services/UserService',
        'services/SekolahService',

        'services/TahunAjaranService',
        //KEUANGAN
        'services/kwitansiPemabayaranService',
        'services/kwitansiPengeluaranService',
        'services/SiswaRombelService',
        'services/TagihanInfoService',
        'services/tagihanAutodebetService',
        
        'controllers/NavbarController'
    ],
    function () {
        angular.bootstrap(document, ['alHaraki']);
    });
