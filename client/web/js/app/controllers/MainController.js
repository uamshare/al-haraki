'use strict';

define(['app'], function (app) {

    var injectParams = [
        '$scope',
        '$location', 
        '$routeParams',
        '$timeout',
        'cfpLoadingBar',
        '$CONST_VAR',
        'authService',
        'helperService',
        'TagihanInfoService'
    ];

    var MainController = function (
        $scope, 
        $location, 
        $routeParams, 
        $timeout,
        cfpLoadingBar,
        $CONST_VAR,
        authService,
        helperService,
        TagihanInfoService
    ) 
    {
        $scope.viewdir = $CONST_VAR.viewsDirectory + 'main/';
        var $resourceApi = TagihanInfoService;
        var date = new Date();

        function errorHandle(error){
            var msg = error.data.name;
            toastr.warning(msg, 'Warning');
        }

        $scope.infoTagihan = {
            rows : [
                {name : 'spp', label : 'SPP', value : '', clsBg : 'bg-aqua'},
                {name : 'komite_sekolah', label : 'Komite Sekolah', value : '', clsBg : 'bg-green'},
                {name : 'catering', label : 'Catering', value : '', clsBg : 'bg-yellow'},
                {name : 'keb_siswa', label : 'Kebutuhan Siswa', value : '', clsBg : 'bg-red'},
                {name : 'ekskul', label : 'Ekskul', value : '', clsBg : 'bg-blue'}
            ]
        }
        $scope.month = helperService.getMonthName( date.getMonth() );
        $scope.year = date.getFullYear();
        $scope.widget2 = {
          sdit : [],
          smpit : []
        };

        function getSummary(paramdata){
            cfpLoadingBar.start();
            $resourceApi.getSummaryOuts(paramdata)
            .then(function (result) {
                if(result.success){
                    if(result.rows){
                        var sumBytagihan = result.rows.sum_by_tagihan;
                        $scope.infoTagihan.rows[0].value = sumBytagihan.spp;
                        $scope.infoTagihan.rows[1].value = sumBytagihan.komite_sekolah;
                        $scope.infoTagihan.rows[2].value = sumBytagihan.catering;
                        $scope.infoTagihan.rows[3].value = sumBytagihan.keb_siswa;
                        $scope.infoTagihan.rows[4].value = sumBytagihan.ekskul;

                        var idx1 = 0, idx2 = 0;
                        for(var idx in result.rows.sum_by_sekolah){
                            
                            if(result.rows.sum_by_sekolah[idx].sekolahid == 1){
                                $scope.widget2.sdit[idx1] = result.rows.sum_by_sekolah[idx];
                                $scope.widget2.sdit[idx1]['index'] = idx1 + 1;
                                idx1++;
                            }
                            if(result.rows.sum_by_sekolah[idx].sekolahid == 2){
                                $scope.widget2.smpit[idx2] = result.rows.sum_by_sekolah[idx];
                                $scope.widget2.smpit[idx2]['index'] = idx2 + 1;
                                idx2++;
                            }
                            
                        }
                    }
                }
                cfpLoadingBar.complete();
            }, errorHandle);
        }

        var areaChartData = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                  label: "Electronics",
                  fillColor: "rgba(210, 214, 222, 1)",
                  strokeColor: "rgba(210, 214, 222, 1)",
                  pointColor: "rgba(210, 214, 222, 1)",
                  pointStrokeColor: "#c1c7d1",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgba(220,220,220,1)",
                  data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                  label: "Digital Goods",
                  fillColor: "rgba(60,141,188,0.9)",
                  strokeColor: "rgba(60,141,188,0.8)",
                  pointColor: "#3b8bba",
                  pointStrokeColor: "rgba(60,141,188,1)",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgba(60,141,188,1)",
                  data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };


        function init(){
            if($location.$$url == '/keuangan/dashboard'){
              getSummary({
                  tahun_ajaran_id : authService.getSekolahProfile().tahun_ajaran_id,
                  date : date
              });
            }
            
        }
        // initBarChart();
        $scope.$on('$viewContentLoaded', function(){
            // init();
        });

        $timeout(function() {
            init();
        }, 1000);
        
    };

    MainController.$inject = injectParams;

    app.register.controller('MainController', MainController);

});