var House = function(startX, startY){
	var x = startX,
		y = startY,
		id,
		soldiersAmount = 0;
		
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
		
		var getAmount = function(){
			return soldiersAmount;	
		};
	
		var setAmount = function(amountt){
			soldiersAmount = amountt; 
		};
		
		return{
			getX: getX,
			getY: getY,
			setX: setX,
			setY: setY,
			getAmount: getAmount,
			setAmount: setAmount,
			id: id
		}
};

exports.House = House;