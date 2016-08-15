'use strict';

define(['app'], function (app) {

    var injectParams = [
        '$scope',
        '$location', 
        '$routeParams', 
        '$CONST_VAR'
    ];

    var MainController = function (
        $scope, 
        $location, 
        $routeParams, 
        $CONST_VAR
    ) 
    {
        $scope.viewdir = $CONST_VAR.viewsDirectory + 'main/';
        var date = new Date();
        $scope.infoTagihan = {
            rows : [
                {name : 'spp', label : 'SPP', value : 150000, clsBg : 'bg-aqua'},
                {name : 'komite_sekolah', label : 'Komite Sekolah', value : 75000, clsBg : 'bg-green'},
                {name : 'catering', label : 'Catering', value : 80000, clsBg : 'bg-yellow'},
                {name : 'keb_siswa', label : 'Kebutuhan Siswa', value : 15000, clsBg : 'bg-red'},
                {name : 'ekskul', label : 'Ekskul', value : 100000, clsBg : 'bg-blue'}
            ]
        }
        $scope.month = date.getMonth() +1;
        $scope.year = date.getFullYear();

        // $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        // $scope.series = ['Series A', 'Series B'];
        // $scope.datasets = [
        //     {
        //         label: "Electronics",
        //         fillColor: "rgba(210, 214, 222, 1)",
        //         strokeColor: "rgba(210, 214, 222, 1)",
        //         pointColor: "rgba(210, 214, 222, 1)",
        //         pointStrokeColor: "#c1c7d1",
        //         pointHighlightFill: "#fff",
        //         pointHighlightStroke: "rgba(220,220,220,1)",
        //         data: [65, 59, 80, 81, 56, 55, 40]
        //     },
        //     {
        //         label: "Digital Goods",
        //         fillColor: "rgba(60,141,188,0.9)",
        //         strokeColor: "rgba(60,141,188,0.8)",
        //         pointColor: "#3b8bba",
        //         pointStrokeColor: "rgba(60,141,188,1)",
        //         pointHighlightFill: "#fff",
        //         pointHighlightStroke: "rgba(60,141,188,1)",
        //         data: [28, 48, 40, 19, 86, 27, 90]
        //     }
        // ]
        // $scope.data = [
        //     [65, 59, 80, 81, 56, 55, 40],
        //     [28, 48, 40, 19, 86, 27, 90]
        // ];
        // $scope.onClick = function (points, evt) {
        //     console.log(points, evt);
        // };

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
        function initBarChart(){
            // console.log($("#barChart").getContext("2d"));
            var barChartCanvas = $("#barChart")[0].getContext("2d");
            var barChart = new Chart(barChartCanvas);
            var barChartData = areaChartData;
            barChartData.datasets[1].fillColor = "#00a65a";
            barChartData.datasets[1].strokeColor = "#00a65a";
            barChartData.datasets[1].pointColor = "#00a65a";
            var barChartOptions = {
              //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
              scaleBeginAtZero: true,
              //Boolean - Whether grid lines are shown across the chart
              scaleShowGridLines: true,
              //String - Colour of the grid lines
              scaleGridLineColor: "rgba(0,0,0,.05)",
              //Number - Width of the grid lines
              scaleGridLineWidth: 1,
              //Boolean - Whether to show horizontal lines (except X axis)
              scaleShowHorizontalLines: true,
              //Boolean - Whether to show vertical lines (except Y axis)
              scaleShowVerticalLines: true,
              //Boolean - If there is a stroke on each bar
              barShowStroke: true,
              //Number - Pixel width of the bar stroke
              barStrokeWidth: 2,
              //Number - Spacing between each of the X value sets
              barValueSpacing: 5,
              //Number - Spacing between data sets within X values
              barDatasetSpacing: 1,
              //String - A legend template
              legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
              //Boolean - whether to make the chart responsive
              responsive: true,
              maintainAspectRatio: true
            };
            barChartOptions.datasetFill = false;
            barChart.Bar(barChartData, barChartOptions);
        }
        // initBarChart();

        
    };

    MainController.$inject = injectParams;

    app.register.controller('MainController', MainController);

});