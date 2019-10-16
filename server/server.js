var webSocketServer = require('ws').Server;
var wss = new webSocketServer({ port: 3000 });


wss.on('connection', function (socket) {
    console.log('A new WebSocket connection has been established');
    const recognizeStream = createSpeechRecognizeStream();
    recognizeStream
        .on('data', (data) => {
            // Data event from Speech api
            if (data.results && data.results[0]) {
                websocket.send(JSON.stringify(data.results[0]));
            }
        })
        .on('error', (error) => {
            ws.send(JSON.stringify({
                error: true
            }));
        });

});

wss.on('message', (data) => {
    // Audio buffer data
    const buffer = new Int16Array(data, 0, Math.floor(data.byteLength / 2));
    // Write the data chunk in the stream
    recognizeStream.write(buffer);
});

// Communication channel closing from frontend
wss.on('close', () => {
    recognizeStream.end();
});
