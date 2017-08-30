'use strict';

define(['app'], function (app) {

    var injectParams = ['$http', '$rootScope','$cookieStore','$CONST_VAR'];

    var authFactory = function ($http, $rootScope, $cookieStore, $CONST_VAR) {
        var serviceBase = BASEAPIURL,
            factory = {
                loginPath: 'auths/login',
                user: {
                    isAuthenticated: false,
                    roles: null
                }
            };

        factory.session = function(key){
            var me = this,
                _key = (typeof key == 'undefined') ? $CONST_VAR.cookieskey : key;

            var fields = {
                isAuthValid : '__is_auth_valid__',
                accessToken : '__access_token__',
                userProfile : '__user_profile__',
                sekolahProfile : '__sekolah_profile__',
                sekolahList : '__sekolah_list__',
                tahunList : '__tahun_list__',
                tahunSelected : '__tahun_selected__'
            }

            /*
             * get session apps
             * @param {key} spesific session key  
             * @access public
             * @return String session value
             */
            me.get = function(key){
                // console.log(fields[key]);
                // console.log(me.getSessions(fields[key]));
                return me.getSessions(fields[key]);
            }
            
            /*
             * set session apps
             * @param {key} spesific session key  
             * @param {value} value for spesific session key 
             * @access public
             */
            me.set = function(key, value){
                // console.log(this.getSessions());
                var sessiondetail = (me.getSessions() != false) ? me.getSessions() : new Object;
                sessiondetail[fields[key]] = value;
                me.setSessions(sessiondetail);
                // return localStorage.setItem(this.fields[key], value);
            }

            /*
             * remove session by key
             * @param {key} spesific session key  
             * @access public
             */
            me.remove = function(key){
                var sessiondetail = me.getSessions() || {};
                sessiondetail[fields[key]] = '';
                me.setSessions(sessiondetail);
                // return localStorage.removeItem(this.fields[key]);
            },

            /*
             * remove all session key
             * @access public
             */
            me.clear = function(){
                $cookieStore.remove(_key);
            },
            /*
             * set all session with encode data
             * @param {value} Object session  
             * @access public
             */
            me.setSessions = function(value) {
                $cookieStore.put(_key, JSON.stringify(value));
            };

            /*
             * get all session with decode data
             * @param {key} String, optional if not set return all session as object 
             * @access public
             * @return Object|String session
             */
            me.getSessions = function(key) {
                var sessions = (typeof $cookieStore.get(_key) != 'undefined' && $cookieStore.get(_key) !='') ? $cookieStore.get(_key) : false;

                if(key){
                    sessions = (sessions && sessions != '') ? JSON.parse(sessions) : '';
                    return sessions[key];
                }else{
                    sessions = (sessions && sessions != '') ? JSON.parse(sessions) : '';
                    return sessions;
                }
            }
        }

        factory.login = function (usernameOrEmail, passwd) {
            return $http.post(serviceBase + 'auths/login', {
                    username : usernameOrEmail,
                    password : passwd 
                }).then(
                function (results) {
                    var loggedIn = results.data.success;
                    changeAuth(loggedIn, results.data.rows);
                    // factory.profil = results.data.rows;
                    return loggedIn;
                }
            );
        };

        factory.logout = function () {
            return $http.post(serviceBase + 'auths/logout').then(
                function (results) {
                    var loggedIn = !results.data.success;
                    changeAuth(loggedIn);
                    return loggedIn;
                });
        };

        factory.getProfile = function(paramdata) {
            var session = new factory.session();
            // return JSON.parse(sessionStorage.getItem('user_profil'));
            return JSON.parse(session.get('userProfile'));
        };

        factory.getSekolahProfile = function(paramdata) {
            var session = new factory.session();
            // return JSON.parse(sessionStorage.getItem('sekolah_profile'));
            return JSON.parse(session.get('sekolahProfile'));
        };

        factory.getSekolahList = function() {
            // var session = new factory.session();
            // return JSON.parse(session.get('sekolahList'));

            return JSON.parse(localStorage.getItem('sekolahList'));
        };

        factory.getTahunList = function() {
            // var session = new factory.session();
            // return JSON.parse(session.get('tahunList'));

            return JSON.parse(localStorage.getItem('tahunList'));
        };

        factory.getSelectedTahun = function() {
            var session = new factory.session();
            return JSON.parse(session.get('tahunSelected'));
        };

        factory.setSelectedTahun = function(tahunid) {
            var session = new factory.session();
            var tahunList = factory.getTahunList();
            for(var x in tahunList){
                if(tahunList[x].id == tahunid){
                    session.set('tahunSelected', JSON.stringify(tahunList[x]));
                    break;
                }
            }
        };

        factory.changeSekolahId = function(id) {
            return $http.get(serviceBase + 'sekolahs/profile/' + id).then(function (results) {
                if(results.data.success){
                    var session = new factory.session();
                    // sessionStorage.setItem('sekolah_profile', JSON.stringify(results.data.rows));
                    session.set('sekolahProfile', JSON.stringify(results.data.rows));
                }
                return results.data;
            });
        };

        factory.redirectToLogin = function () {
            $rootScope.$broadcast('redirectToLogin', null);
        };

        function changeAuth(loggedIn, data) {
            factory.user.isAuthenticated = loggedIn;
            // localStorage.setItem('isAuthValid', loggedIn);
            var session = new factory.session();

            if(loggedIn){
                // sessionStorage.setItem('isAuthValid', loggedIn);
                session.set('isAuthValid', loggedIn);
                // console.log('isAuthValid : ' + session.get('isAuthValid'));

                if(typeof data != 'undefined'){
                    // sessionStorage.setItem('accessToken', data.__accessToken);
                    // sessionStorage.setItem('user_profil', JSON.stringify(data.__user_profile));
                    // sessionStorage.setItem('sekolah_profile', JSON.stringify(data.__sekolah_profile));

                    session.set('accessToken', data.__accessToken);
                    session.set('userProfile', JSON.stringify(data.__user_profile));
                    session.set('sekolahProfile', JSON.stringify(data.__sekolah_profile));

                    // session.set('sekolahList', JSON.stringify(data.__sekolah_list));
                    // session.set('tahunList', JSON.stringify(data.__tahun_list));
                    localStorage.setItem('sekolahList', JSON.stringify(data.__sekolah_list));
                    localStorage.setItem('tahunList', JSON.stringify(data.__tahun_list));

                    factory.setSelectedTahun(data.__sekolah_profile.tahun_ajaran_id);

                    // console.log(factory.getSelectedTahun());

                    $rootScope.$broadcast('loginStatusChanged', loggedIn);
                }
            }else{
                sessionStorage.clear();
                session.clear();
                localStorage.clear();
            }
            $rootScope.$broadcast('loginStatusChanged', loggedIn);
        }

        return factory;
    };

    authFactory.$inject = injectParams;

    app.factory('authService', authFactory);

});
