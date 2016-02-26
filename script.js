var cmd = ["look", "open", "use","examine", "olhar", "abrir", "usar", "examinar"]
var mv = ['n', 's', 'e', 'w', 'north', 'south', 'east', 'west']
var rooms = [];
var actualRoom = [];
var moves = 0;
var objects = [];
var object = {
  name:"",
  status:"",
  take: false,
  txt:"",
  combine:false,
  active:false,
  roomNumber:""
}

var room = {
	number: "",
	name: "",
	desc:"",
	north:"",
	south:"",
	east:"",
	west:"",
	objects:[],
	go:function(m){
		if(m == "n" || m == "north"){
			if(!isNaN(actualRoom.north)){
				actualRoom = getRoom(actualRoom.north);
			}else{
				$("#area").append("<p> Não há porta </p>");
			}
		}

		if(m == "s" || m == "south"){
			if(!isNaN(actualRoom.south)){
				actualRoom = getRoom(actualRoom.south);
			}else{
				$("#area").append("<p> Não há porta </p>");
			}
		}

		if(m == "e" || m == "east"){
			if(!isNaN(actualRoom.east)){
				actualRoom = getRoom(actualRoom.east);
			}else{
				$("#area").append("<p> Não há porta </p>");
			}
		}

		if(m == "w" || m == "west"){
			if(!isNaN(actualRoom.west)){
				actualRoom = getRoom(actualRoom.west);
			}else{
				$("#area").append("<p> Não há porta </p>");
			}
		}
		update();
	}
}

function createObj(name, txt, room){
	var o = Object.create(object);
	o.name = name;
	o.txt = txt;
	o.actions = new Map();
	o.roomNumber = room
	return o;
}

function setObjects(array){
	var objects = [];
	for (var i = 0; i < array.length; i++) {
		var o = array[i].split("#");
		objects.push(createObj(o[0], o[1], o[2]));
	};
	return objects;
}

function getObjects(num){
	var objs = [];
	objects.forEach(function(o){
		if(o.roomNumber  == num){
			objs.push(o);
		}
	});
	return objs;
}

function createRoom(number, name, desc, n, s, w, e){
	var r = Object.create(room);
	r.number = number;
	r.name = name;
	r.desc = desc;
	r.north = n;
	r.south = s;
	r.east = e;
	r.west = w;
	r.objects = getObjects(r.number);
	return r;
}

function getRoom(num){
	var thisRoom;
	rooms.forEach(function(r) {
		if (r.number == num) {
			thisRoom = r;
		}
	});
	return thisRoom;	
}


function setRooms(array){
	var rooms = [];
	for (var i = 0; i < array.length; i++) {
		var r = array[i].split("#");
		rooms.push(createRoom(r[0],r[1],r[2],r[3],r[4],r[5],r[6]));
	};
	return rooms;
}

function keyboard(evt){
	if(evt.keyCode == 13){	
		if($("#text").val().trim() == ""){
			$("#text").val("");
			return
		}
		readInput();
	}
}



function readInput(){
	var text = $("#text").val();
	var txt  = text.split(" ");
	$("#area").append("<p> > "+text+"</p>");

	if((txt[0] == "look"|| txt[0] == "olhar") && txt.length == 1){
		append(actualRoom.desc);
		actualRoom.objects.forEach(function(o){
			append(o.txt);
		});
		moves += 1;
		$("mov").text(moves);
		$("#text").val("");
		$("#area").animate({scrollTop: $("#area").prop("scrollHeight")}, 1000);
		return;
	}

	for (var i = 0; i < mv.length; i++) {
		if(txt[0] == mv[i]){
			actualRoom.go(txt);
			return;
		}
	};

	for(var i=0; i < cmd.length; i++){		
		if(txt[0] == cmd[i]){
			// $("#area").append("<p> Comando: " +$("#text").val() +"</p>");
			// for(var j = 0; j < objects.length; i++){
			// }
			if(txt[1] == ""){
				return;
			}
			for(var obj = 0; obj < objects.length; obj++){
				if(txt[1] == objects[obj].name){
					append(objects[obj].txt);
					moves += 1;
					$("mov").text(moves);
					$("#text").val("");
					$("#area").animate({scrollTop: $("#area").prop("scrollHeight")}, 1000);
					return
				}
			}
		}
	}
	$("#area").append("<p class='red'> Este não é um comando válido! </p>");
	$("#text").val("");
	$("#area").animate({scrollTop: $("#area").prop("scrollHeight")}, 1000);		
}

window.addEventListener('keydown', keyboard, true);

function append(txt){
	$("#area").append("<p> "+txt+"</p>");
}

function init(){
	var roomArray = [
		"0#entrada#Entrada da casa#-#3#-#-",
		"1#sala 1#sala 1#-#4#-#2",
		"2#sala 2#sala 2#-#5#1#-",
		"3#sala 3#sala 3#0#6#-#-",
		"4#sala 4#sala 4#1#-#-#-",
		"5#sala 5#sala 5#2#8#-#-",
		"6#sala 6#sala 6#3#-#-#7",
		"7#sala 7#sala 7#-#-#6#8",
		"8#sala 8#sala 8#5#-#7#-"
	];
	var objectArray = [
		"porta#Uma porta de madeira. Parece estar trancada.#0",
		"janela#Uma janela de madeira. Parece estar trancada.#0"
	];
	objects = setObjects(objectArray);
	rooms = setRooms(roomArray);
	actualRoom =  rooms[0];
	$("#text").focus();
}

function update(){
	$("#area").append("<p> "+actualRoom.desc+"</p>");
	$("pos").text(actualRoom.name);
	moves += 1;
	$("mov").text(moves);
	$("#text").val("");
	$("#area").animate({scrollTop: $("#area").prop("scrollHeight")}, 1000);
	return;
}

$("document").ready(function(){
	init();
});
$("html").click(function(){
	$("#text").focus();
})