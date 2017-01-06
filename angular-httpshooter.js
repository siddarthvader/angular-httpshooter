(function(){
	'use strict';
	angular.module('angular-httpshooter',[])
		.factory('$httpshooter',$httpshooter);

	$httpshooter.$inject= ['$http', '$q', '$timeout', '$rootScope', 'shootConfig'];

	function $httpshooter ($http, $q, $timeout, $rootScope, shootConfig) {

		var timeoutMsg={error:'timeout',statusCode:599,message:'timeout'};

		var queue = function (config, time) {

			var flag = true;

			console.info($rootScope.httpshooter_queuedCalls);

			if (!$rootScope.httpshooter_queuedCalls) {
				$rootScope.httpshooter_queuedCalls = [];
			}
			else{
				if (shootConfig.blockDuplicateCalls && $rootScope.httpshooter_queuedCalls.length ) {

					$rootScope.httpshooter_queuedCalls.forEach(function (http, i) {
						if(shootConfig.compareDuplicateParam.url){
							if (http.config.url == config.url) {
								flag = false;
							}
						}
						if(shootConfig.compareDuplicateParam.data){
							if(angular.equals(http.config.data,config.data)){
								flag=false;
							}
						}
					});
				}
			}


			var deferred = $q.defer();

			if (flag) {
				$rootScope.httpshooter_queuedCalls.push({ config: config, deferred: deferred, time: time?time:shootConfig.defaultTimeOut });
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
			switch (config.method.toLowerCase()) {
				case 'get':
					get(config,$rootScope.httpshooter_queuedCalls[0].time);
					break;
				case 'delete':
					deleteCall(config, $rootScope.httpshooter_queuedCalls[0].time);
					break;
				case 'head':
					head(config,$rootScope.httpshooter_queuedCalls[0].time);
					break;
				case 'post':
					post(config,$rootScope.httpshooter_queuedCalls[0].time);
					break;
				case 'patch':
					patch(config, $rootScope.httpshooter_queuedCalls[0].time);
					break;
				case 'put':
					put(config,$rootScope.httpshooter_queuedCalls[0].time);
					break;
			}

		};

		var success = function (data) {
			$rootScope.$broadcast('HTTP_CALL_STOPPED', $rootScope.httpshooter_queuedCalls[0].config);
			$rootScope.httpshooter_queuedCalls[0].deferred.resolve(data);
			$rootScope.httpshooter_queuedCalls.shift();
			if ($rootScope.httpshooter_queuedCalls.length > 0) {
				callDeterminer();
			}
		};

		var fail= function (data) {
			$rootScope.$broadcast('HTTP_CALL_STOPPED', $rootScope.httpshooter_queuedCalls[0].config);
			$rootScope.httpshooter_queuedCalls[0].deferred.reject(data);
			$rootScope.httpshooter_queuedCalls.shift();
			if ($rootScope.httpshooter_queuedCalls.length > 0) {
				callDeterminer();
			}
		};

		var get = function (config,time) {

			var deferred = $rootScope.httpshooter_queuedCalls[0].deferred;
			var timeout = $timeout(function () {
				deferred.reject(timeoutMsg);
			}, time);


			$http({
				url: config.url,
				method: 'GET',
				headers:config.headers,
				timeout: timeout
			}).then(function (data) {
				success(data.data);

			}, function (data) {
				fail(data.data);

			}).finally(function () {
				$timeout.cancel(timeout);
			});

		};

		var post = function (config,time) {


			var deferred = $rootScope.httpshooter_queuedCalls[0].deferred;
			var timeout = $timeout(function () {
				deferred.reject(timeoutMsg);
			}, time);

			$http({
				url: config.url,
				method: 'POST',
				headers: config.headers,
				data: config.data,
				timeout: timeout
			}).then(function (data) {

				success(data.data);

			}, function (data) {

				fail(data.data);

			}).finally(function () {
				$timeout.cancel(timeout);
			});

		};

		var patch = function (config,time) {


			var deferred = $rootScope.httpshooter_queuedCalls[0].deferred;
			var timeout = $timeout(function () {
				deferred.reject(timeoutMsg);
			}, time);

			$http({
				url: config.url,
				method: 'POST',
				headers: config.headers,
				data: config.data,
				timeout: timeout
			}).then(function (data) {

				success(data.data);

			}, function (data) {

				fail(data.data);

			}).finally(function () {
				$timeout.cancel(timeout);
			});

		};

		var put = function (config,time) {


			var deferred = $rootScope.httpshooter_queuedCalls[0].deferred;
			var timeout = $timeout(function () {
				deferred.reject(timeoutMsg);
			}, time);

			$http({
				url: config.url,
				method: 'POST',
				headers: config.headers,
				data: config.data,
				timeout: timeout
			}).then(function (data) {

				success(data.data);

			}, function (data) {

				fail(data.data);

			}).finally(function () {
				$timeout.cancel(timeout);
			});

		};


		var deleteCall = function (config, time) {

			var deferred = $rootScope.httpshooter_queuedCalls[0].deferred;

			var timeout = $timeout(function () {
				deferred.reject(timeoutMsg);
			}, time);

			$http({
				url: config.url,
				method: 'DELETE',
				data: config.data,
				headers: config.headers,
				timeout: timeout
			}).then(function (data) {

				success(data.data);


			}, function (data) {

				fail(data.data);

			}).finally(function () {
				$timeout.cancel(timeout);
			});

			return deferred.promise;
		};

		var head = function (config, time) {
			var deferred = $rootScope.httpshooter_queuedCalls[0].deferred;
			var timeout = $timeout(function () {
				deferred.reject(timeoutMsg);
			}, time);


			$http({
				url: url,
				method: 'HEAD',
				timeout: timeout
			}).then(function (data) {

				success(data.data);

			}, function (data) {

				fail(data.data);

			}).finally(function () {
				$timeout.cancel(timeout);
			});
		};

		return {
			queue: queue
		};
	}

	angular.module('angular-httpshooter').constant('shootConfig', {
		defaultTimeOut:36000,
        blockDuplicateCalls: true,
		compareDuplicateParam:{
			url:true,
			data:false
		}
	});

})();


(function(){
	'use strict';
})();


