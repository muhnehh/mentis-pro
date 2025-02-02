# MentisPro - Real-time Cognitive Load Monitoring

A sophisticated React application that uses TensorFlow.js to monitor and analyze cognitive load in real-time. The system combines advanced machine learning with an intuitive user interface to provide comprehensive cognitive state analysis.

## Overview

MentisPro helps users understand and optimize their cognitive state by:
- Monitoring real-time cognitive load and attention levels
- Providing visual feedback through dynamic charts and metrics
- Analyzing patterns in user behavior and cognitive states
- Offering insights for better productivity and mental well-being

## User Interface

### Dashboard Components
- **Real-time Metrics Display**
  - Cognitive Load Gauge (0-100%)
  - Attention Level Indicator
  - Stress Level Classification (Low/Medium/High)
  - Focus Quality Score
  - Mental Fatigue Index
  - Learning Progress Tracker
  - Workload Intensity Meter

### Visualization Features
- **Interactive Charts**
  - Time-series graphs showing cognitive load trends
  - Multi-metric comparison charts
  - Focus quality vs. mental fatigue correlation plots
  - Historical performance analytics

### User Experience
- **Responsive Design**
  - Adapts to desktop, tablet, and mobile views
  - Dark/Light mode support
  - Customizable dashboard layouts
- **Real-time Updates**
  - Continuous metric updates
  - Smooth animations for state changes
  - Instant feedback on cognitive state changes

## Machine Learning Architecture

### Neural Network Model
- **Input Layer**
  - 12 input neurons for sensor data processing
  - Batch normalization for stable training
  - ReLU activation with glorot normal initialization

### Hidden Layers
1. **First Hidden Layer**
  - 24 units with ReLU activation
  - Batch normalization
  - Dropout (0.2) for regularization

2. **Second Hidden Layer**
  - 16 units with ReLU activation
  - Advanced pattern recognition capabilities

3. **Third Hidden Layer**
  - 8 units with ReLU activation
  - Feature compression and abstraction

### Output Layer
- 4 output neurons with sigmoid activation
- Multi-metric prediction capabilities:
  - Cognitive load estimation
  - Focus quality assessment
  - Learning progress evaluation
  - Mental fatigue quantification

### Model Features
- **Advanced Training Process**
  - 150 epochs with batch size of 4
  - Validation split: 0.2
  - Adam optimizer with custom learning rate
  - Mean squared error loss function

- **Sensor Data Processing**
  - Eye movement tracking analysis
  - Head position stability monitoring
  - Keyboard interaction patterns
  - Time-based fatigue modeling

### Real-time Analysis
- **Sophisticated Metrics**
  - Saccade rate analysis
  - Blink rate monitoring
  - Pupil dilation tracking
  - Posture stability assessment
  - Typing pattern analysis

- **Confidence Scoring**
  - Prediction history stability analysis
  - Sensor reliability assessment
  - Variance-based confidence calculation
  - Time-of-day fatigue correlation

## Tech Stack

### Frontend
- React 18
- TypeScript 4
- Recharts for data visualization
- Tailwind CSS for styling
- Custom hooks for state management

### Machine Learning
- TensorFlow.js 4.22
- WebGL backend for GPU acceleration
- CPU fallback support
- Custom ML service architecture

### Development Tools
- Modern ES6+ JavaScript
- Webpack for bundling
- ESLint for code quality
- Jest for testing

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/muhnehh/mentis-pro.git
```

2. Install dependencies:
```bash
cd mentis-pro
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/
│   ├── monitoring/
│   │   ├── CognitiveLoadMonitor.tsx
│   │   ├── MetricsDisplay.tsx
│   │   └── VisualizationCharts.tsx
│   └── ui/
│       ├── Dashboard.tsx
│       └── Controls.tsx
├── services/
│   ├── mlService.ts
│   └── dataProcessing.ts
└── utils/
    ├── types.ts
    └── helpers.ts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Acknowledgments

- TensorFlow.js team for the excellent machine learning framework
- React team for the robust frontend framework
- Open source community for various tools and libraries

## Support

If you like this project, consider buying me a coffee:

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/truemune) 