'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$rootScope','authService', '$location'];

    var helperService = function ($http, $rootScope, authService, $location) {
        var serviceBase = BASEAPIURL,
            factory = {
                loginPath: 'auths/login',
                user: {
                    isAuthenticated: false,
                    roles: null
                }
            };

        factory.month = function(){
            return {
                options: [
                    {id: 1, name: 'Januari'},
                    {id: 2, name: 'Februari'},
                    {id: 3, name: 'Maret'},
                    {id: 4, name: 'April'},
                    {id: 5, name: 'Mei'},
                    {id: 6, name: 'Juni'},
                    {id: 7, name: 'Juli'},
                    {id: 8, name: 'Agustus'},
                    {id: 9, name: 'September'},
                    {id: 10, name: 'Oktober'},
                    {id: 11, name: 'November'},
                    {id: 12, name: 'Desember'}
                ],
                selected: null,
                year : null
            }
        }

        factory.monthShort = function(){
            return {
                options: [
                    {id: 1, name: 'Jan'},
                    {id: 2, name: 'Feb'},
                    {id: 3, name: 'Mar'},
                    {id: 4, name: 'Apr'},
                    {id: 5, name: 'Mei'},
                    {id: 6, name: 'Jun'},
                    {id: 7, name: 'Jul'},
                    {id: 8, name: 'Agu'},
                    {id: 9, name: 'Sep'},
                    {id: 10, name: 'Okt'},
                    {id: 11, name: 'Nov'},
                    {id: 12, name: 'Des'}
                ],
                selected: null,
                year : null
            }
        }

        factory.dateTimeZone = function(date, timezone){
            if(typeof timezone == 'undefined'){
                timezone = 'Asia/Jakarta';
            }

            var dt = (typeof date != 'undefined') ? date : new Date().toLocaleString('id-ID', { timeZone: timezone });
            // console.log(Date.parse(dt));
            // console.log(dt);
            // return new Date(dt);
            return new Date();
        }

        factory.date = function(date){
            if(typeof date == 'undefined'){
                date = new Date();
            }
            return {
                firstDay : new Date(date.getFullYear(), date.getMonth(), 1),
                lastDay : new Date(date.getFullYear(), date.getMonth() + 1, 0)
            }
        }

        factory.getMonthName = function(id){
            if(id == -1) id = 11;
            if(id == null || id == '' || isNaN(id)){
                id = 11
            }else{
                // console.log(id);
            }
            
            return factory.month().options[id].name
        }

        factory.getYearByMonth = function(id){
            if(id == -1 || id > 5){
                return authService.getSekolahProfile().tahun_awal;
            }else{
                return authService.getSekolahProfile().tahun_akhir;
            }
        }

        factory.getMonthNameShort = function(id){
            return factory.monthShort().options[id].name
        }

        factory.getMonthId = function(id){
            return factory.month().options[id].id
        }

        factory.formatDateID = function(date, delimeter){
            // var date = new Date();
            var day = date.getDate();
            var monthIndex = date.getMonth();
            var year = date.getFullYear();
            delimeter = (typeof delimeter == 'undefined') ? ' ' : delimeter;
            // console.log(day + delimeter + factory.getMonthName(monthIndex) + delimeter + year);
            return day + delimeter + factory.getMonthName(monthIndex) + delimeter + year
        }

        factory.parseInt = function(str){
            if(str == null || typeof str == 'undefined' || str == ''){
                return 0;
            }
            str = str.replace(/,/g, '');
            str = str.replace(/\./g, '');
            return (parseInt(str)) ? parseInt(str) : 0;
        }

        factory.terbilang = function(bilangan) {
                bilangan    = String(bilangan);
                var angka   = new Array('0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0');
                var kata    = new Array('','Satu','Dua','Tiga','Empat','Lima','Enam','Tujuh','Delapan','Sembilan');
                var tingkat = new Array('','Ribu','Juta','Milyar','Triliun');

                var panjang_bilangan = bilangan.length, 
                    i, 
                    j, 
                    kaLimat = '';

                /* pengujian panjang bilangan */
                if (panjang_bilangan > 15) {
                    kaLimat = "Diluar Batas";
                    return kaLimat;
                }

                /* mengambil angka-angka yang ada dalam bilangan, dimasukkan ke dalam array */
                for (i = 1; i <= panjang_bilangan; i++) {
                    angka[i] = bilangan.substr(-(i),1);
                }

                i = 1;
                j = 0;
                kaLimat = "";
                /* mulai proses iterasi terhadap array angka */
                while (i <= panjang_bilangan) {
                    var subkaLimat = "",
                    kata1 = "",
                    kata2 = "",
                    kata3 = "";

                    /* untuk Ratusan */
                    if (angka[i+2] != "0") {
                        if (angka[i+2] == "1") {
                        kata1 = "Seratus";
                        } else {
                        kata1 = kata[angka[i+2]] + " Ratus";
                        }
                    }

                    /* untuk Puluhan atau Belasan */
                    if (angka[i+1] != "0") {
                        if (angka[i+1] == "1") {
                            if (angka[i] == "0") {
                                kata2 = "Sepuluh";
                            }else if (angka[i] == "1") {
                                kata2 = "Sebelas";
                            }else {
                                kata2 = kata[angka[i]] + " Belas";
                            }
                        }else {
                            kata2 = kata[angka[i+1]] + " Puluh";
                        }
                    }

                    /* untuk Satuan */
                    if (angka[i] != "0") {
                        if (angka[i+1] != "1") {
                            kata3 = kata[angka[i]];
                        }
                    }

                    /* pengujian angka apakah tidak nol semua, lalu ditambahkan tingkat */
                    if ((angka[i] != "0") || (angka[i+1] != "0") || (angka[i+2] != "0")) {
                        subkaLimat = kata1+" "+kata2+" "+kata3+" "+tingkat[j]+" ";
                    }

                    /* gabungkan variabe sub kaLimat (untuk Satu blok 3 angka) ke variabel kaLimat */
                    kaLimat = subkaLimat + kaLimat;
                    i = i + 3;
                    j = j + 1;
                }

                /* mengganti Satu Ribu jadi Seribu jika diperlukan */
                if ((angka[5] == "0") && (angka[6] == "0")) {
                    kaLimat = kaLimat.replace("Satu Ribu","Seribu");
                }

                return kaLimat + "Rupiah";
        }

        factory.trim = function(str){
            return str.replace(/ /g, '');
        }

        factory.dateToString = function(date, delimeter){
            delimeter = (typeof delimeter == 'undefined') ? '/' : delimeter;
            var date = factory.dateTimeZone(date);
            return date.getFullYear()  + delimeter + (date.getMonth() + 1) + delimeter + date.getDate();
        }

        factory.navigateTo = function(event, _url, title){
            if(event.altKey){
                var url = $location.absUrl().split('#');
                    url = url[0] + '#' + _url;
                var w =  window.open(url, 'ref-windows-' + title); // in new tab
                w.onload = function() { this.document.title += ' - ' + title; }
            }else{
                $location.path( _url);
            }
        }

        return factory;
    };

    helperService.$inject = injectParams;

    app.factory('helperService', helperService);

});
