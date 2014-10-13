function AsyncExec (fn) {

	// Build a worker from an anonymous function body
	var blobURL = URL.createObjectURL( new Blob([ 
		'var result = (' + fn.toString() + ')();',
		'postMessage(result);'
	], { type: 'application/javascript' }) ),

	worker = new Worker( blobURL );

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
