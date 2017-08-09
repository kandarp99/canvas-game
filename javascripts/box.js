var boxContext;

var box = {
	initializeBoxProperties: function(canvas, refresh) {
		boxContext = this;

		this.gameStarted = false;
		this.timer = 0;
		this.millisecondWatch = 0;
		this.canvas = canvas;
		this.height = canvas.height;
		this.width = canvas.width;
		this.offset = 3;
		this.refresh = refresh;
		this.context = canvas.getContext('2d');
		this.balls = [];
		this.pad = getPad();
		this.controllerPosition = undefined;

		this.balls.push(new Ball(this, "green"));
		this.balls.push(new Ball(this, "red"));
		this.balls.push(new Ball(this, "blue"));

		verifyBallsNotOverlapping(this);
		this.showStartScreen();
	},

	drawBorder: function() {
		this.context.beginPath();
		this.context.moveTo(0, 0);
		this.context.lineTo(0, this.height);
		this.context.lineTo(this.width, this.height);
		this.context.lineTo(this.width, 0);
		this.context.strokeStyle = 'blue';
		this.context.lineWidth = 5;
		this.context.stroke();
	},

	drawTimer: function() {
		this.context.beginPath();
		this.context.fillStyle = 'black';
		this.context.font = "24px Arial";
		this.context.fillText(this.timer, this.width - 40, this.height - 20);
	},

	showStartScreen: function() {
		this.drawBorder();

		this.context.beginPath();
		this.context.textAlign = 'center';
		this.context.fillStyle = 'black';
		this.context.font = "42px Arial";
		this.context.fillText("Click to begin.", this.width / 2, this.height / 2);
	},

	showGameOverScreen: function() {
		this.context.beginPath();
		this.context.textAlign = 'center';
		this.context.fillStyle = 'red';
		this.context.font = "42px Arial";
		this.context.fillText("Game Over!", this.width / 2, this.height / 2);
	},

	startGame: function() {
		if(!boxContext.gameStarted) {
			boxContext.gameStarted = true;
			boxContext.animate();

			boxContext.pad.setSize(boxContext);
		}
	},

	animate: function() {
		if(!isGameOver(boxContext)) {

			boxContext.drawContents();

			updateTimer(boxContext);

			setTimeout(boxContext.animate, this.refresh);
		}
		else boxContext.showGameOverScreen();
	},

	drawContents: function() {
		this.context.clearRect(0, 0, box.width, box.height);

		this.drawBorder();

		this.pad.drawPad(this);

		updateBalls(this);
		checkBallBallCollision(this);
	},

	mouseMove: function(mouseEvent) {
		boxContext.controllerPosition = mouseEvent.clientX - boxContext.canvas.offsetLeft;
	},
	
	touchMove: function(touchEvent) {
		var touch = touchEvent.changedTouches;
		for(var i = 0; i < touch.length; i++) {
			boxContext.controllerPosition = touch[i].pageX - boxContext.canvas.offsetLeft;
		}
	}
}
