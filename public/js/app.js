// Initialize WebSocket connection
const ws = new WebSocket(`ws://${window.location.host}`);

// Chart configuration
const chartConfig = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Stock Price',
            data: [],
            borderColor: '#FFD700',
            backgroundColor: 'rgba(255, 215, 0, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#FFD700',
                bodyColor: '#fff',
                borderColor: '#FFD700',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#666'
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#666'
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuart'
        }
    }
};

// Initialize chart
const chart = new Chart(
    document.getElementById('tradingChart'),
    chartConfig
);

// WebSocket event handlers
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'stockUpdate') {
        updateChart(data.data);
        updatePrediction(data.prediction);
    }
};

// Update chart with new data
function updateChart(data) {
    const maxDataPoints = 50;
    
    // Update labels and data
    chartConfig.data.labels.push(new Date().toLocaleTimeString());
    chartConfig.data.datasets[0].data.push(data.price);
    
    // Remove old data points if exceeding maxDataPoints
    if (chartConfig.data.labels.length > maxDataPoints) {
        chartConfig.data.labels.shift();
        chartConfig.data.datasets[0].data.shift();
    }
    
    chart.update('none'); // Update without animation for real-time data
}

// Update prediction display
function updatePrediction(prediction) {
    const predictionElement = document.getElementById('prediction');
    const trend = prediction.trend === 'up' ? '📈' : '📉';
    const confidenceColor = prediction.confidence > 0.7 ? 'text-green-400' : 'text-yellow-400';
    
    predictionElement.innerHTML = `
        <h3 class="text-xl font-bold mb-4">AI Prediction</h3>
        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <span class="text-gray-400">Trend</span>
                <span class="text-2xl">${trend}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-gray-400">Price Target</span>
                <span class="${confidenceColor}">$${prediction.priceTarget.toFixed(2)}</span>
            </div>
            <div class="flex justify-between items-center">
                <span class="text-gray-400">Confidence</span>
                <div class="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div class="h-full ${confidenceColor} transition-all duration-500" 
                         style="width: ${prediction.confidence * 100}%"></div>
                </div>
            </div>
        </div>
    `;
}

// Event Listeners
document.getElementById('predictBtn').addEventListener('click', () => {
    const symbol = document.getElementById('stockSymbol').value.toUpperCase();
    if (symbol) {
        // Add loading state
        document.getElementById('prediction').innerHTML = `
            <h3 class="text-xl font-bold mb-4">AI Prediction</h3>
            <div class="flex items-center justify-center py-4">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        `;
        
        ws.send(JSON.stringify({
            type: 'getPrediction',
            symbol: symbol
        }));
    }
});

// Handle WebSocket connection status
ws.onopen = () => {
    console.log('Connected to server');
};

ws.onclose = () => {
    console.log('Disconnected from server');
};

// Initialize with demo data
function initializeDemoData() {
    const demoData = Array.from({ length: 20 }, (_, i) => ({
        price: 100 + Math.random() * 10,
        timestamp: new Date(Date.now() - (20 - i) * 1000)
    }));
    
    chartConfig.data.labels = demoData.map(d => d.timestamp.toLocaleTimeString());
    chartConfig.data.datasets[0].data = demoData.map(d => d.price);
    chart.update();
}

initializeDemoData();