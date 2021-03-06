function doWork (str) {
	var result = 0;

	for (var i = 0, l = 1000000000; i < l; i++) {
		result += i / 2 + 4 / 8;
	}

	return result + str;
}

var timer = document.getElementById("timer");

setInterval(function () {
	timer.innerHTML = (new Date()).getTime();
}, 30);

//console.log(doWork());

AsyncExec(doWork, "peep")
.then(function (response) {
	console.log(response);
}, function (error) {
	console.error(error);
});