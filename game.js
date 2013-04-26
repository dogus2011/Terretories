/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util"),					// Utility resources (logging, object inspection, etc)
	io = require("socket.io"),				// Socket.IO
	Player = require("./Player").Player;	// Player class
	House = require("./House").House;
	Attacker = require("./attacker").Attacker


/**************************************************
** GAME VARIABLES
**************************************************/
var socket,		// Socket controller
	players,	// Array of connected players
	houses,
	attackers,
	emptyHouses;
	//remoteAttackers;	


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Create an empty array to store players
	players = [];
	houses = [];
	attackers = [];
	emptyHouses = [];

	// Set up Socket.IO to listen on port 8000
	socket = io.listen(8000);
	
	// Configure Socket.IO
	socket.configure(function() {
		// Only use WebSockets
		socket.set("transports", ["websocket"]);

		// Restrict log output
		socket.set("log level", 2);
	});

	// Start listening for events
	setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Socket.IO
	socket.sockets.on("connection", onSocketConnection);
};

// New socket connection
function onSocketConnection(client) {
	util.log("New player has connected: "+ client.id);

	// Listen for client disconnected
	client.on("disconnect", onClientDisconnect);
	client.on("disconnect", ondiss);

	// Listen for new player message
	client.on("new player", onNewPlayer);
	client.on("new house", onNewHouse);
	// Listen for move player message
	client.on("move player", onMovePlayer);
	
	client.on("house click", onHouseClick);
	
	client.on("new attacker", onAttack);
	client.on("move attacker", onMoveAttacker);
	client.on("remove attacker", onRemoveAttacker);
	client.on("update", onUpdate);
	client.on("amount localhouse", onAttacked);
	client.on("takeover", onTakeover);
};


function onAttacked(data)
{
	for(y = 0; y < houses.length; y++){
		existingHouse = houses[y];
		if(existingHouse.id == data.id){
			this.broadcast.emit("amount localhouse", {id: this.id, amount: data.amount});
		}
		util.log("data id: " + data.id);
		util.log("hous id: " + existingHouse.id);
		
	}
	
	//this.broadcast.emit("amount localhouse", {id: this.id, amount: data.amount});
}

function ondiss(){
	util.log("disconnnnenenenneen");
	
}

function onTakeover()
{

}

// Socket client has disconnected
function onClientDisconnect() {
	util.log("Player has disconnected: "+this.id);

	var removePlayer = playerById(this.id);
	
	// Player not found
	if (!removePlayer) {
		util.log("Player not foundDISS: "+this.id);
		return;
	};
	var removeHouse = houseById(this.id);
	if (!removeHouse) {
		util.log("House not found: "+this.id);
		return;
	};
	//util.log("house removed: " + this.id);
	houses.splice(houses.indexOf(removeHouse), 1);
	this.broadcast.emit("remove house", {id: this.id});
	
	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);
	

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});
	//
};



function onNewHouse(data){
	var newHouse = new House(data.x, data.y,data.amount);
	newHouse.id = this.id;
	//util.log("New house has connected: "+ this.id);
	this.broadcast.emit("new house", {id: newHouse.id, x: newHouse.getX(), y: newHouse.getY(), amount: newHouse.getAmount()});
	
	var y, existingHouse;
	for(y = 0; y < houses.length; y++){
		existingHouse = houses[y];
		this.emit("new house", {id: existingHouse.id, x: existingHouse.getX(), y: existingHouse.getY(), amount: existingHouse.getAmount()});
	}
	
	houses.push(newHouse);
}

// New player has joined
function onNewPlayer(data) {
	// Create a new player
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = this.id;

	
	// Broadcast new player to connected socket clients
	this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

	// Send existing players to the new player
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
	};
	
	//util.log(players.length.toString());
		
	// Add new player to the players array
	players.push(newPlayer);
	
};



// Player has moved
function onMovePlayer(data) {
	// Find player in array
	var movePlayer = playerById(this.id);

	// Player not found
	if (!movePlayer) {
		util.log("Player not foundMOVE: "+this.id);
		return;
	};
	
	//util.log("player id: " + this.id);

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);

	// Broadcast updated position to connected socket clients
	this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
};




function onAttack(data)
{
	//var aId = Math.round(Math.random()*(999999));

	//util.log("attacker has been madeeeee: " + this.id);
	
	var newAttacker = new Attacker(data.x,data.y);
	newAttacker.id = this.id;
	newAttacker.setAmount(data.amount);
	    //drawrect = true;
	this.broadcast.emit("new attacker", {id: newAttacker.id, x: newAttacker.getX(), y: newAttacker.getY(), amount: newAttacker.getAmount()});
	
	var i, existingAttacker;
	for (i = 0; i < attackers.length; i++) {
		
		existingAttacker = attackers[i];
		this.emit("new attacker", {id: existingAttacker.id, x: existingAttacker.getX(), y: existingAttacker.getY(), amount: existingAttacker.getAmount()});
	};
	
	//util.log(attackers[0]);
	attackers.push(newAttacker);
}

function onMoveAttacker(data){
	
	var moveAttacker = attackerById(this.id);
	
	if(!moveAttacker){
		console.log("attacker not founddddd: " + this.id);
		return
	}
	moveAttacker.setX(data.x);
	moveAttacker.setY(data.y);
	
	this.broadcast.emit("move attacker", {id:moveAttacker.id, x: moveAttacker.getX(), y: moveAttacker.getY(), amount: moveAttacker.getAmount()})
}

function onUpdate(data){
	
	var updateHouse = houseById(this.id);
	
	if(!updateHouse){
		console.log("house not foundUPDATE: " + this.id);
		return;
	};
	//util.log("amount: " +this.id + " - "+ data.amount.toString() + "length: "+ houses.length.toString());
	updateHouse.setAmount(data.amount);
	this.broadcast.emit("update", {id: updateHouse.id, amount: updateHouse.getAmount()});
	
}

function onTakeover(data)
{
	this.broadcast.emit("takeover", {name: data.name, amount: data.amount});
}

function onRemoveAttacker(){
	var removeAttacker = attackerById(this.id);
	
	if(!removeAttacker){
		util.log("attacker not foundlksjf: " + this.id);
		return;
	}
	attackers.splice(attackers.indexOf(removeAttacker), 1);
	
	this.broadcast.emit("remove attacker", {id: this.id});
	//util.log("remove attacker: " + this.id);
}


function onHouseClick(data){
	
	var houseclick = houseById(data.id);
	
	if(!houseclick)
	{
		util.log("House not foundCLICK: " + data.id);
	}
	
	this.broadcast.emit("house click", {id: houseclick.id});
}



/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < players.length; i++) {
		if (players[i].id == id)
			return players[i];
	};
	
	return false;
};

function houseById(id) {
	var i;
	for (i = 0; i < houses.length; i++) {
		if (houses[i].id == id)
			return houses[i];
	};
	
	return false;
};

function attackerById(id) {
	var i;
	for (i = 0; i < attackers.length; i++) {
		if (attackers[i].id == id)
			return attackers[i];
	};
	
	//util.log("attackerbyid: " + id.toString());
	return false;
};


/**************************************************
** RUN THE GAME
**************************************************/
init();