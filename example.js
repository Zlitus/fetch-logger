const nodeFetch = require('node-fetch');
const fetch = require('fetch-log');

fetch(nodeFetch, 'http://127.0.0.1:8000', {headers: {'X-Hello': 'world'}}).then((result) => {
	console.log('Response retrieved!');
});
