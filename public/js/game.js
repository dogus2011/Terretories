/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx,
	housectx,			// Canvas rendering context
	keys,			// Keyboard input
	localPlayer,	// Local player
	remotePlayers,
	remoteHouses,
	mousePos,
	goToPlace,
	moveSpeed,
	localHouse,
	houseImg,
	emptyhouseImg,
	character,
	amount,
	socket,
	selectedHouse,
	id,
	selected,
	drawrect,
	localAttackers,
	remoteAttackers,
	testInt,
	attackInProgress,
	numberOfSoldiers,
	numberOfAttackers,
	emptyhouse1,
	emptyhouse2,
	emptyhouse3,
	emptyhouse4,
	emptyhouse5,
	emptyhouses,
	emptyHouseSelected,
	localHouses,
	enemyHouses;	


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");
	housectx = canvas.getContext("2d");

	// Maximise the canvas
	//canvas.width = window.innerWidth;
	//canvas.height = window.innerHeight;
	canvas.width = 800;
	canvas.height = 800;
	mousePos = 0;
	moveSpeed = 4;
	// Initialise keyboard controls
	keys = new Keys();
	goToPlace = false;
	drawrect = false;
	emptyHouseSelected = false;
	attackInProgress = false;
	amount = 10;
	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random()*(canvas.width-25)),
		startY = Math.round(Math.random()*(canvas.height-25));

	// Initialise the local player
	
	
	
	
	socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
	testInt = 0;
	remotePlayers = [];
	remoteHouses = [];
	selectedHouse = [];
	emptyhouses = [];
	localHouses = [];
	enemyHouses =[];
	
	localPlayer = new Player(startX, startY);
	localHouse = new House(startX, startY);
	localAttackers = new Attacker();
	
	emptyhouse1 = new emptyHouse(100, 100);
	emptyhouse2 = new emptyHouse(200, 100);
	emptyhouse3 = new emptyHouse(300, 100);
	emptyhouse4 = new emptyHouse(400, 100);
	emptyhouse5 = new emptyHouse(500, 100);
	
	remoteAttackers = [];
	selected = false;
	houseImg = loadImage("img/house.png");
	emptyhouseImg = loadImage("img/emptyhouse.png");
	character = loadImage("img/character.png");
	numberOfSoldiers = 0;
	numberOfAttackers = 0;
	// Start listening for events
	emptyhouses.push(emptyhouse1);
	emptyhouses.push(emptyhouse2);
	emptyhouses.push(emptyhouse3);
	emptyhouses.push(emptyhouse4);
	emptyhouses.push(emptyhouse5);
	
	var e;
	for(e = 0; e < emptyhouses.length; e++)
	{
		emptyhouses[e].draw(ctx, houseImg,false);
		emptyhouses[e].setAmount(5);
	};
	
	setEventHandlers();
	
	
};

function loadImage(name)
{
    // create new image object
    var image = new Image();
    // load image
    image.src = name;
    // return image object
    return image;
}

/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Keyboard
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);

	// Window resize
	window.addEventListener("resize", onResize, false);
	
	socket.on("connect", onSocketConnected);
	socket.on("disconnect" , onSocketDisconnect);
	socket.on("new player" , onNewPlayer);
	socket.on("new house", onNewHouse);
	socket.on("move player" , onMovePlayer);
	socket.on("remove player" , onRemovePlayer);
	socket.on("house click", onHouseClick);
	socket.on("new attacker", onAttack);
	socket.on("move attacker", onMoveAttacker);
	socket.on("remove attacker", onRemoveAttacker);
	socket.on("update", onUpdate);
	socket.on("amount localhouse", onAttacked);
	socket.on("takeover", onTakeover);
};

function onAttacked(data)
{		
	localHouse.setAmount(data.amount);
	
}

function onTakeover(data)
{

	var enemyHouseTaken = emptyhouseByName(data.name);
	alert(emptyhouseByName(data.name).toString());
	enemyHouses.push(emptyhouses.indexOf(enemyHouseTaken), 1);
	emptyhouses.splice(emptyhouses.indexOf(enemyHouseTaken), 1);
	enemyHouseTaken.setAmount(data.amount);
	
	
	
}

// Keyboard key down
function onKeydown(e) {
	if (localPlayer) {
		keys.onKeyDown(e);
	};
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
		keys.onKeyUp(e);
	};
};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = 800;
	canvas.height = 800;
};

function onSocketConnected(){
	console.log("Connected to socket server");
	
	socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY()});
	socket.emit("new house", {x: localHouse.getX(), y: localHouse.getY(), amount: localHouse.getAmount()});
};

function attackEnemy()
{
	socket.emit("new attacker", {x: localPlayer.getX(), y: localPlayer.getY(), amount: localAttackers.getAmount()});
}


function onSocketDisconnect(){
	console.log("Disconnected from socket server");
};

function onNewHouse(data){
	//console.log("new house: " + data.id + " amount: " + data.amount);
	var newHouse = new House(data.x, data.y);
	newHouse.id = data.id;
	newHouse.setAmount(data.amount);
	remoteHouses.push(newHouse);
}

function onNewPlayer(data){
	//console.log("New player connected: " + data.id);
	
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = data.id;
	remotePlayers.push(newPlayer);
	//alert("new player");
	
};


function onAttack(data)
{
	
		var newAttacker = new Attacker(data.x, data.y);
		
		newAttacker.id = data.id;
		newAttacker.setAmount(data.amount);
	    remoteAttackers.push(newAttacker);
	    
	    
	    //console.log("new attacker: " + data.id + " - " + data.x + " _ " + data.y);
	    //drawrect = true;
	   
}

function onHouseClick(data){

	var houseclick = houseById(data.id);
	
	if(!houseclick)
	{
		//util.log("House not found: " + data.id);
	}
}

function onMoveAttacker(data){
	var moveAttacker = attackerById(data.id);
	
	if(!moveAttacker){
		console.log("attacker not founddd: " + data.id);
		return
	}
	
	moveAttacker.setX(data.x);
	moveAttacker.setY(data.y);
	moveAttacker.setAmount(data.amount);
}

function onMovePlayer(data){
	
	var movePlayer = playerById(data.id);
	
	if(!movePlayer){
		console.log("Player not found: " + data.id);
		return;
	};
	//console.log(movePlayer.id.toString());
	
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
	
};

function onUpdate(data)
{
	var updateHouse = houseById(data.id);
	//console.log("houseee: " + data.amount);
	if(!updateHouse){
		console.log("house not found: " + data.id);
		return;
	};
	//console.log(data.id + " - " + data.amount.toString());
	updateHouse.setAmount(data.amount);
}

function onRemovePlayer(data){
	var removePlayer = playerById(data.id);
	
	if(!removePlayer){
		console.log("Player not found: " + data.id);
		return;
	};
	
	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
	
	removeHouses(data);
	
};

function onRemoveAttacker(data){
	var removeAttacker = attackerById(data.id);
	
	if(!removeAttacker){
		console.log("Attacker not fouuuu: " + data.id);
		return;
	}
	
	remoteAttackers.splice(remoteAttackers.indexOf(removeAttacker), 1);
	//console.log("Attacker removed: " + data.id);
	//alert("removed");
	
}

function removeHouses(data)
{
	var removeHouse = houseById(data.id);
	
	if(!removeHouse){
		console.log("Player not found: " + data.id);
		return;
	};
	
	remoteHouses.splice(remoteHouses.indexOf(removeHouse), 1);
}



/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	update();
	draw();
	amount = amount + 1;
	if(amount == 60)
	{
		localHouse.update(1);
		//console.log(localHouse.getAmount().toString());
		var i;
		for(i = 0; i < localHouses.length; i++)
		{
			localHouses[i].update(1);
		};
		
		amount = 0;
	}
	
	
	if(drawrect == true)
	{
		attack();
	}
	
	
	socket.emit("update", {id: localHouse.id, amount: localHouse.getAmount()});	
	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	//localPlayer.update(keys);
		
		
		if(localPlayer.update(keys,canvas.width,canvas.height)){
			socket.emit("move player", {id: localPlayer.id, x: localPlayer.getX(), y: localPlayer.getY()});
			
		}
		
		
};

function attack()
{
		
		if(localAttackers.update(mousePos.x, mousePos.y))
			{
				socket.emit("move attacker", {id: localAttackers.id, x: localAttackers.getX(), y: localAttackers.getY()});	
			}
			
		if((localAttackers.getX() ==  mousePos.x && localAttackers.getY() == mousePos.y) || localAttackers.getX() >= canvas.width || localAttackers.getX() <= 0 || localAttackers.getY() >= canvas.height || localAttackers.getY() <= 0)
		{
			var enemyHouse = houseByMousePos(mousePos.x, mousePos.y);
			
			var emptyHousee = emptyhouseByMousePos(mousePos.x, mousePos.y);
			
			//var moveAttacker = attackerById(localAttackers.id);
			if(emptyHouseSelected)
			{
				var remainingAmount = emptyHousee.getAmount() - localAttackers.getAmount();
			
				console.log("amountenemy"+ localAttackers.getAmount());
				//socket.emit("amount localhouse", {id: emptyHousee.id ,amount: remainingAmount});
				if(remainingAmount < 0)
				{
					localHouses.push(emptyHousee);
					//socket.emit("takeover", {name: "emptyhouse1", amount: emptyHousee.getAmount()});
					emptyhouses.splice(emptyhouses.indexOf(emptyHousee), 1);
					
				}
				emptyHousee.setAmount(remainingAmount);
				drawrect = false;
				socket.emit("remove attacker", {});
				localAttackers = new Attacker();
				
				remoteAttackers.splice(remoteAttackers.indexOf(localAttackers), 1);
				
				attackInProgress = false;
				
			}
			else
			{
				var remainingAmount = enemyHouse.getAmount() - localAttackers.getAmount();
			
				console.log("amountenemy"+ localAttackers.getAmount());
				socket.emit("amount localhouse", {id: enemyHouse.id ,amount: remainingAmount});
	
				drawrect = false;
				socket.emit("remove attacker", {});
				localAttackers = new Attacker();
				
				remoteAttackers.splice(remoteAttackers.indexOf(localAttackers), 1);
				
				attackInProgress = false;

			}
		}
	
}
/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// Draw the local player
	localPlayer.draw(ctx, character);
	//attacker.draw(ctx, character);
	
	localHouse.draw(ctx, houseImg ,selected);
	
	
	localAttackers.draw(ctx,character);
	
	var i;
	for(i = 0; i < remotePlayers.length; i++)
	{
		remotePlayers[i].draw(ctx,character);
		//remoteHouses[i].draw(ctx, houseImg,amount,goToPlace);
	};
	
	for(i = 0; i < remoteHouses.length; i++)
	{
		remoteHouses[i].draw(ctx, houseImg,false);
	};
	for(i = 0; i < emptyhouses.length; i++)
	{
		emptyhouses[i].draw(ctx, emptyhouseImg,false);
	};
	
	var a;
	for(a = 0; a < remoteAttackers.length; a++)
	{
		remoteAttackers[a].draw(ctx, character);
	};
	for(i = 0; i < localHouses.length; i++)
	{
		localHouses[i].draw(ctx, houseImg,false);
	};
	
	for(i = 0; i < enemyHouses.length; i++)
	{
		enemyHouses[i].draw(ctx, houseImg,false);
	};
	
	
	
	
};

function playerById(id){
	var i;
	for(i = 0; i < remotePlayers.length; i++)
	{
		if(remotePlayers[i].id == id)
		{
			return remotePlayers[i];
		};
		
	};
		return false;
	
};

function houseById(id){
	var i;
	for(i = 0; i < remoteHouses.length; i++)
	{
		if(remoteHouses[i].id == id)
		{
			return remoteHouses[i];
		};
		
	};
		return false;
	
};

function emptyhouseByName(name){
	var i;
	for(i = 0; i < emptyhouses.length; i++)
	{
		if(emptyhouses[i] == name)
		{
			return emptyhouses[i];
		};
		
	};
		return false;
	
};


function houseByMousePos(mouseX,mouseY){
	var i;
	for(i = 0; i < remoteHouses.length; i++)
	{
		var x = remoteHouses[i].getX();
		var y = remoteHouses[i].getY();
		
		if(mouseX.between(x,(x+98)) && mouseY.between(y,(y+73)))
		{
			return remoteHouses[i];	
		}
	}
	return false;	
	
};

function emptyhouseByMousePos(mouseX,mouseY){
	var i;
	for(i = 0; i < emptyhouses.length; i++)
	{
		var x = emptyhouses[i].getX();
		var y = emptyhouses[i].getY();
		
		if(mouseX.between(x,(x+98)) && mouseY.between(y,(y+73)))
		{
			return emptyhouses[i];	
		}
	}
	return false;	
	
};



function attackerById(id) {
	var i;
	for (i = 0; i < remoteAttackers.length; i++) {
		if (remoteAttackers[i].id == id)
			return remoteAttackers[i];
	};
	
	return false;
};



	var canvass = $('#gameCanvas');
	
	// calculate position of the canvas DOM element on the page
	
	var canvasPosition = {
	    x: canvass.offset().left,
	    y: canvass.offset().top
	};
	
	canvass.on('click', function(e) {
	
	
	
	if(attackInProgress == false)
	{
	
	    var mouse = {
	        x: e.pageX - canvasPosition.x,
	        y: e.pageY - canvasPosition.y
	    }
	     mousePos = mouse;
	    
	    if((mousePos.x >= localHouse.getX() && mousePos.x <= (localHouse.getX() + 98)) && (mousePos.y >= localHouse.getY() && mousePos.y <= (localHouse.getY() + 76)))
	    {
	    	if(selected == false)
	    	{
		    	selectedHouse.push(localHouse);
	    	}
	    	selected = true;
	    	//socket.emit("house click", {});

	    }
	    else
	    {
	    	$("#posX").text(localHouse.getX().toString());
	    	$("#posY").text(localHouse.getY().toString());
	    	
	    	var enemyHouse = houseByMousePos(mousePos.x, mousePos.y);
	    	var emptyHousee = emptyhouseByMousePos(mousePos.x, mousePos.y);
	    	
	    	if(selected == true){
	    		if(enemyHouse || emptyHousee){
	    			
	    			if(enemyHouse)
	    			{
		    			emptyHouseSelected = false;
	    			}
	    			if(emptyHousee)
	    			{
		    			emptyHouseSelected = true;
	    			}
	    				
		    		selectedHouse.splice(localHouse, 1);
		    		//socket.emit("new attacker", {x: localHouse.getX(), y: localHouse.getY()});
		    		var attackersAmount = localHouse.getAmount();
		    		
		    		numberOfAttackers = attackersAmount / 2;
		    		
		    		if(isOdd(localHouse.getAmount()))
		    		{
		    			numberOfAttackers = numberOfAttackers - .5;
		    		}
		    		
		    		localHouse.setAmount((localHouse.getAmount() - numberOfAttackers));
		    		
		    		localAttackers = new Attacker(localHouse.getX(), localHouse.getY());
		    		localAttackers.setAmount(numberOfAttackers);
		    		selected = false;
		    		attackInProgress = true;
		    		drawrect = true;
		    		
		    		attackEnemy();	
	    		}
	    	}
	    	selected = false;
	    	
	    }
	    
	    
	   } 
	});	    
	    

function isOdd(num) { return num % 2;}	    
	    	
Number.prototype.between = function(first,last){
    return (first < last ? this >= first && this <= last : this >= last && this <= first);
}

