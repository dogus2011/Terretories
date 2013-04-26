/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Attacker = function(startX, startY) {
	var x = startX,
		y = startY,
		id,
		canvasWidth,
		canvasHeight,
		soldiersAmount = 0,
		moveAmount = 1;
		
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
	
	var setAmount = function(amount){
		soldiersAmount = amount;
	}
	
	var getAmount = function(){
		return soldiersAmount;
	}

	var update = function(posX,posY) {
		
		var prevX = x;
		var prevY = y;
		
		var difference = moveSpeed - 1;
		var finalPosX = prevX - posX;
		var finalPosY = prevY - posY;
		
		if(prevX != posX)
		{
			if(prevX < posX)
			{
				x += moveSpeed;
			}
			else
			{
				x -= moveSpeed;
			}
		}
		if(prevY != posY)
		{
			if(prevY < posY)
			{
				y += moveSpeed;
			}
			else
			{
				y -= moveSpeed;
			}
		}
		
		
		if(finalPosX.between(0,difference))
		{
			x = posX;
		}
		if(finalPosY.between(0,difference))
		{
			y = posY;
		}
		/*if( (prevX - mousePos.x) <= difference || (prevX - mousePos.x) >= -difference)
		{
			prevX = mousePos.x;
		}
		else if( (prevY - mousePos.y) <= difference || (prevY - mousePos.y) <= -difference)
		{
			prevY = mousePos.y;
		}*/
		
		
		return (prevX != x || prevY != y) ? true : false;
	};

	var draw = function(ctx,image) {
		//ctx.fillRect(x-5, y-5, 10, 10);
		ctx.drawImage(image, x-10,y-25);
		ctx.fillStyle = "red";
		ctx.font = "14pt Calibri";
        ctx.fillText(soldiersAmount.toString(), x-5, y - 20);
        
		
	};

	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		update: update,
		setAmount: setAmount,
		getAmount: getAmount,
		go: go,
		draw: draw
	}
};