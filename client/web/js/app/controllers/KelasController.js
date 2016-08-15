'use strict';



define(['app'], function (app) {

    var injectParams = [
            '$CONST_VAR',
            '$scope', 
            '$location', 
            '$routeParams', 
            '$http', 
            '$log', 
            '$timeout'
        ];

    var KelasController = function (
            $CONST_VAR,
            $scope, 
            $location, 
            $routeParams, 
            $http, 
            $log, 
            $timeout
        ) 
    {
        $scope.viewdir = $CONST_VAR.viewsDirectory + 'master/kelas/';

        //========================Grid Config =======================

        var grid = {
            columnDefs : [
                { name: 'index', displayName : 'No', width : '50', enableFiltering : false ,  enableCellEdit: false},
                { name: 'id', displayName: 'ID', visible: false, width : '50' ,  enableCellEdit: false},
                { name: 'kelas', displayName: 'Kelas', visible: true, width : '250',  enableCellEdit: false},
                { name: 'nama_kelas', displayName: 'Nama Kelas', visible: true, width : '380',  enableCellEdit: false},
                { name: 'sekolahid', displayName: 'Sekolah', visible: true, width : '350',  enableCellEdit: false}
            ]
        }

        $scope.grid = { 
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
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
            onRegisterApi: function(gridApi){
              $scope.gridApi = gridApi;
            }
        };

        function getData(data){
            $http.get($CONST_VAR.restDirectory + 'kelas',{
                params : data
            })
            .success(function(data, status, header) {
                var header = header();
                if(data.success){
                    angular.forEach(data.rows, function(dt, index) {
                        var romnum = index + 1;
                        data.rows[index]["index"] = romnum;
                       
                    })
                    $scope.grid.data = data.rows;
                }
            });
        }

        $scope.$on('$viewContentLoaded', function(){
            init();
        });

        function init(){
            getData();
        }
        
        $scope.onAddClick = function(event){
            // alert('tambah');
            $location.path( "/master/kelas/add");
        }
    }
    KelasController.$inject = injectParams;


    app.register.controller('KelasController', KelasController);

});