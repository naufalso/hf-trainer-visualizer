# 🤗 HuggingFace Trainer Visualizer

A client-side React application to upload, visualize, and plot HuggingFace `trainer_state.json` logs. This tool helps you analyze and understand your model training progress with interactive charts and metrics.

## ✨ Features

- 📁 **Easy File Upload**: Drag and drop or click to upload your `trainer_state.json` file
- 📊 **Interactive Charts**: Visualize training metrics using dynamic, responsive charts
- 🎯 **Metric Selection**: Choose which metrics to display (loss, learning rate, evaluation metrics, etc.)
- 📈 **Training Summary**: View key information about your training run at a glance
- 🎨 **Modern UI**: Clean, responsive design that works on desktop and mobile
- 🔒 **Privacy-Focused**: All processing happens in your browser - no data is sent to any server

## 🚀 Live Demo

Visit the live application: [https://naufalso.github.io/hf-trainer-visualizer](https://naufalso.github.io/hf-trainer-visualizer)

## 📖 Usage

1. Train your model using HuggingFace Transformers
2. Locate the `trainer_state.json` file in your training output directory
3. Upload the file to the visualizer using drag-and-drop or file picker
4. Select the metrics you want to visualize
5. Analyze your training progress with interactive charts

## 🛠️ Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/naufalso/hf-trainer-visualizer.git
cd hf-trainer-visualizer

# Install dependencies
npm install
```

### Available Scripts

#### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in interactive watch mode.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

#### `npm run deploy`

Deploys the app to GitHub Pages.

## 📦 Built With

- [React](https://reactjs.org/) - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Recharts](https://recharts.org/) - Charting Library
- [Create React App](https://create-react-app.dev/) - Project Setup

## 📄 Example trainer_state.json Structure

```json
{
  "best_metric": 0.95,
  "best_model_checkpoint": "./checkpoint-1000",
  "epoch": 3.0,
  "global_step": 1500,
  "log_history": [
    {
      "epoch": 0.1,
      "learning_rate": 5e-5,
      "loss": 2.5,
      "step": 100
    },
    {
      "epoch": 0.2,
      "learning_rate": 4.8e-5,
      "loss": 2.1,
      "step": 200
    }
  ],
  "num_train_epochs": 3
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built for the HuggingFace community
- Inspired by the need for easy training visualization
