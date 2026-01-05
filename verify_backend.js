const http = require('http');

const options = {
    hostname: 'localhost',
    port: 7000,
    path: '/api/lab-requests',
    method: 'GET',
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('Status Code:', res.statusCode);
            if (Array.isArray(json) && json.length > 0) {
                console.log('First request keys:', Object.keys(json[0]));
                // Check for card_id specifically
                const hasCardId = 'card_id' in json[0];
                console.log('First request has card_id key:', hasCardId);
                console.log('First request card_id value:', json[0].card_id);
                console.log('First request amount (if any):', json[0].total_price || 'N/A');
            } else {
                console.log('Response is not an array or empty:', json);
            }
        } catch (e) {
            console.error('Error parsing JSON:', e.message);
            console.log('Raw data:', data);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
