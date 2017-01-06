(function () {
    'use strict';
    angular.module('angular-httpshooter').factory('$httpshooter'['$http', '$q', '$timeout', '$rootScope', 'shootConfig', function ($http, $q, $timeout, $rootScope, shootConfig) {

        var queue = function (config, time) {

            var flag = true;

            if (!$rootScope.httpQueue.length) {
                $rootScope.httpQueue = [];
            }

            if (shootConfig.allowDuplicateCalls) {
                $rootScope.httpshooter_queuedCalls.forEach(function (http, i) {
                    console.log(http.config.url, config.url, i);
                    if (http.config.url == config.url) {
                        flag = false;
                    }
                });
            }

            var deferred = $q.defer();

            if (flag) {
                $rootScope.httpshooter_queuedCalls.push({ config: config, deferred: deferred, time: time });
                if ($rootScope.httpshooter_queuedCalls.length === 1) {

                    /*
                     * - broadcasting HTTP_CALL_STARTED event, you can catch this event and 
                     * do different kind of things, like start a loader or something
                     */

                    if (config.method != 'get') {
                        $rootScope.$broadcast('HTTP_CALL_STARTED', config);
                    }
                    callDeterminer();
                }
                return deferred.promise;

            }
            else {
                return $q.reject({
                    data: '',
                    headers: {},
                    status: 400,
                    config: config
                });
            }
        };

        var callDeterminer = function () {

            var config = $rootScope.httpshooter_queuedCalls[0].config;
            switch (config.method.toLowetCase()) {
                case 'get':
                    get(config.url, $rootScope.httpshooter_queuedCalls[0].time);
                    break;
                case 'delete':
                    deleteCall(config.url, $rootScope.httpshooter_queuedCalls[0].time);
                    break;
                case 'head':
                    head(config.url, $rootScope.httpshooter_queuedCalls[0].time);
                    break;
                case 'post':
                    post(config.url, config.data, $rootScope.httpshooter_queuedCalls[0].time);
                    break;
                case 'patch':
                    patch(config.url, config.data, $rootScope.httpshooter_queuedCalls[0].time);
                    break;
                case 'put':
                    put(config.url, config.data, $rootScope.httpshooter_queuedCalls[0].time);
                    break;
            }

        };


        var get = function (url, time) {

            var deferred = $rootScope.httpshooter_queuedCalls[0].deferred;
            var timeout = $timeout(function () {
                deferred.reject('Timeout');
            }, time);


            $http({
                url: url,
                method: 'GET',
                timeout: timeout
            }).then(function (data) {

                data = data.data;
                // broadcasting HTTP_CALL_STOPPED event,
                $rootScope.$broadcast('HTTP_CALL_STOPPED', $rootScope.httpshooter_queuedCalls[0].config);
                $rootScope.httpshooter_queuedCalls[0].deferred.resolve(data);
                $rootScope.httpshooter_queuedCalls.shift();
                if ($rootScope.httpshooter_queuedCalls.length > 0) {
                    callDeterminer();
                }

                /**
                 * since it is a queue,
                 * we will always remove things from the top of it
                 */


            }, function (data) {
                $rootScope.$broadcast('HTTP_CALL_STOPPED', $rootScope.httpshooter_queuedCalls[0].config);
                $rootScope.httpshooter_queuedCalls[0].deferred.reject(data.data);
                $rootScope.httpshooter_queuedCalls.shift();
                if ($rootScope.httpshooter_queuedCalls.length > 0) {
                    callDeterminer();
                }

            }).finally(function () {
                $timeout.cancel(timeout);
            });

        };

        var post = function (url, data, time, loader) {


            var deferred = $rootScope.httpshooter_queuedCalls[0].deferred;
            var timeout = $timeout(function () {
                deferred.reject('Timeout');
            }, time);

            $http({
                url: url,
                method: 'POST',
                headers: headers,
                data: data,
                timeout: timeout
            }).then(function (data) {

                data = data.data;

                $rootScope.$broadcast('HTTP_CALL_STOPPED', $rootScope.httpshooter_queuedCalls[0].config.url);
                $rootScope.httpshooter_queuedCalls[0].deferred.resolve(data);
                $rootScope.httpshooter_queuedCalls.shift();
                if ($rootScope.httpshooter_queuedCalls.length > 0) {
                    callDeterminer();
                }


            }, function (data) {
                $rootScope.$broadcast('HTTP_CALL_STOPPED', $rootScope.httpshooter_queuedCalls[0].config.url);
                $rootScope.httpshooter_queuedCalls[0].deferred.reject(data.data);
                $rootScope.httpshooter_queuedCalls.shift();
                if ($rootScope.httpshooter_queuedCalls.length > 0) {
                    callDeterminer();
                }


            }).finally(function () {
                $timeout.cancel(timeout);
            });

        };

        var patch = function (url, data, time, loader) {


            var deferred = $rootScope.httpshooter_queuedCalls[0].deferred;
            var timeout = $timeout(function () {
                deferred.reject('Timeout');
            }, time);

            $http({
                url: url,
                method: 'POST',
                headers: headers,
                data: data,
                timeout: timeout
            }).then(function (data) {

                data = data.data;

                $rootScope.$broadcast('HTTP_CALL_STOPPED', $rootScope.httpshooter_queuedCalls[0].config.url);
                $rootScope.httpshooter_queuedCalls[0].deferred.resolve(data);
                $rootScope.httpshooter_queuedCalls.shift();
                if ($rootScope.httpshooter_queuedCalls.length > 0) {
                    callDeterminer();
                }


            }, function (data) {
                $rootScope.$broadcast('HTTP_CALL_STOPPED', $rootScope.httpshooter_queuedCalls[0].config.url);
                $rootScope.httpshooter_queuedCalls[0].deferred.reject(data.data);
                $rootScope.httpshooter_queuedCalls.shift();
                if ($rootScope.httpshooter_queuedCalls.length > 0) {
                    callDeterminer();
                }


            }).finally(function () {
                $timeout.cancel(timeout);
            });

        };

        var put = function (url, data, time, loader) {


            var deferred = $rootScope.httpshooter_queuedCalls[0].deferred;
            var timeout = $timeout(function () {
                deferred.reject('Timeout');
            }, time);

            $http({
                url: url,
                method: 'POST',
                headers: headers,
                data: data,
                timeout: timeout
            }).then(function (data) {

                data = data.data;

                $rootScope.$broadcast('HTTP_CALL_STOPPED', $rootScope.httpshooter_queuedCalls[0].config.url);
                $rootScope.httpshooter_queuedCalls[0].deferred.resolve(data);
                $rootScope.httpshooter_queuedCalls.shift();
                if ($rootScope.httpshooter_queuedCalls.length > 0) {
                    callDeterminer();
                }


            }, function (data) {
                $rootScope.$broadcast('HTTP_CALL_STOPPED', $rootScope.httpshooter_queuedCalls[0].config.url);
                $rootScope.httpshooter_queuedCalls[0].deferred.reject(data.data);
                $rootScope.httpshooter_queuedCalls.shift();
                if ($rootScope.httpshooter_queuedCalls.length > 0) {
                    callDeterminer();
                }


            }).finally(function () {
                $timeout.cancel(timeout);
            });

        };

        var deleteCall = function (url, data, time, headers) {

            var deferred = $rootScope.httpshooter_queuedCalls[0].deferred;

            var timeout = $timeout(function () {
                deferred.reject('Timeout');
            }, time);

            $http({
                url: url,
                method: 'DELETE',
                data: data,
                headers: headers,
                timeout: timeout
            }).then(function (data) {

                data = data.data;

                /**
                     * since it is a queue,
                     * we will always remove things from the top of it
                     */

                $rootScope.$broadcast('HTTP_CALL_STOPPED', $rootScope.httpshooter_queuedCalls[0].config.url);
                $rootScope.httpshooter_queuedCalls[0].deferred.resolve(data);
                $rootScope.httpshooter_queuedCalls.shift();
                if ($rootScope.httpshooter_queuedCalls.length > 0) {
                    callDeterminer();
                }


            }, function (data) {
                $rootScope.$broadcast('HTTP_CALL_STOPPED', $rootScope.httpshooter_queuedCalls[0].config.url);
                $rootScope.httpshooter_queuedCalls[0].deferred.reject(data.data);
                $rootScope.httpshooter_queuedCalls.shift();
                if ($rootScope.httpshooter_queuedCalls.length > 0) {
                    callDeterminer();
                }

            }).finally(function () {
                $timeout.cancel(timeout);
            });

            return deferred.promise;
        };

        var head = function (url, time) {
            var deferred = $rootScope.httpshooter_queuedCalls[0].deferred;
            var timeout = $timeout(function () {
                deferred.reject('Timeout');
            }, time);


            $http({
                url: url,
                method: 'HEAD',
                timeout: timeout
            }).then(function (data) {

                data = data.data;
                // broadcasting HTTP_CALL_STOPPED event,
                $rootScope.$broadcast('HTTP_CALL_STOPPED', $rootScope.httpshooter_queuedCalls[0].config);
                $rootScope.httpshooter_queuedCalls[0].deferred.resolve(data);
                $rootScope.httpshooter_queuedCalls.shift();
                if ($rootScope.httpshooter_queuedCalls.length > 0) {
                    callDeterminer();
                }

                /**
                 * since it is a queue,
                 * we will always remove things from the top of it
                 */


            }, function (data) {
                $rootScope.$broadcast('HTTP_CALL_STOPPED', $rootScope.httpshooter_queuedCalls[0].config);
                $rootScope.httpshooter_queuedCalls[0].deferred.reject(data.data);
                $rootScope.httpshooter_queuedCalls.shift();
                if ($rootScope.httpshooter_queuedCalls.length > 0) {
                    callDeterminer();
                }

            }).finally(function () {
                $timeout.cancel(timeout);
            });
        }

        return {
            queue: queue
        }

    }]);
});


(function () {
    'use strict';
    angular.module('angular-httpshooter').constant('shootConfig', {
        allowDuplicateCalls: true
    });
});
