import '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs-core';
import * as tfLayers from '@tensorflow/tfjs-layers';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';

// Initialize backend before any model operations
async function initializeBackend() {
  await tf.ready();
  if (tf.getBackend() === undefined) {
    try {
      await tf.setBackend('webgl');
    } catch (e) {
      await tf.setBackend('cpu');
    }
  }
  console.log('Using backend:', tf.getBackend());
}

// Types for our ML predictions
export interface MLPrediction {
  cognitiveLoad: number;
  attentionLevel: number;
  stressLevel: 'low' | 'medium' | 'high';
  confidence: number;
  metrics: {
    focusQuality: number;
    mentalFatigue: number;
    learningProgress: number;
    workloadIntensity: number;
  };
}

// Advanced sensor data types
interface SensorData {
  eyeMovement: number;         // Normalized eye movement frequency
  headPosition: number;        // Head stability metric
  keyboardActivity: number;    // Typing pattern intensity
  timeOnTask: number;         // Normalized time spent on current task
  focusMetrics: {
    saccadeRate: number;      // Rapid eye movement rate
    blinkRate: number;        // Blinks per minute
    pupilDilation: number;    // Normalized pupil size
  };
  posturalMetrics: {
    stabilityScore: number;   // Overall posture stability
    movementFrequency: number;// Frequency of position adjustments
  };
  interactionMetrics: {
    typingSpeed: number;      // Words per minute normalized
    errorRate: number;        // Typing error frequency
    pauseFrequency: number;   // Frequency of breaks in typing
  };
}

// Enhanced training dataset with multi-dimensional features
const COGNITIVE_LOAD_DATASET = {
  features: [
    // Format: [eyeMove, headPos, keyAct, timeTask, saccade, blink, pupil, stability, moveFreq, typeSpeed, errorRate, pauseFreq]
    [0.2, 0.9, 0.7, 0.1, 0.3, 0.2, 0.4, 0.9, 0.2, 0.8, 0.1, 0.2], // Low load, high focus
    [0.4, 0.7, 0.6, 0.3, 0.4, 0.3, 0.5, 0.8, 0.3, 0.7, 0.2, 0.3], // Low-medium load
    [0.5, 0.6, 0.5, 0.5, 0.5, 0.4, 0.6, 0.7, 0.4, 0.6, 0.3, 0.4], // Medium load
    [0.6, 0.5, 0.4, 0.7, 0.6, 0.5, 0.7, 0.6, 0.5, 0.5, 0.4, 0.5], // Medium-high load
    [0.8, 0.3, 0.3, 0.9, 0.7, 0.6, 0.8, 0.4, 0.7, 0.3, 0.6, 0.7], // High load, fatigue
    [0.3, 0.8, 0.8, 0.2, 0.3, 0.3, 0.4, 0.8, 0.3, 0.7, 0.2, 0.2], // Low load, engaged
    [0.7, 0.4, 0.3, 0.8, 0.6, 0.7, 0.7, 0.5, 0.6, 0.4, 0.5, 0.6], // High load, struggling
    [0.4, 0.8, 0.7, 0.4, 0.4, 0.3, 0.5, 0.8, 0.3, 0.8, 0.1, 0.3]  // Medium load, efficient
  ],
  labels: [
    [0.2, 0.9, 0.8, 0.3], // [cognitiveLoad, focusQuality, learningProgress, mentalFatigue]
    [0.3, 0.8, 0.7, 0.4],
    [0.5, 0.6, 0.6, 0.5],
    [0.6, 0.5, 0.5, 0.6],
    [0.8, 0.3, 0.3, 0.8],
    [0.3, 0.8, 0.7, 0.3],
    [0.7, 0.4, 0.4, 0.7],
    [0.4, 0.7, 0.7, 0.4]
  ]
};

class CognitiveLoadModel {
  private model: tfLayers.Sequential | null = null;
  private lastSensorData: SensorData | null = null;
  private readonly historySize = 5;
  private predictionHistory: MLPrediction[] = [];
  
  async initialize(): Promise<void> {
    await initializeBackend();
    
    this.model = tfLayers.sequential();
    
    // Input layer with batch normalization
    this.model.add(tfLayers.layers.dense({
      inputShape: [12],
      units: 24,
      activation: 'relu',
      kernelInitializer: 'glorotNormal'
    }));
    this.model.add(tfLayers.layers.batchNormalization());
    
    // Hidden layers with dropout for regularization
    this.model.add(tfLayers.layers.dense({
      units: 16,
      activation: 'relu'
    }));
    this.model.add(tfLayers.layers.dropout({ rate: 0.2 }));
    
    this.model.add(tfLayers.layers.dense({
      units: 8,
      activation: 'relu'
    }));
    
    // Output layer for multiple metrics
    this.model.add(tfLayers.layers.dense({
      units: 4,
      activation: 'sigmoid'
    }));

    // Advanced optimizer configuration
    const optimizer = tf.train.adam(0.001);
    
    this.model.compile({
      optimizer,
      loss: 'meanSquaredError',
      metrics: ['accuracy', 'mse']
    });

    try {
      // Train with the enhanced dataset
      const xs = tf.tensor2d(COGNITIVE_LOAD_DATASET.features);
      const ys = tf.tensor2d(COGNITIVE_LOAD_DATASET.labels);

      await this.model.fit(xs, ys, {
        epochs: 150,
        batchSize: 4,
        validationSplit: 0.2,
        shuffle: true,
        callbacks: {
          onEpochEnd: (epoch: number, logs: any) => {
            if (epoch % 10 === 0) {
              console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
            }
          }
        }
      });

      xs.dispose();
      ys.dispose();
      console.log('Advanced cognitive load model training completed');
    } catch (error) {
      console.error('Error during model training:', error);
      throw error;
    }
  }

  private collectEnhancedSensorData(): SensorData {
    // Sophisticated sensor data simulation with realistic patterns
    const timeOfDay = (new Date().getHours() + new Date().getMinutes() / 60) / 24;
    const fatigueFactor = Math.sin(timeOfDay * Math.PI) * 0.3 + 0.5;
    
    const baseEyeMovement = 0.3 + Math.random() * 0.4;
    const baseHeadPosition = 0.4 + Math.random() * 0.3;
    
    // Simulate correlated metrics
    const saccadeRate = baseEyeMovement * (1 - fatigueFactor) + Math.random() * 0.2;
    const blinkRate = (1 - baseEyeMovement) * fatigueFactor + Math.random() * 0.2;
    const pupilDilation = baseEyeMovement * 0.7 + fatigueFactor * 0.3 + Math.random() * 0.1;
    
    // Activity patterns based on time and fatigue
    const typingSpeed = Math.max(0.2, (1 - fatigueFactor) * 0.8 + Math.random() * 0.3);
    const errorRate = Math.min(0.9, fatigueFactor * 0.6 + Math.random() * 0.2);
    const pauseFrequency = fatigueFactor * 0.7 + Math.random() * 0.2;

    this.lastSensorData = {
      eyeMovement: baseEyeMovement,
      headPosition: baseHeadPosition,
      keyboardActivity: typingSpeed,
      timeOnTask: (Date.now() % (30 * 60 * 1000)) / (30 * 60 * 1000),
      focusMetrics: {
        saccadeRate,
        blinkRate,
        pupilDilation
      },
      posturalMetrics: {
        stabilityScore: baseHeadPosition,
        movementFrequency: 1 - baseHeadPosition
      },
      interactionMetrics: {
        typingSpeed,
        errorRate,
        pauseFrequency
      }
    };
    
    return this.lastSensorData;
  }

  async predict(): Promise<MLPrediction> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const sensorData = this.collectEnhancedSensorData();
    
    // Prepare input features
    const features = [
      sensorData.eyeMovement,
      sensorData.headPosition,
      sensorData.keyboardActivity,
      sensorData.timeOnTask,
      sensorData.focusMetrics.saccadeRate,
      sensorData.focusMetrics.blinkRate,
      sensorData.focusMetrics.pupilDilation,
      sensorData.posturalMetrics.stabilityScore,
      sensorData.posturalMetrics.movementFrequency,
      sensorData.interactionMetrics.typingSpeed,
      sensorData.interactionMetrics.errorRate,
      sensorData.interactionMetrics.pauseFrequency
    ];

    const inputTensor = tf.tensor2d([features]);
    
    // Get model prediction
    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    const values = await prediction.data();

    // Cleanup
    inputTensor.dispose();
    prediction.dispose();

    // Calculate confidence based on prediction history stability
    const currentPrediction: MLPrediction = {
      cognitiveLoad: values[0],
      metrics: {
        focusQuality: values[1],
        learningProgress: values[2],
        mentalFatigue: values[3],
        workloadIntensity: (values[0] + values[3]) / 2
      },
      attentionLevel: 1 - (values[0] + values[3]) / 2,
      stressLevel: values[0] < 0.4 ? 'low' : values[0] < 0.7 ? 'medium' : 'high',
      confidence: this.calculateConfidence(values[0])
    };

    // Update prediction history
    this.predictionHistory.push(currentPrediction);
    if (this.predictionHistory.length > this.historySize) {
      this.predictionHistory.shift();
    }

    return currentPrediction;
  }

  private calculateConfidence(currentLoad: number): number {
    if (this.predictionHistory.length < 2) return 0.7;

    // Calculate prediction stability
    const loadVariance = this.predictionHistory
      .map(p => p.cognitiveLoad)
      .reduce((variance, load) => variance + Math.pow(load - currentLoad, 2), 0) 
      / this.predictionHistory.length;

    // Calculate sensor reliability
    const sensorReliability = this.lastSensorData ? 
      (1 - Math.abs(this.lastSensorData.focusMetrics.blinkRate - this.lastSensorData.focusMetrics.saccadeRate)) * 0.5 +
      (1 - this.lastSensorData.interactionMetrics.errorRate) * 0.3 +
      this.lastSensorData.posturalMetrics.stabilityScore * 0.2
      : 0.5;

    // Combine metrics for final confidence
    return Math.min(0.95, Math.max(0.6,
      (1 - loadVariance) * 0.6 + sensorReliability * 0.4
    ));
  }

  getLastSensorData(): SensorData | null {
    return this.lastSensorData;
  }

  getPredictionHistory(): MLPrediction[] {
    return [...this.predictionHistory];
  }
}

// Export a singleton instance
export const cognitiveLoadModel = new CognitiveLoadModel(); 