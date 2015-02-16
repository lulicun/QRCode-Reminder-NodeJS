'use strict';

app.controller('ChatRoomCtrl', ['$scope', '$rootScope',
	function($scope, $rootScope){
		console.log("chatRoomController.js");

		var Chat = function(socket) {
			this.socket = socket;
		};

		Chat.prototype.sendMessage = function(room, text) {
			var message = {
				room: room,
				text: text
			};
			this.socket.emit ('message', message);
		};

		Chat.prototype.changeRoom = function(room) {
			this.socket.emit('join', {
				newRoom: room
			});
		};

		Chat.prototype.processCommand = function(command) {
			var words = command.split(' ');
			var command = words[0].substring(1, words[0].length).toLowerCase();
			var message = false;

			switch(command) {
				case 'join':
					words.shift();
					var room = words.join(' ');
					this.changeRoom(room);
					break;
				case 'nick':
					words.shift();
					var name = words.join(' ');
					this.socket.emit('nameAttempt', name);
					break;
				default:
					message = 'Unrecognized command.';
					break;
			}
			return message;
		};

		function divEscapedContentElement(message) {
			return $('<div></div>').text(message);
		}

		function divSystemContentElement(message) {
			return $('<div></div>').html('<i>' + message + '</i>');
		}

		function processUserInput(chatApp, socket) {
			var message = $('#send-message').val();
			var systemMessage;
			//Command or message
			if(message.charAt(0) == '/') {
				//Let the object Chat to process the message
				systemMessage = chatApp.processCommand(message);
				if (systemMessage) {  //if the message is an unrecognized message, show error
					$('#messages').append(divSystemContentElement(systemMessage));
				}
			} else {
				chatApp.sendMessage($('#room').text(), message);
				$('#messages').append(divEscapedContentElement(message));
				//Setup the scroll bar
				$('#messages').scrollTop($('#messages').prop('scrollHeight'));
			}
			//Empty send message input
			$('#send-message').val('');
		}




		
		//io is define in server side as global variable, 
		//so by doing this, we can use some node modules 
		//in client side which run on browser.
		//Also, we can not use require in client side,
		//cause browser does not support it.
		var socket = io.connect("http://localhost");
		angular.element(document).ready(function () {

	       	var chatApp = new Chat(socket);
			//Other users get the name change result as message if success
			socket.on('nameResult', function(result) {
				var message;
				if (result.success) {
					message = 'You are known as ' + result.name + '.';
				} else {
					message = result.message;
				}
				$('#messages').append(divSystemContentElement(message));
			});

			socket.on('joinResult', function(result) {
				$('#room').text(result.room);
				$('#messages').append(divSystemContentElement('Room changed.'));
			});

			socket.on('message', function (message) {
				var newElement = $('<div></div>').text(message.text);
				$('#messages').append(newElement);
			});

			//Listen to the rooms emitter from server
			socket.on('rooms', function(rooms) {
				//Empty all rooms and append new rooms to the list
				$('#room-list').empty();
				for(var room in rooms) {
					room = room.substring(1, room.length);
					if (room != '') {
						$('#room-list').append(divEscapedContentElement(room));
					}
				}
				//Change room by clicking on a room
				$('#room-list div').click(function() {
					chatApp.processCommand('/join ' + $(this).text());
					$('#send-message').focus();
				});
			});

			//To detect room changes. And show all rooms in room-list
			setInterval(function() {
				socket.emit('rooms');
				console.log("Rooms requests from chat_ui.js");
			}, 1000);
			
			$('#send-message').focus();

			$('#send-form').submit(function() {
				console.log('send-form');
				processUserInput(chatApp, socket);
				return false;
			});
	    });
	}
]);
