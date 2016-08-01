'use strict';

app.controller('CoaController', function ($scope, $http, $window, toaster, ngDialog, $injector, $httpParamSerializer) {
    var $validationProvider = $injector.get('$validation');
    $http.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

    

});