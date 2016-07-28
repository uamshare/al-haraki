var app = angular.module('alHaraki', ['ngRoute', 'ngAnimate', 'toaster', 'ngSanitize', 'mgcrea.ngStrap']);

app.config(['$locationProvider', '$routeProvider', '$httpProvider', function ($locationProvider, $routeProvider, $httpProvider) {

    var modulesPath = 'js/modules';
    $routeProvider
        .when('/', {
            templateUrl: modulesPath + '/views/main.html'
        })

        // Master
        .when('/master/siswa', {
            templateUrl: modulesPath + '/views/master/siswa/index.html'
        })
        .when('/master/karyawan', {
            templateUrl: modulesPath + '/views/master/karyawan/index.html'
        })
        .when('/master/jenistagihan', {
            templateUrl: modulesPath + '/views/master/jenistagihan/index.html'
        })


        .when('/login', {
            templateUrl: modulesPath + '/site/views/login.html',
            controller: 'SiteLogin'
        })

        // .when('/pages/kas-masuk', {
        //     templateUrl: modulesPath + '/pages/kas-masuk.html',
        // })
        // .when('/pages/kas-masuk/kwitansi', {
        //     templateUrl: modulesPath + '/pages/kwitansi-masuk.html',
        // })
        // .when('/pages/kas-masuk/rekap', {
        //     templateUrl: modulesPath + '/pages/rekap-kas-masuk.html',
        // })

        // .when('/pages/kas-keluar', {
        //     templateUrl: modulesPath + '/pages/kas-keluar.html',
        // })
        // .when('/pages/kas-keluar/kwitansi', {
        //     templateUrl: modulesPath + '/pages/kwitansi-keluar.html',
        // })
        // .when('/pages/kas-keluar/rekap', {
        //     templateUrl: modulesPath + '/pages/rekap-kas-keluar.html',
        // })
        
        // .when('/pages/jurnal-harian', {
        //     templateUrl: modulesPath + '/pages/jurnal-harian.html',
        // })

        // .when('/pages/rekap-jurnal-harian', {
        //     templateUrl: modulesPath + '/pages/rekap-jurnal-harian.html',
        // })

        // .when('/pages/coa', {
        //     templateUrl: modulesPath + '/pages/coa.html',
        // })

        // .when('/pages/mposting', {
        //     templateUrl: modulesPath + '/pages/mposting.html',
        // })

        // .when('/pages/gl', {
        //     templateUrl: modulesPath + '/pages/gl.html',
        // })

        // .when('/pages/gl/detail', {
        //     templateUrl: modulesPath + '/pages/gl-detail.html',
        // })

        .when('/404', {
            templateUrl: modulesPath + '/views/404.html'
        })

        .otherwise({redirectTo: '/404'})
    ;

    // $locationProvider.html5Mode(true).hashPrefix('!');
    $httpProvider.interceptors.push('authInterceptor');
}]);
// $window.location.reload();
// $route.reload();
app.factory('authInterceptor', function ($q, $window) {
    return {
        request: function (config) {
            if ($window.sessionStorage._auth && config.url.substring(0, 4) == 'http') {
                config.params = {'access-token': $window.sessionStorage._auth};
            }
            return config;
        },
        responseError: function (rejection) {
            if (rejection.status === 401) {
                $window.setTimeout(function () {
                    $window.location = '/#!/login';
                }, 1000);
            }
            return $q.reject(rejection);
        }
    };
});

app.value('app-version', '0.0.3');

// Need set url REST Api in controller!
app.service('rest', function ($http, $location, $routeParams) {

    return {

        baseUrl: 'http://local.project/sips-alharaki/rest/web',
        path: undefined,

        models: function () {
            return $http.get(this.baseUrl + this.path + location.search);
        },

        model: function () {
            if ($routeParams.expand != null) {
                return $http.get(this.baseUrl + this.path + "/" + $routeParams.id + '?expand=' + $routeParams.expand);
            }
            return $http.get(this.baseUrl + this.path + "/" + $routeParams.id);
        },

        get: function () {
            return $http.get(this.baseUrl + this.path);
        },

        postModel: function (model) {
            return $http.post(this.baseUrl + this.path, model);
        },

        putModel: function (model) {
            return $http.put(this.baseUrl + this.path + "/" + $routeParams.id, model);
        },

        deleteModel: function () {
            return $http.delete(this.baseUrl + this.path);
        }
    };

});

app
    .directive('login', ['$http', function ($http) {
        return {
            transclude: true,
            link: function (scope, element, attrs) {
                scope.isGuest = window.sessionStorage._auth == undefined;
            },

            template: '<a href="#login" ng-if="isGuest"><i class="fa fa-lock"></i> Login</a>'
        }
    }])
    .filter('checkmark', function () {
        return function (input) {
            return input ? '\u2713' : '\u2718';
        };
    });
