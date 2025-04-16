const WebSocket = require('ws');
const stockPrediction = require('./stockPrediction');

class WebSocketService {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.init();
    }

    init() {
        this.wss.on('connection', (ws) => {
            console.log('New client connected');

            // Send initial data
            this.sendMockData(ws);

            // Handle incoming messages
            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message);
                    
                    if (data.type === 'getPrediction') {
                        const prediction = await stockPrediction.getPrediction(data.symbol);
                        ws.send(JSON.stringify({
                            type: 'prediction',
                            data: prediction
                        }));
                    }
                } catch (error) {
                    console.error('WebSocket message error:', error);
                }
            });

            // Handle client disconnection
            ws.on('close', () => {
                console.log('Client disconnected');
            });
        });
    }

    sendMockData(ws) {
        // Generate and send mock stock data
        const mockData = {
            labels: Array.from({length: 30}, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (30 - i));
                return date.toLocaleDateString();
            }),
            prices: Array.from({length: 30}, () => Math.random() * 100 + 100)
        };

        ws.send(JSON.stringify({
            type: 'stockUpdate',
            data: mockData
        }));
    }
}

module.exports = WebSocketService;