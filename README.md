AsyncExec
=========

A way to use js promises with web workers to run any function asynchronously

Usage:

```
function doWork () {
	var result = 0;

	for (var i = 0, l = 1000000000; i < l; i++) {
		result += i / 2 + 4 / 8;
	}

	return result;
}

AsyncExec(doWork)
.then(function (response) {
	console.log(response);
}, function (error) {
	console.error(error);
});
```
