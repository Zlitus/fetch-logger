var fetch;

try {
	fetch = require('node-fetch');
} catch (e) {}

var fetchLog = function(urlOrFetch, optionsOrUrl, options) {
	var url, options;
	if (typeof(urlOrFetch) === 'function' && typeof(optionsOrUrl) === 'string') {
		console.log('Case N°1');
		fetch = urlOrFetch;
		url = optionsOrUrl;
		options = options;
	} else if (typeof(urlOrFetch) === 'string' && options === undefined) {
		console.log('Case N°2');
		url = urlOrFetch;
		options = optionsOrUrl;
	} else {
		throw 'FetchLogs Usage: fetchLog([fetchFunction, ] \'http://…\'[, options]);';
	}

	if (!fetch) {
		throw 'FetchLogs: You need to specify a fetch function (example: node-fetch). You can also just install the node-fetch module and re-try.';
	}

	if (!options) {
		options = {};
	}

	var method = options.method || 'GET';
	var name = method+' '+url;

	console.groupCollapsed(name);
	console.time(name);
	if (options.headers) {
		console.groupCollapsed('Request headers');
		Object.entries(options.headers).forEach((key) => {
			console.log(key[0]+': '+key[1]);
		});
		console.groupEnd();
	}

	var response = async (result, a, b, c) => {
		console.group('Response');
		console.timeEnd(name);
		if (!result.status) {
			console.log(result);
			console.groupEnd();
			console.groupEnd();
			throw result;
		}

		console.info('Status: '+result.status+' '+result.statusText);
		console.info(result.url);

		if (result.headers) {
			console.group('Response headers');
			result.headers.forEach(function(h) {
				console.log(h);
			});
			console.groupEnd();
		}

		if (options._processBody !== false) {
			var body = await result.text();
			console.groupCollapsed('Response body');
			console.log(body);
			console.groupEnd();

			result.text = function() { return body; };
			result.json = function() { return JSON.parse(body); };
		}

		console.groupEnd();
		console.groupEnd();
		return result;
	};

	return fetch(url, options).then(response, async (result) => {
		console.error('Error!');
		return response(result);
	});
};

module.exports = fetchLog;
