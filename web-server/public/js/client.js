var pomelo = window.pomelo;
var username;
var users;
var rid;
var base = 1000;
var increase = 25;
var reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
var LOGIN_ERROR = "There is no server to log in, please wait.";
var LENGTH_ERROR = "Name/Channel is too long or too short. 20 character max.";
var NAME_ERROR = "Bad character in Name/Channel. Can only have letters, numbers, Chinese characters, and '_'";
var DUPLICATE_ERROR = "Please change your name to login.";
var RID = 0;
var playerpos = {};

util = {
	urlRE: /https?:\/\/([-\w\.]+)+(:\d+)?(\/([^\s]*(\?\S+)?)?)?/g,
	//  html sanitizer
	toStaticHTML: function(inputHtml) {
		inputHtml = inputHtml.toString();
		return inputHtml.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	},
	//pads n with zeros on the left,
	//digits is minimum length of output
	//zeroPad(3, 5); returns "005"
	//zeroPad(2, 500); returns "500"
	zeroPad: function(digits, n) {
		n = n.toString();
		while(n.length < digits)
		n = '0' + n;
		return n;
	},
	//it is almost 8 o'clock PM here
	//timeString(new Date); returns "19:49"
	timeString: function(date) {
		var minutes = date.getMinutes().toString();
		var hours = date.getHours().toString();
		var seconds = date.getSeconds().toString();
		return this.zeroPad(2, hours) + ":" + this.zeroPad(2, minutes)+ ":" + this.zeroPad(2, seconds);
	},

	//does the argument only contain whitespace?
	isBlank: function(text) {
		var blank = /^\s*$/;
		return(text.match(blank) !== null);
	}
};

//always view the most recent message when it is added
function scrollDown(base) {
	window.scrollTo(0, base);
	$("#entry").focus();
};

// add message on board
function addMessage(from, target, text, time) {
	var name = (target == '*' ? 'all' : target);
	if(text === null) return;
	if(time == null) {
		// if the time is null or undefined, use the current time.
		time = new Date();
	} else if((time instanceof Date) === false) {
		// if it's a timestamp, interpret it
		time = new Date(time);
	}
	//every message you see is actually a table with 3 cols:
	//  the time,
	//  the person who caused the event,
	//  and the content
	var messageElement = $(document.createElement("table"));
	messageElement.addClass("message");
	// sanitize
	text = util.toStaticHTML(text);
	if (text.match(/__/g)) {
//		console.log(text)
		playerpos[util.toStaticHTML(from)] = text.substring(2);
//				console.log(playerpos[util.toStaticHTML(from)])
				var content = '';

	}
	else {
		var content = '<tr style="     font-size: 30px; -webkit-text-stroke: 2px blue;  color: lightblue;font-weight:bold;">' + '  <td class="date">' + util.timeString(time) + '</td>' + '  <td class="nick">' + util.toStaticHTML(from) + ' says to ' + name + ': ' + '</td>' + '  <td class="msg-text">' + text + '</td>' + '</tr>';
	}
	if (content!='') {
		messageElement.html(content);
		//the log is the stream that we view
		$("#chatHistory").append(messageElement);
		base += increase;
		scrollDown(base);
	}
};

// show tip
function tip(type, name) {
	var tip,title;
	switch(type){
		case 'online':
			tip = name + ' is online now.';
			title = 'Online Notify';
			break;
		case 'offline':
			tip = name + ' is offline now.';
			title = 'Offline Notify';
			break;
		case 'message':
		return;
			tip = name + ' is saying now.'
			title = 'Message Notify';
			break;
	}
	var pop=new Pop(title, tip);
};

// init user list
function initUserList(data) {
	users = data.users;
	if (users != undefined)
	for(var i = 0; i < users.length; i++) {
		var slElement = $(document.createElement("option"));
		slElement.val(users[i]);
		slElement.text(users[i]);
		$("#usersList").append(slElement);
	}
};

// add user in user list
function addUser(user) {
	var slElement = $(document.createElement("option"));
	slElement.val(user);
	slElement.text(user);
	$("#usersList").append(slElement);
};

// remove user from user list
function removeUser(user) {
	$("#usersList option").each(
		function() {
			if($(this).val() === user) $(this).remove();
	});
};

// set your name
function setName() {
	$("#name").text(username);
};

// set your room
function setRoom() {
	$("#room").text(rid);
};

// show error
function showError(content) {
	$("#loginError").text(content);
	$("#loginError").show();
};

// show login panel
function showLogin() {
	$("#loginView").show();
	$("#chatHistory").hide();
	$("#toolbar").hide();
	$("#loginError").hide();
	$("#loginUser").focus();
};

            




// show chat panel
function showChat() {
	$("#loginView").hide();
	$("#loginError").hide();
	$("#toolbar").show();
	$("entry").focus();
	scrollDown(base);
			setInterval(function(){
if (playerpos[username] != blendMesh.position.x+','+blendMesh.position.y+','+blendMesh.position.z+','+blendMesh.rotation.x+','+blendMesh.rotation.y+','+blendMesh.rotation.z)
					{
		var route = "chat.chatHandler.send";
pomelo.request(route, {
				rid: rid,
				content: '__'+blendMesh.position.x+','+blendMesh.position.y+','+blendMesh.position.z+','+blendMesh.rotation.x+','+blendMesh.rotation.y+','+blendMesh.rotation.z,
				from: username,
				target: '*'
			}, function(data) {

					addMessage(username, 'all', '__'+blendMesh.position.x+','+blendMesh.position.y+','+blendMesh.position.z+','+blendMesh.rotation.x+','+blendMesh.rotation.y+','+blendMesh.rotation.z);

			});
}
					},50);
};

// query connector
function queryEntry(uid, callback) {
	var route = 'gate.gateHandler.queryEntry';
	pomelo.init({
		host: window.location.hostname,
		port: 3014,
		log: true
	}, function() {
		pomelo.request(route, {
			uid: uid
		}, function(data) {
			pomelo.disconnect();
			if(data.code === 500) {
				showError(LOGIN_ERROR);
				return;
			}
			callback(data.host, data.port);
		});
	});
};

$(document).ready(function() {
	//when first time into chat room.
	showLogin();

	//wait message from the server.
	pomelo.on('onChat', function(data) {
		addMessage(data.from, data.target, data.msg);

					for(var index in playerpos) {
		              if (index != username && loadedplayers[index] == undefined ){
		                    console.log( 'must load' + index + " at " + playerpos[index]);
		                    //LOAD
		                    var t = playerpos[index].split(',');
		                    console.log(t)
		                    nm = new THREE.BlendCharacter();
                			nm.load( "marine_anims.js", 

                			function() {

                nm.scale.x=0.1
                nm.scale.y=0.1
                nm.scale.z=0.1

                nm.position.x=t[0]
                nm.position.y=t[1]
                nm.position.z=t[2]

                scene.add( nm );

                nm.animations[ 'idle' ].weight = 1;
                nm.animations[ 'walk' ].weight = 0;
                nm.animations[ 'run' ].weight = 1;

                nm.play("idle", nm.animations[ 'idle' ].weight);

            }
             );

		                    loadedplayers[index] = nm;
		              }

		              if (index != username && loadedplayers[index] != undefined && loadedplayers[index].position != undefined){
		              	nm = loadedplayers[index]
		              	//UPDATE POS
        var t = playerpos[index].split(',');
//          nm.translateX(.00001)
//          nm.translateY(.00001)
//          nm.translateZ(.00001)
                nm.position.x=t[0]
                nm.position.y=t[1]
                nm.position.z=t[2]
                nm.rotation.x=t[3]
                nm.rotation.y=t[4]
                nm.rotation.z=t[5]

    $('#pos2').html(nm.position)

		              }
		            }
		$("#chatHistory").show();
		if(data.from !== username)
			tip('message', data.from);
	});

	//update user list
	pomelo.on('onAdd', function(data) {
		var user = data.user;
		tip('online', user);
		addUser(user);
	});

	//update user list
	pomelo.on('onLeave', function(data) {
		var user = data.user;
		tip('offline', user);
		removeUser(user);
	});


	//handle disconect message, occours when the client is disconnect with servers
	pomelo.on('disconnect', function(reason) {
		showLogin();
	});

	//deal with login button click.
	$("#login").click(function() {
		username = $("#loginUser").val();
		rid = $('#channelList').val();

		if(username.length > 20 || username.length == 0 || rid.length > 20 || rid.length == 0) {
			showError(LENGTH_ERROR);
			return false;
		}

		if(!reg.test(username) || !reg.test(rid)) {
			showError(NAME_ERROR);
			return false;
		}

		//query entry of connection
		queryEntry(username, function(host, port) {
			pomelo.init({
				host: host,
				port: port,
				log: true
			}, function() {
				var route = "connector.entryHandler.enter";
				pomelo.request(route, {
					username: username,
					rid: rid
				}, function(data) {
					if(data.error) {
						showError(DUPLICATE_ERROR);
						return;
					}
					setName();
					setRoom();
					showChat();
					//$(".container").hide();
					initUserList(data);
					$("#chatHistory").show();
			
				});
			});
		});
	});

	//deal with chat mode.
	$("#entry").keypress(function(e) {
		var route = "chat.chatHandler.send";
		var target = $("#usersList").val();
		if(e.keyCode != 13 /* Return */ ) return;
		var msg = $("#entry").val().replace("\n", "");
		if(!util.isBlank(msg)) {
			pomelo.request(route, {
				rid: rid,
				content: msg,
				from: username,
				target: target
			}, function(data) {
				$("#entry").val(''); // clear the entry field.
				if(target != '*' && target != username) {
					addMessage(username, target, msg);
					$("#chatHistory").show();
				}
			});
		}
	});
});