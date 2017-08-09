var functions = require('../javascripts/ball.js');

exports.ballSpeedConstantWhenNoBoundaryHit = function(test) {
	var box = {
		height: 300,
		width: 400,
		offset: 3,
		refresh: 10,
		balls: [],
	}

	var ball = new functions.Ball(box, "blue");

	var hitSide = "noHit";
	test.equal(-1, ball.updateBallSpeed(hitSide));
	test.done();	
}


exports.ballXSpeedChangesSign = function(test) {
	var box = {
		height: 300,
		width: 400,
		offset: 3,
		refresh: 10,
		balls: [],
	}

	var ball = new functions.Ball(box, "blue");
	var originalXSpeed = ball.xSpeed;

	var hitSide = "right";
	ball.updateBallSpeed(hitSide);
	test.equal(originalXSpeed * -1, ball.xSpeed);
	
	var hitSide = "left";
	ball.xSpeed = originalXSpeed;
	ball.updateBallSpeed(hitSide);
	test.equal(originalXSpeed * -1, ball.xSpeed);
	test.done();	
}

exports.ballYSpeedChangesSign = function(test) {
	var box = {
		height: 300,
		width: 400,
		offset: 3,
		refresh: 10,
		balls: [],
	}

	var ball = new functions.Ball(box, "blue");
	var originalYSpeed = ball.ySpeed;

	var hitSide = "bottom";
	ball.updateBallSpeed(hitSide)
	test.equal(originalYSpeed * -1, ball.ySpeed);
	
	var hitSide = "padHit";
	ball.ySpeed = originalYSpeed;
	ball.updateBallSpeed(hitSide);
	test.equal(originalYSpeed * -1.5, ball.ySpeed);
	
	var hitSide = "outOfBounds";
	ball.ySpeed = originalYSpeed;
	ball.updateBallSpeed(hitSide);
	test.equal(0, ball.ySpeed);
	test.equal(0, ball.xSpeed);
	test.equal(-999, ball.y);
	test.done();	
}

exports.checkBallPositionUpdates = function(test) {
	var box = {
		height: 300,
		width: 400,
		offset: 3,
		refresh: 10,
		balls: [],
	}

	var ball = new functions.Ball(box, "blue");
	var originalY = ball.y;
	var originalX = ball.x;

	ball.updateBallPosition()

	test.equal(originalX + ball.xSpeed, ball.x);
	test.equal(originalY + ball.ySpeed, ball.y);
	test.done();
}

exports.testUpdateBallSpeedCallsAdjustForBallPadCollision = function(test) {
	var box = {
		height: 300,
		width: 400,
		offset: 3,
		refresh: 10,
		balls: [],
	}

	var ball = new functions.Ball(box, "blue");
	ball.xSpeed = 1;
	ball.ySpeed = 1;
	ball.padHits = 9;
	ball.diameter = 16;

	ball.updateBallSpeed('padHit');

	test.equal(0, ball.padHits);
	test.equal(12, ball.diameter);
	test.equal(1.5, ball.xSpeed);
	test.equal(-1.5, ball.ySpeed);
	test.done();
}

exports.testAdjustForBallPadCollisionIncrementsPadHits = function(test) {
	var box = {
		height: 300,
		width: 400,
		offset: 3,
		refresh: 10,
		balls: [],
	}

	var ball = new functions.Ball(box, "blue");
	ball.xSpeed = 0;
	ball.ySpeed = 0;
	ball.padHits = 0;
	ball.diameter = 0;

	ball.adjustForBallPadCollision();
	
	test.equal(1, ball.padHits);
	test.done();
}

exports.testAdjustForBallPadCollisionDoublesSpeed = function(test) {
	var box = {
		height: 300,
		width: 400,
		offset: 3,
		refresh: 10,
		balls: [],
	}

	var ball = new functions.Ball(box, "blue");
	ball.xSpeed = 1;
	ball.ySpeed = 1;
	ball.padHits = 0;
	ball.diameter = 0;

	ball.adjustForBallPadCollision();

	test.equal(1.5, ball.xSpeed);
	test.equal(1.5, ball.ySpeed);
	test.done();
}

exports.testAdjustForBallPadCollisionReducesDiameterAfterTenPadHits = function(test) {
	var box = {
		height: 300,
		width: 400,
		offset: 3,
		refresh: 10,
		balls: [],
	}

	var ball = new functions.Ball(box, "blue");
	ball.xSpeed = 1;
	ball.ySpeed = 1;
	ball.padHits = 10;
	ball.diameter = 16;

	ball.adjustForBallPadCollision();

	test.equal(12, ball.diameter);
	test.done();
}

exports.testAdjustForBallPadCollisionResetsPadHitsAfterTenPadHits = function(test) {
	var box = {
		height: 300,
		width: 400,
		offset: 3,
		refresh: 10,
		balls: [],
	}

	var ball = new functions.Ball(box, "blue");
	ball.xSpeed = 1;
	ball.ySpeed = 1;
	ball.padHits = 10;
	ball.diameter = 16;

	ball.adjustForBallPadCollision();

	test.equal(0, ball.padHits);
	test.done();
}

exports.testGetNewBallReturnsNewBallWithSameColor = function(test) {
	var box = {
		height: 300,
		width: 400,
		offset: 3,
		refresh: 10,
		balls: [],
	}

	var ball = new functions.Ball(box, "blue");
	var oldBall = ball;
	ball = ball.getNewBall(box);

	test.notEqual(ball.xSpeed, oldBall.xSpeed);
	test.equal(ball.color, oldBall.color);
	test.done();
}

exports.testBallHasADrawBallFunction = function(test) {
		var strokeCalled = false;

		var box = {
		height: 300,
		width: 400,
		offset: 3,
		refresh: 10,
		balls: [],
		context: {
			beginPath: function() { },
			lineWidth: 0,
			strokeStyle: undefined,
			filleStyle: undefined,
			arc: function() { },
			fill: function() { },
			stroke: function() { strokeCalled = true; }
		}
	}

	var ball = new functions.Ball(box, "blue");
	ball.drawBall(box.context);

	test.notEqual(undefined, ball.drawBall);
	test.ok(strokeCalled);
	test.done();

}
