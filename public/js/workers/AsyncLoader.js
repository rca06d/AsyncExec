// Deprecated for AsyncExec

var router = this;

function loadScript (src) {

	var methods = [];

	importScripts(src);

	for (var func in this) {
		if (privateMembers.indexOf(func) ==-1) methods.push(func);
	}

	return methods;

}

// --------------------- Init ---------------------- //

// List all members of the router before we load any scripts so we don't include them in the public methods

var privateMembers = [];

for (var func in this) {
	privateMembers.push(func);
}

addEventListener('message', function (e) {

	var command = e.data.command;
	var args = e.data.args;
	var response;

	try {
		response = router[command].apply(router, args);
	} catch (error) {

		return postMessage({processId: e.data.processId, error: {
			filename: error.filename,
			lineno: error.lineno,
			message: error.message
		}});

	}

	postMessage({processId: e.data.processId, response: response});
	
});