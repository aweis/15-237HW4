var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var intervalId;
var timerDelay = 100;

function update() {
	ctx.fillStyle = "#ECD9BE";
	ctx.fillRect(0, 0, 150, 70);
	
	ctx.textAlign = "center";
	ctx.fillStyle = "#000000";

	ctx.font = "15px Arial";
	ctx.fillText("Tasks remaining:", 75, 15);
	
	ctx.font = "50px Arial";
	ctx.fillText(tasksLeft, 75, 60);
}

intervalId = setInterval(update, timerDelay);

