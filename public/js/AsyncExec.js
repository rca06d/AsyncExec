function AsyncExec () {

	var fn = arguments[0];
	var args = [];

	for (var i = 1, l = arguments.length; i < l; i++) {
		args.push(arguments[i]);
	}

	// Build a worker from an anonymous function body
	var blobURL = URL.createObjectURL( new Blob([ 
		'addEventListener(\'message\', function (e) {\n',
			'var result = ' + fn.toString() + '.apply(this, e.data);\n',
			'postMessage(result);\n',
		'});'
	], { type: 'application/javascript' }) ),

	worker = new Worker( blobURL );
	worker.postMessage(args);

	// Won't be needing this anymore
	URL.revokeObjectURL( blobURL );

	return new Promise(function (resolve, reject) {

		worker.addEventListener('message', function (e) {
			resolve(e.data);
			worker.removeEventListener('message', this);
			worker = null;
		});

		worker.addEventListener('error', function (e) {
			reject(e);
			worker.removeEventListener('error', this);
			worker = null;
		});

	});

}
