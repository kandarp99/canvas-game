var getPadPosition = function(controllerPosition, box) {
	if(controllerPosition == undefined)
		return box.width / 2;
	if(controllerPosition - box.pad.padCenter - box.offset < 0)
		return box.pad.padCenter + box.offset;
	else if(controllerPosition + box.pad.padCenter + box.offset > box.width)
		return box.width - box.pad.padCenter - box.offset;
	else
		return controllerPosition;
}

var checkBoundaryHit = function (ball, box) {
	var ballRadius = ball.diameter / 2 + box.offset;

	if(ball.x + ball.xSpeed >= box.width - ballRadius)
		return 'right';
	if(ball.x + ball.xSpeed <= ballRadius)
		return 'left';
	if(ball.y + ball.ySpeed >= box.height - ballRadius)
		return 'bottom';
	if(ball.y + ball.ySpeed <= ballRadius) {
		if(ball.x + ballRadius >= box.pad.padPosition - box.pad.padCenter && ball.x - ballRadius <= box.pad.padPosition + box.pad.padCenter)
			return 'padHit';
		else return 'outOfBounds';
	}
	else return 'noHit';
}

var updateBalls = function(box) {
	for(var i = 0; i < box.balls.length; i++) {
		var hitSide = checkBoundaryHit(box.balls[i], box);

		box.balls[i].updateBallSpeed(hitSide);

		box.balls[i].updateBallPosition();

		box.balls[i].drawBall(box.context);

		if(box.balls[i].y === -999)
			box.balls.splice(i, 1);
	}
}

var isGameOver = function(box) {
	if(box.balls.length > 0 && box.gameStarted == true)
		return false;
	return true;
}

var updateTimer = function(box) {
	box.millisecondWatch = box.millisecondWatch + 10;

	if(!isGameOver(box)) {
		if(box.millisecondWatch === 1000) {
			box.millisecondWatch = 0;
			box.timer = box.timer + 1;
		}
	}

	box.drawTimer();
}

var computeBallDistance = function(ballOne, ballTwo, box) {
		var xSquared = Math.pow(ballOne.x - ballTwo.x, 2);
		var ySquared = Math.pow(ballOne.y - ballTwo.y, 2);
		var distance = Math.pow(xSquared + ySquared, 0.5);
		if(distance < ballOne.diameter / 2 + ballTwo.diameter / 2 + box.offset)
			return true;
		return false;
}

var computeValuesPostCollision = function(ballOne, ballTwo) {
		var xVelOne = (ballOne.xSpeed * (ballOne.diameter - ballTwo.diameter)
			+ (2 * ballTwo.diameter * ballTwo.xSpeed)) / (ballOne.diameter + ballTwo.diameter);
		
		var yVelOne = (ballOne.ySpeed * (ballOne.diameter - ballTwo.diameter) 
			+ (2 * ballTwo.diameter * ballTwo.ySpeed)) / (ballOne.diameter + ballTwo.diameter);
		
		var xVelTwo = (ballTwo.xSpeed * (ballTwo.diameter - ballOne.diameter) 
			+ (2 * ballOne.diameter * ballOne.xSpeed)) / (ballOne.diameter + ballTwo.diameter);
		
		var yVelTwo = (ballTwo.ySpeed * (ballTwo.diameter - ballOne.diameter) 
			+ (2 * ballOne.diameter * ballOne.ySpeed)) / (ballOne.diameter + ballTwo.diameter);
		
		var speeds = {
			xSpeedOne: xVelOne,
			ySpeedOne: yVelOne,
			xSpeedTwo: xVelTwo,
			ySpeedTwo: yVelTwo
		};
		
		return speeds;	
}

var updateValuesPostCollision = function(ballOne, ballTwo, speeds) {
		ballOne.xSpeed = speeds.xSpeedOne;
		ballOne.ySpeed = speeds.ySpeedOne;
		ballTwo.xSpeed = speeds.xSpeedTwo;
		ballTwo.ySpeed = speeds.ySpeedTwo;
		ballOne.x += speeds.xSpeedOne;
		ballOne.y += speeds.ySpeedOne;
		ballTwo.x += speeds.xSpeedTwo;
		ballTwo.y += speeds.ySpeedTwo;
}

var checkBallBallCollision = function(box) {
	for(var i = 0; i < box.balls.length; i++) {
		var j = i + 1;
		for(j; j < box.balls.length; j++) {
			if(computeBallDistance(box.balls[i], box.balls[j], box)) {
				var newSpeeds = computeValuesPostCollision(box.balls[i], box.balls[j]);
				updateValuesPostCollision(box.balls[i], box.balls[j], newSpeeds);
			}
		}
	}
}

var verifyBallsNotOverlapping = function(box) {
	var isNewBallCreated = false;
	for(var i = 0; i < box.balls.length; i++) {
		var j = i + 1;
		for(j; j < box.balls.length; j++) {
			if(Math.abs(box.balls[i].x  - box.balls[j].x) <= box.balls[i].diameter + box.offset
				&& Math.abs(box.balls[i].y - box.balls[j].y) <= box.balls[j].diameter + box.offset) {
				var newBall = box.balls[i].getNewBall(box);
				box.balls[i] = newBall;
				isNewBallCreated = true;
			}
		}
	}

	if(isNewBallCreated)
		verifyBallsNotOverlapping(box);
}


exports.isGameOver = isGameOver;
exports.updateTimer = updateTimer;
exports.updateBalls = updateBalls;
exports.getPadPosition = getPadPosition;
exports.checkBoundaryHit = checkBoundaryHit;
exports.computeBallDistance = computeBallDistance;
exports.computeValuesPostCollision = computeValuesPostCollision;
exports.updateValuesPostCollision = updateValuesPostCollision;
exports.checkBallBallCollision = checkBallBallCollision;
exports.verifyBallsNotOverlapping = verifyBallsNotOverlapping;