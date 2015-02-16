'use strict';
app.controller('QRCodeReminderCtrl', ['$scope', '$rootScope', '$http',
	function($scope, $rootScope, $http) {
		console.log("QRCodeReminderCtrl");
		$http.defaults.useXDomain = true;
		$scope.getQRCode = function(){
			console.log($scope.email);
			$http.get('http://api.lulicun.com/v1/qrcode/' + $scope.email).
  				success(function(data, status, headers, config) {
					console.log("data", data.Lulicun);
					$scope.qrcodeUrl = data.Lulicun;
				}).
				error(function(data, status, headers, config) {
			});
		};
	}
]);