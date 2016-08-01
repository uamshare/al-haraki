require.config({
    baseUrl: 'js/app',
    urlArgs: false, //'v=0.0.0.0.1'
});

require(
    [
        // 'customersApp/animations/listAnimations',
        'app',
        // 'customersApp/directives/wcUnique',
        // 'services/routeResolver',
        // 'customersApp/services/config',
        // 'customersApp/services/customersBreezeService',
        'services/authService',
        // 'customersApp/services/customersService',
        // 'customersApp/services/dataService',
        // 'customersApp/services/modalService',
        // 'customersApp/services/httpInterceptors',
        // 'customersApp/filters/nameCityStateFilter',
        // 'customersApp/filters/nameProductFilter',
        // 'customersApp/controllers/navbarController',
        // 'customersApp/controllers/orders/orderChildController',
    ],
    function () {
        angular.bootstrap(document, ['alHaraki']);
    });
