// Deprecated for AsyncExec

var AsyncDispatcher = (function () {

	// for generating unique ids to keep track of work processes
	var uniqid = (function() {	
	    
		var i = 0;
	    
		return function(prefix) {       
	        var v = (new Date()).getTime();
	        return (prefix || "id") + v.toString() + i++;
	    }; 
	    
	})();

	var worker = new Worker("js/workers/AsyncLoader.js");

	worker.addEventListener('error', function (e) {
		console.error(e);
	});

	var callLoader = function (cmd, args) {

		return new Promise(function (resolve, reject) {

			var processId = uniqid();

			worker.addEventListener('message', function (e) {

				if (e.data.processId == processId) {

					if (e.data.response) resolve(e.data.response);
					if (e.data.error) reject(e.data.error);

					worker.removeEventListener('message', this);
				}
				
			});

			worker.postMessage({ command: cmd, processId: processId, args: args });

		});

	};

	return  {
		loadScript: function (src) {

			var publicApi = this;

			return callLoader('loadScript', [src])
			.then(function (methods) {

				for (var i = 0, l = methods.length; i < l; i++) {

					(function (method) {

						publicApi[method] = function () {
							return callLoader(method, arguments);
						};

					})(methods[i]);

				}

			}, function (error) {
				console.error(error);
			});

		}
	};

})();