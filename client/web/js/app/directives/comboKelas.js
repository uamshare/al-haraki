'use strict';

define(['app'], function (app) {

    var injectParams =  [
            '$CONST_VAR',
            // '$scope', 
            // '$location', 
            // '$routeParams', 
            // '$http', 
            // '$log', 
            // '$timeout'
        ];;

    var kelasDirective = function () 
    {
        var kelasCfg = {
            options: [
                {id: 24, nama_kelas: 'Al Kautsar'},
                {id: 25, nama_kelas: 'An Naba'},
                {id: 26, nama_kelas: 'Ash Shafaat'}
            ],
            selected: null
        };
        return {
            scope: {
              kelas: {
                    options: [
                        {id: 24, nama_kelas: 'Al Kautsar'},
                        {id: 25, nama_kelas: 'An Naba'},
                        {id: 26, nama_kelas: 'Ash Shafaat'}
                    ],
                    selected: null,
                    id: 1,
                    name: 'Tesss'
                }
            },
            // templateUrl : 'js/app/directives/comboKelasTemplate.html'
            template : 'Name: {{kelas.id}} Address: {{kelas.name}}'
        };
    };

    // kelasDirective.$inject = injectParams;

    app.directive('comboKelas', kelasDirective);

});