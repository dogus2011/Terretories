var Attacker = function(startX, startY){
	var x = startX,
		y = startY,
		soldiersAmount = 0,
		id;
		
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
		
		var setAmount = function(amount){
			soldiersAmount = amount;
		}
		
		var getAmount = function(){
			return soldiersAmount;
		}

		
		return{
			getX: getX,
			getY: getY,
			setX: setX,
			setY: setY,
			setAmount: setAmount,
			getAmount: getAmount,
			id: id
		}
};

exports.Attacker = Attacker;