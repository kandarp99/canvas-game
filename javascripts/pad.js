var pad = {
	setSize: function(box) {
		this.padCenter = (box.width * .1) / 2;
	},
	
	drawPad: function(box) {
		this.padPosition = getPadPosition(box.controllerPosition, box);

		box.context.beginPath();
		box.context.moveTo(this.padPosition - this.padCenter, 0);
		box.context.lineTo(this.padPosition + this.padCenter, 0);
		box.context.strokeStyle = 'black';
		box.context.lineWidth = 5;
		box.context.stroke();
	}
}

var getPad = function() {
	return pad;
}