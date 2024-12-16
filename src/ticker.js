const WebSocket = require('ws');

// Kraken WebSocket API URL
const KRAKEN_WS_URL = 'wss://ws.kraken.com';

// Create a new WebSocket connection
const ws = new WebSocket(KRAKEN_WS_URL);

// Connection opened
ws.on('open', function open() {
    console.log('Connected to Kraken WebSocket API');

    // Subscribe to the BTC/USD ticker
    const subscriptionMessage = {
        event: 'subscribe',
        pair: ['XBT/USD'],
        subscription: {
            name: 'ticker'
        }
    };

    ws.send(JSON.stringify(subscriptionMessage));
});

// Listen for messages
ws.on('message', function incoming(data) {
    const message = JSON.parse(data);

    // Filter out heartbeat and subscription messages
    if (Array.isArray(message) && message[2] === 'ticker') {
        const tickerData = message[1];

        const price = {
            ask: parseFloat(tickerData.a[0]),
            bid: parseFloat(tickerData.b[0]),
            lastTrade: parseFloat(tickerData.c[0]),
            volume: parseFloat(tickerData.v[0]),
            low: parseFloat(tickerData.l[0]),
            high: parseFloat(tickerData.h[0])
        };

        console.log('\n=== Bitcoin Price Update ===');
        console.log(`Ask: $${price.ask}`);
        console.log(`Bid: $${price.bid}`);
        console.log(`Last Trade: $${price.lastTrade}`);
        console.log(`24h Volume: ${price.volume} BTC`);
        console.log(`24h Low: $${price.low}`);
        console.log(`24h High: $${price.high}`);
    }
});

// Handle errors
ws.on('error', function error(err) {
    console.error('WebSocket error:', err);
});

// Handle connection close
ws.on('close', function close() {
    console.log('Disconnected from Kraken WebSocket API');
});
