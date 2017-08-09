var Ball = function(box, color) {
	var getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	this.padHits = 0;
	this.diameter = box.width / 10;
	this.color = color;

	var maxSpeed = this.diameter / 10;
	var radiusAndOffset = (this.diameter / 2) + box.offset;

	this.x = getRandomInt(radiusAndOffset, box.width - radiusAndOffset);
	this.y = getRandomInt(radiusAndOffset, box.height - radiusAndOffset);

	this.xSpeed = Math.random(0, maxSpeed) * maxSpeed;
	this.ySpeed = Math.pow((Math.pow(maxSpeed, 2) - Math.pow(this.xSpeed, 2)), 0.5);
	this.xSpeed = this.xSpeed * box.refresh / 100;
	this.ySpeed = this.ySpeed * box.refresh / 100; 
}

Ball.prototype.drawBall = function(context) {
	context.beginPath();
	context.lineWidth = 3;
	context.strokeStyle = this.color;
	context.fillStyle = this.color;
	context.arc(this.x, this.y, this.diameter / 2, 0, 2 * Math.PI, false);
	context.fill();
	context.stroke();
}

Ball.prototype.updateBallPosition = function() {
	this.x += this.xSpeed;
	this.y += this.ySpeed;
}

Ball.prototype.adjustForBallPadCollision = function() {
	
	this.padHits = this.padHits + 1;

	this.xSpeed = this.xSpeed * 1.5;
	this.ySpeed = this.ySpeed * 1.5;

	if(this.padHits >= 10) {
		this.padHits = 0;
		this.diameter = 3 * this.diameter / 4;
	}
}

Ball.prototype.updateBallSpeed = function(hitSide) {
	
	if(hitSide == 'noHit')
		return -1;
	if(hitSide == 'right' || hitSide == 'left')
		this.xSpeed = this.xSpeed * -1;
	else if(hitSide == 'bottom')
		this.ySpeed = this.ySpeed * -1;
	else if(hitSide == 'padHit') {
		this.adjustForBallPadCollision();
		this.ySpeed = this.ySpeed * -1;
	}
	else {
		this.y = -999;
		this.xSpeed = 0;
		this.ySpeed = 0;
	}
}	

Ball.prototype.getNewBall = function(box) {
	return new Ball(box, this.color);
}


exports.Ball = Ball;