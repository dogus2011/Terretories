/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		id,
		canvasWidth,
		canvasHeight,
		moveAmount = 12;
		
	var getX = function(){
		return x;
	};
	
	var getY = function(){
		return y;
	};
	
	var setX = function(newX){
		x = newX;
	};
	
	var setY = function(newY){
		y = newY;
	};
	
	var go = function(posX, posY)
	{
		var prevX = x,
			prevY = y;
			
		y = posY;
		x = posX;
		
		//return (prevX != x || prevY != y) ? true : false;
	}

	var update = function(keys,posX,posY) {
		
		var prevX = x,
			prevY = y;
		canvasWidth = posX;
		canvasHeight = posY;
		
		// Up key takes priority over down
		if (keys.up) {
			if(localPlayer.getY() >= 0)
			{
				y -= moveAmount;
			}
			else{y = 5}
		} else if (keys.down) {
			if(localPlayer.getY() <= canvasHeight)
			{
				y += moveAmount;
			}
			else{y = (canvasHeight - 5)}
		};

		// Left key takes priority over right
		if (keys.left) {
			if(localPlayer.getX() >= 0)
			{
				x -= moveAmount;
			}
			else{x = 5}
		} else if (keys.right) {
			if(localPlayer.getX() <= canvasWidth)
			{
				x += moveAmount;
			}
			else{x = (canvasWidth - 5)}
		};
		
		return (prevX != x || prevY != y) ? true : false;
	};

	var draw = function(ctx,image) {
		//ctx.fillRect(x-5, y-5, 10, 10);
		ctx.drawImage(image, x-10,y-25);
		
	};

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		update: update,
		go: go,
		draw: draw
	}
};