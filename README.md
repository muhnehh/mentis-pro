# MentisPro - Real-time Cognitive Load Monitoring

A sophisticated React application that uses TensorFlow.js to monitor and analyze cognitive load in real-time. The system uses advanced machine learning techniques to process multiple input signals and provide comprehensive cognitive state analysis.

## Features

### Core Functionality
- **Real-time Cognitive Load Analysis**
  - Continuous monitoring of user's mental state
  - Multi-metric analysis (focus, fatigue, stress)
  - Adaptive threshold adjustments
  - Time-based pattern recognition

### Advanced ML Capabilities
- **TensorFlow.js Integration**
  - WebGL-accelerated neural network
  - Multi-layer architecture with batch normalization
  - Real-time sensor data processing
  - Confidence-based predictions

### User Interface
- **Dynamic Dashboard**
  - Real-time cognitive load visualization
  - Interactive metric displays
  - Customizable alerts and thresholds
  - Dark/Light mode support

### Smart Features
- **AI Assistant Integration**
  - OpenAI-powered task suggestions
  - Contextual support recommendations
  - Adaptive learning patterns
  - Personalized insights

## Tech Stack

- **Frontend**
  - React 18.2
  - TypeScript 4.9
  - TailwindCSS 3.4
  - Recharts 2.12

- **Machine Learning**
  - TensorFlow.js 4.22
  - WebGL Backend
  - Custom ML Service Architecture

- **Additional Tools**
  - Lucide React Icons
  - Jotai State Management
  - Axios HTTP Client

## Project Structure

```
src/
├── components/
│   ├── monitoring/
│   │   └── CognitiveLoadMonitor.tsx
│   ├── dashboard/
│   │   ├── QuickActions.tsx
│   │   ├── RecentActivities.tsx
│   │   ├── SupportInsights.tsx
│   │   └── TodaySchedule.tsx
│   ├── chat/
│   │   └── AIAssistant.tsx
│   ├── navigation/
│   │   ├── BottomToolbar.tsx
│   │   └── NavigationMap.tsx
│   ├── tasks/
│   │   └── Tasks.tsx
│   ├── MentisPro.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Settings.tsx
├── services/
│   ├── mlService.ts
│   ├── openai.ts
│   └── localAI.ts
├── types/
│   └── index.ts
└── utils/
    └── monitoring.ts

```

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

3. Create a `.env` file in the root directory:
```env
REACT_APP_OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Machine Learning Model

The core ML model (`mlService.ts`) features:

- **Neural Network Architecture**
  ```typescript
  Input Layer (12 neurons)
    └─ Dense + BatchNorm + ReLU
       └─ Dense (24 units) + ReLU
          └─ Dropout (0.2)
             └─ Dense (16 units) + ReLU
                └─ Dense (8 units) + ReLU
                   └─ Output (4 units) + Sigmoid
  ```

- **Input Features**
  - Eye movement tracking
  - Head position stability
  - Keyboard interaction patterns
  - Focus and fatigue metrics
  - Time-based activity analysis

- **Output Metrics**
  - Cognitive load (0-1)
  - Focus quality (0-1)
  - Learning progress (0-1)
  - Mental fatigue (0-1)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you find this project helpful, consider supporting its development:

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/truemune) 