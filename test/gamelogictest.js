var logic = require('../javascripts/gamelogic.js');

exports.testCanary = function(test) {
	test.ok(true);
	test.done();
}

exports.testPadWillNotPrintBeyondBoardWidthOnLeftSide = function(test) {
	var controllerPosition = 0;

	var box = {
		offset: 1,
		width: 15,
		pad: { padCenter: 4 },
		canvas: { offsetLeft: 3 }
	}

	test.equals(5, logic.getPadPosition(controllerPosition, box));
	test.done();
}

exports.testPadWillNotPrintBeyondBoardWidthOnRightSide = function(test) {
	var controllerPosition = 50;

	var box = {
		offset: 1,
		width: 15,
		pad: { padCenter: 4 },
		canvas: { offsetLeft: 3 }
	}

	test.equals(10, logic.getPadPosition(controllerPosition, box));
	test.done();
}

exports.testPadWillPrintAtActualPositionIfWithinTheBoundries = function(test) {
	var controllerPosition = 25;

	var box = {
		offset: 1,
		width: 100,
		pad: { padCenter: 3 },
		canvas: { offsetLeft: 0 }
	}

	test.equals(25, logic.getPadPosition(controllerPosition, box));
	test.done();
}

exports.testPadWillPrintAtCenterIfMousePositionIsUndefined = function(test) {
	var controllerPosition = undefined;

	var box = {
		offset: 1,
		width: 100,
		pad: { padCenter: 3 },
		canvas: { offsetLeft: 0 }
	}

	test.equals(50, logic.getPadPosition(controllerPosition, box));
	test.done();
}

exports.testIsGameOverReturnsFalseForCorrectConditions = function(test) {
	var box = {
		balls: ['testData'],
		gameStarted: true
	}

	test.equals(false, logic.isGameOver(box));
	test.done();
}

exports.testIsGameOverReturnsTrueForCorrectConditions = function(test) {
	var box = {
		balls: ['testData'],
		gameStarted: false
	}

	test.ok(logic.isGameOver(box));
	test.done();
}

exports.testUpdateTimerCallsDrawTimer = function(test) {
	var functionCalled = false;

	var box = {
		balls: ['testData'],
		gameStarted: false,
		millisecondWatch: 0,
		timer: 0,
		drawTimer: function() { functionCalled = true }
	}

	logic.updateTimer(box);

	test.ok(functionCalled);
	test.done();
}

exports.testUpdateTimerIncrementsCorrectly = function(test) {
	var box = {
		balls: ['testData'],
		gameStarted: true,
		millisecondWatch: 990,
		timer: 0,
		drawTimer: function() { }
	}

	logic.updateTimer(box);

	test.ok(box.millisecondWatch === 0);
	test.ok(box.timer === 1);
	
	test.done();
}

exports.testUpdateTimerDoesNotIncrementBoxTimerWhenMilliSecondsNot1000 = function(test) {
	var box = {
		balls: ['testData'],
		gameStarted: true,
		millisecondWatch: 900,
		timer: 0,
		drawTimer: function() { }
	}

	logic.updateTimer(box);

	test.ok(box.timer === 0);
	
	test.done();
}

exports.testUpdateBallsCallsAppropriateFunctions = function(test) {
	var updateBallSpeedCalled = false;
	var updateBallPositionCalled = false;
	var drawBallCalled = false;

	var ball = {
		x: 30,
		y: 0,
		xSpeed: 30,
		diameter: 0,
		updateBallSpeed: function(hitSide) { updateBallSpeedCalled = true; },
		updateBallPosition: function() { updateBallPositionCalled = true; },
		drawBall: function(context) { drawBallCalled = true; }
	}

	var box = {
		width: 20,
		offset: 0,
		context: 0,
		balls: [ball]
	}

	logic.updateBalls(box);

	test.ok(updateBallSpeedCalled);
	test.ok(updateBallPositionCalled);
	test.ok(drawBallCalled);
	test.done();
}

exports.testUpdateBallsCallsAppropriateFunctionsCorrectAmountOfTimes = function(test) {
	var updateBallSpeedCalled = 0;
	var updateBallPositionCalled = 0;
	var drawBallCalled = 0;

	var ball = {
		x: 30,
		y: 0,
		xSpeed: 30,
		diameter: 0,
		updateBallSpeed: function(hitSide) { updateBallSpeedCalled++; },
		updateBallPosition: function() { updateBallPositionCalled++; },
		drawBall: function(context) { drawBallCalled++; }
	}

	var box = {
		width: 20,
		offset: 0,
		context: 0,
		balls: [ball, ball]
	}

	logic.updateBalls(box);
	
	test.ok(updateBallSpeedCalled === 2);
	test.ok(updateBallPositionCalled === 2);
	test.ok(drawBallCalled === 2);
	test.done();
}

exports.testUpdateBallsRemovesBallUnderCorrectCondition = function(test) {
	var ballOne = {
		x: 30,
		y: 0,
		xSpeed: 30,
		diameter: 0,
		updateBallSpeed: function(hitSide) { },
		updateBallPosition: function() { },
		drawBall: function(context) { }
	}

	var ballTwo = {
		x: 30,
		y: -999,
		xSpeed: 30,
		diameter: 0,
		updateBallSpeed: function(hitSide) { },
		updateBallPosition: function() { },
		drawBall: function(context) { }
	}

	var box = {
		width: 20,
		offset: 0,
		context: 0,
		balls: [ballOne, ballTwo]
	}

	logic.updateBalls(box);
	
	test.ok(box.balls.length === 1);
	test.done();
}

exports.checkRightBoundaryHit = function(test) {
	var ball = {
		x: 370,
		xSpeed: 30,
		diameter: 40
	};

	var pad = {
		padPosition: 200,
		padCenter: 20
	};	
	
	var box = {
		width: 400,
		offset: 3,
		height: 300,
		refresh: 10
	};
	
	box.pad = pad;
	
	test.equal("right", logic.checkBoundaryHit(ball, box)); 
	test.done();
}

exports.checkLeftBoundaryHit = function(test) {
	var ball = {
		x: 30,
		xSpeed: -10,
		diameter: 40
	};

	var pad = {
		padPosition: 200,
		padCenter: 20
	};
	
	var box = {
		width: 400,
		offset: 3,
		height: 300,
		refresh: 10
	};
	
	box.pad = pad;	
	test.equal("left", logic.checkBoundaryHit(ball, box)); 
	test.done();
}

exports.checkBottomBoundaryHit = function(test) {
	var ball = {
		x: 300,
		y: 275,
		xSpeed: -10,
		ySpeed: 5,
		diameter: 40
	};

	var pad = {
		padPosition: 200,
		padCenter: 20
	};
		
	var box = {
		width: 400,
		offset: 3,
		height: 300,
		refresh: 10
	};
	
	box.pad = pad;	
	test.equal("bottom", logic.checkBoundaryHit(ball, box)); 
	test.done();
}

exports.checkPadHit = function(test) {
	var ball = {
		x: 300,
		y: 25,
		xSpeed: -10,
		ySpeed: -5,
		diameter: 40
	};

	var pad = {
		padPosition: 280,
		padCenter: 20
	};
	
	var box = {
		width: 400,
		offset: 3,
		height: 300,
		refresh: 10
	};
	
	box.pad = pad;
		
	test.equal("padHit", logic.checkBoundaryHit(ball, box)); 
	test.done();
}

exports.checkPadMiss = function(test) {
	var ball = {
		x: 300,
		y: 25,
		xSpeed: -10,
		ySpeed: -5,
		diameter: 40
	};
	var canvasProperties = {
		height: 300,
		width: 400,
		offset: 3,
		refresh: 10
	};
	var pad = {
		padPosition: 0,
		padCenter: 20
	};
		
	var box = {
		width: 400,
		offset: 3,
		height: 300,
		refresh: 10
	};
	
	box.pad = pad;	
	test.equal("outOfBounds", logic.checkBoundaryHit(ball, box)); 
	test.done();
}

exports.checkNoBoundaryHit = function(test) {
	var ball = {
		x: 300,
		y: 205,
		xSpeed: -10,
		ySpeed: -5,
		diameter: 40
	};
	var canvasWidth = 400, canvasHeight = 300, padPosition = 300;
	var offset = 3;
		
	test.equal("noHit", logic.checkBoundaryHit(ball, canvasWidth, canvasHeight, offset, padPosition)); 
	test.done();
}

exports.testBallBallCollisionDetected = function(test) {
	var ballOne = {
		x: 50,
		y: 50,
		diameter: 40
	};
	
	var ballTwo = {
		x: 70,
		y: 70,
		diameter: 40
	};
	var box = {
		offset: 3
	};
	
	test.equal(true, logic.computeBallDistance(ballOne, ballTwo, box));
	ballOne.x = 250;
	test.equal(false, logic.computeBallDistance(ballOne, ballTwo, box));
	test.done();
}

exports.testPostCollisionSpeedValues = function(test) {
	
	var ballOne = {
		x: 0,
		y: 0,
		xSpeed: 20,
		ySpeed: 2,
		diameter: 40
	};
	
	var ballTwo = {
		x: 0,
		y: 0,
		xSpeed: 10,
		ySpeed: 5,
		diameter: 40
	};
	
	var speeds = logic.computeValuesPostCollision(ballOne, ballTwo);
	test.equal(10, speeds.xSpeedOne);
	test.equal(5, speeds.ySpeedOne);
	test.equal(20, speeds.xSpeedTwo);
	test.equal(2, speeds.ySpeedTwo);
	test.done();
}

exports.testValuesUpdatedPostCollision = function(test) {
	var ballOne = {
		x: 0,
		y: 0,
		xSpeed: 20,
		ySpeed: 2,
		diameter: 40
	};
	
	var ballTwo = {
		x: 0,
		y: 0,
		xSpeed: 10,
		ySpeed: 5,
		diameter: 40
	};
	var speeds = {
		xSpeedOne: 4,
		ySpeedOne: 7,
		xSpeedTwo: 9,
		ySpeedTwo: 13
	};
	logic.updateValuesPostCollision(ballOne, ballTwo, speeds);
	test.equal(4, ballOne.x);
	test.equal(7, ballOne.y);
	test.equal(9, ballTwo.x);
	test.equal(13, ballTwo.y);
	test.equal(speeds.xSpeedOne, ballOne.xSpeed);
	test.equal(speeds.xSpeedTwo, ballTwo.xSpeed);
	test.equal(speeds.ySpeedOne, ballOne.ySpeed);
	test.equal(speeds.ySpeedTwo, ballTwo.ySpeed);
	
	test.done();
}

exports.testLoopThroughBallArray = function(test) {
	var box = {
		balls: [],
		offset: 3
	};
	var ballOne = {
		x: 30,
		y: 20,
		xSpeed: 20,
		ySpeed: 2,
		diameter: 40
	};
	
	var ballTwo = {
		x: 0,
		y: 0,
		xSpeed: 10,
		ySpeed: 5,
		diameter: 40
	};
	
	var ballThree = {
		x: 300,
		y: 200,
		xSpeed: 7,
		ySpeed: 42,
		diameter: 40
	};
	box.balls.push(ballOne);
	box.balls.push(ballTwo);
	box.balls.push(ballThree);
	logic.checkBallBallCollision(box);
	test.notEqual(box.balls[0].x, 30);
	test.notEqual(box.balls[0].y, 20);
	test.notEqual(box.balls[1].x, 0);
	test.notEqual(box.balls[1].y, 0);
	test.equal(box.balls[2].x, 300);
	test.equal(box.balls[2].y, 200);
	box.balls[2].x = 10;
	box.balls[2].y = 10;
	logic.checkBallBallCollision(box);
	test.notEqual(box.balls[2].x, 10);
	test.notEqual(box.balls[2].y, 10);
	test.done();
}

exports.testVerifyBallsNotOverlappingCallsGetNewBallOnOverlap = function(test) {
	var getNewBallCalled = false;

	var ballOne = {
		x: 40,
		y: 40,
		diameter: 40,
		getNewBall: function(box) { 
			getNewBallCalled = true;
			this.diameter = 0;
			return this;
		}
	}

	var ballTwo = {
		x: 30,
		y: 30,
		diameter: 40,
		getNewBall: function(box) { 
			getNewBallCalled = true;
			this.diameter = 0;
			return this;
		}
	}

	var box = {
		width: 200,
		offset: 0,
		context: 0,
		balls: [ballOne, ballTwo]
	}

	logic.verifyBallsNotOverlapping(box);
	
	test.ok(getNewBallCalled);
	test.done();
}

exports.testVerifyBallsNotOverlappingCallsItselfAgainAfterNewBallCreation = function(test) {
	var getNewBallCalled = 0;

	var ballOne = {
		x: 40,
		y: 40,
		diameter: 40,
		getNewBall: function(box) { 
			getNewBallCalled++;
			this.diameter = 0;
			return this;
		}
	}

	var ballTwo = {
		x: 30,
		y: 30,
		diameter: 40,
		getNewBall: function(box) { 
			getNewBallCalled++;
			this.diameter = 0;
			return this;
		}
	}

	var ballThree = {
		x: 20,
		y: 20,
		diameter: 40,
		getNewBall: function(box) { 
			getNewBallCalled++;
			this.diameter = 0;
			return this;
		}
	}

	var box = {
		width: 200,
		offset: 0,
		context: 0,
		balls: [ballOne, ballTwo, ballThree]
	}

	logic.verifyBallsNotOverlapping(box);
	
	test.ok(getNewBallCalled === 2);
	test.done();
}
