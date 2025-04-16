const tf = require('@tensorflow/tfjs');

class AIModel {
    constructor() {
        this.model = null;
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        // Create a sequential model
        this.model = tf.sequential();

        // Add layers
        this.model.add(tf.layers.lstm({
            units: 50,
            returnSequences: true,
            inputShape: [30, 1]
        }));
        
        this.model.add(tf.layers.dropout(0.2));
        
        this.model.add(tf.layers.lstm({
            units: 50,
            returnSequences: false
        }));
        
        this.model.add(tf.layers.dropout(0.2));
        
        this.model.add(tf.layers.dense({
            units: 1,
            activation: 'linear'
        }));

        // Compile the model
        this.model.compile({
            optimizer: tf.train.adam(0.001),
            loss: 'meanSquaredError'
        });

        this.initialized = true;
    }

    async preprocessData(data) {
        const prices = data.map(d => d.price);
        const tensorData = tf.tensor2d(prices, [prices.length, 1]);
        const normalized = this.normalize(tensorData);
        
        const sequences = [];
        const sequenceLength = 30;
        
        for (let i = 0; i < normalized.shape[0] - sequenceLength; i++) {
            const sequence = normalized.slice([i], [sequenceLength]);
            sequences.push(sequence.arraySync());
        }
        
        return tf.tensor3d(sequences, [sequences.length, sequenceLength, 1]);
    }

    normalize(tensor) {
        const min = tensor.min();
        const max = tensor.max();
        const normalized = tensor.sub(min).div(max.sub(min));
        return normalized;
    }

    denormalize(normalized, originalData) {
        const prices = originalData.map(d => d.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return normalized.mul(max - min).add(min);
    }

    async train(data) {
        await this.initialize();
        
        const X = await this.preprocessData(data);
        const y = tf.tensor2d(data.slice(30).map(d => d.price), [-1, 1]);
        
        await this.model.fit(X, y, {
            epochs: 50,
            batchSize: 32,
            shuffle: true,
            validationSplit: 0.1
        });
    }

    async predict(data) {
        await this.initialize();
        
        const input = await this.preprocessData(data.slice(-30));
        const prediction = this.model.predict(input);
        const denormalized = this.denormalize(prediction, data);
        
        const predictedValue = await denormalized.data();
        
        return {
            nextDayPrice: predictedValue[0],
            confidence: this.calculateConfidence(data, predictedValue[0])
        };
    }

    calculateConfidence(historicalData, predictedPrice) {
        const prices = historicalData.map(d => d.price);
        const std = this.standardDeviation(prices);
        const lastPrice = prices[prices.length - 1];
        const priceChange = Math.abs(predictedPrice - lastPrice);
        
        // Calculate confidence based on how many standard deviations the prediction is from the last price
        const confidence = Math.max(0, 1 - (priceChange / (2 * std)));
        return Math.min(confidence, 0.95);
    }

    standardDeviation(values) {
        const mean = values.reduce((a, b) => a + b) / values.length;
        const squareDiffs = values.map(value => Math.pow(value - mean, 2));
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b) / squareDiffs.length;
        return Math.sqrt(avgSquareDiff);
    }
}

module.exports = new AIModel();