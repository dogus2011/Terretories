var House = function(startX, startY) {
	var x = startX,
		y = startY,
		id,
		canvasWidth,
		canvasHeight,
		soldiersAmount = 0;
		
	var getX = function(){
		return x;
	};
	
	var getY = function(){
		return y;
	};
	
	var getAmount = function(){
		return soldiersAmount;	
	};
	
	var setAmount = function(amountt){
		soldiersAmount = amountt; 
	};

var update = function(number){

	soldiersAmount = soldiersAmount + number;
	
}

var draw = function(ctx,image,selected) {
		//ctx.fillRect(x-15, y-15, 30, 30);
		//this.amount = amount;
		if(selected == true)
		{
			ctx.lineWidth = 3;
			ctx.strokeStyle = 'black';
			ctx.strokeRect(x, y, 98, 73);
		}
		else
		{
			ctx.lineWidth = 0;
			ctx.strokeStyle = 'black';
			//ctx.strokeRect(30, 30, 98, 73);
		}
		
		ctx.drawImage(image, x, y);
		ctx.fillStyle = "white";
		ctx.font = "10pt Calibri";
        ctx.fillText(soldiersAmount, x + 30, y + 25);
	};
	
	return {
		getX: getX,
		getY: getY,
		getAmount: getAmount,
		setAmount: setAmount,
		update: update,
		draw: draw
	}
	
};