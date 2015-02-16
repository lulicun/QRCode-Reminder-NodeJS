'use strict';

var app = angular.module('Lulicun', ['ngRoute']);

app.config(['$routeProvider',
	function($routeProvider){
		$routeProvider.
			when('/home', {
				templateUrl: 'views/home.html',
				controller: 'HomeCtrl'
			}).
			when('/', {
				redirectTo: '/home'
			}).
			when('/chatRoom', {
				templateUrl: 'views/chatRoom.html',
				controller: 'ChatRoomCtrl'
			}).
			when('/qrcodeReminder', {
				templateUrl: 'views/qrcodeReminder.html',
				controller: 'QRCodeReminderCtrl'
			}).						
			otherwise({
				redirectTo: '/home'
			});
	}
]);