# Privacy-Preserving Federated Learning Model for Email Spam Detection

A federated learning-based email spam detection system using GRU (Gated Recurrent Unit) neural networks with privacy-preserving techniques including PySyft and homomorphic encryption.

## 🚀 Quick Start with Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- 4GB RAM minimum
- 10GB free disk space

### Run the Application

```bash
# Clone the repository
cd s:\WasteOfWork\Privacy-Preserving-Federated-Learning-Model-For-Email-Spam-Detection

# Start with Docker Compose
docker-compose up -d

# Access the web interface
# Open browser: http://localhost:5001
```

That's it! The application is now running with pre-trained models.

### Stop the Application

```bash
docker-compose down
```

For detailed Docker usage, see [DOCKER_GUIDE.md](DOCKER_GUIDE.md).

---

## 📋 Features

- ✅ **Federated Learning**: Distributed training across 3 simulated clients
- ✅ **Privacy-Preserving**: PySyft and Paillier homomorphic encryption support
- ✅ **Custom GRU**: Hand-crafted GRU implementation for spam detection
- ✅ **Web Interface**: Simple Flask-based UI for spam detection
- ✅ **Experiment Tracking**: MLflow integration for model versioning
- ✅ **Docker Support**: Fully containerized for easy deployment
- ✅ **REST API**: JSON API for programmatic access

---

## 🏗️ Architecture

```
Raw Email Data → Preprocessing → Federated Training (3 Clients) 
    → GRU Model → Flask API → Web Interface → Spam Prediction
```

### Tech Stack

- **Deep Learning**: PyTorch, Keras
- **Privacy**: PySyft, Paillier Homomorphic Encryption
- **NLP**: NLTK, Sacremoses
- **Web**: Flask
- **MLOps**: MLflow
- **Data**: NumPy, Pandas, Scikit-learn
- **Deployment**: Docker, Docker Compose

For detailed tech stack information, see [TECH_STACK.md](TECH_STACK.md).

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Using Docker CLI

```bash
# Build image
docker build -t spam-detection:latest .

# Run container
docker run -d -p 5001:5001 --name spam-detector spam-detection:latest

# Stop container
docker stop spam-detector
docker rm spam-detector
```

### Volume Mounts

The Docker setup includes volume mounts for:
- `./Data` - Training data
- `./mlruns` - MLflow experiment tracking
- `spam_model.pth` - Trained model weights
- `word_to_idx.json` - Vocabulary mapping

This allows model retraining and data persistence across container restarts.

---

## 💻 Manual Installation (Without Docker)

### Prerequisites

- Python 3.9 or higher
- pip package manager

### Installation Steps

1. **Install Dependencies**

```bash
pip install -r requirements.txt
```

2. **Download NLTK Data (if using stopwords)**

```python
import nltk
nltk.download('stopwords')
```

3. **Prepare Data**

Ensure the folder structure is maintained:
```
Data/
├── EmailSpamCollection.csv
└── EmailSpamCollection-mini.csv
```

4. **Run Preprocessing**

```bash
python Preprocessing.py
```

This creates:
- `word_to_idx.json` - Vocabulary mapping
- `Data/Client_1/`, `Data/Client_2/`, `Data/Client_3/` - Federated data splits

5. **Train Model**

```bash
python "Email Spam Detection - GRU (Simulated FL).py"
```

This creates:
- `spam_model.pth` - Trained model weights
- `mlruns/` - MLflow experiment tracking data

6. **Run Web Application**

```bash
python app.py
```

Access at: http://localhost:5001

---

## 📊 Model Details

### Architecture
- **Input**: Tokenized email text (max length: 30 tokens)
- **Embedding**: 50-dimensional word embeddings
- **Hidden Layer**: 30-dimensional GRU hidden state
- **Dropout**: 0.2
- **Output**: Binary classification (Spam/Not Spam)
- **Activation**: Sigmoid

### Training Configuration
- **Optimizer**: SGD
- **Learning Rate**: 0.1
- **Batch Size**: 32
- **Epochs**: 30
- **Loss**: Binary Cross-Entropy with class weighting
- **Gradient Clipping**: 5.0

### Evaluation Metrics
- ROC-AUC Score
- F1 Score
- Accuracy
- Training/Validation Loss

---

## 🔌 API Usage

### Health Check

```bash
curl http://localhost:5001/health
```

**Response:**
```json
{"status": "healthy"}
```

### Spam Prediction

```bash
curl -X POST http://localhost:5001/predict \
  -H "Content-Type: application/json" \
  -d '{"email": "Congratulations! You won a free iPhone. Click here to claim now!"}'
```

**Response:**
```json
{
  "prediction": "Spam",
  "confidence": "95.23%",
  "score": 0.9523
}
```

---

## 📁 Project Structure

```
├── Data/                          # Training data and client splits
│   ├── Client_1/                  # Federated client 1 data
│   ├── Client_2/                  # Federated client 2 data
│   ├── Client_3/                  # Federated client 3 data
│   ├── EmailSpamCollection.csv
│   └── EmailSpamCollection-mini.csv
├── templates/
│   └── index.html                 # Web UI
├── mlruns/                        # MLflow experiment tracking
├── Dockerfile                     # Docker configuration
├── docker-compose.yml             # Docker Compose orchestration
├── .dockerignore                  # Docker build exclusions
├── Preprocessing.py               # Data preprocessing pipeline
├── Selfmade_GRU.py               # Custom GRU implementation
├── Email Spam Detection - GRU (Simulated FL).py  # Main training script
├── Email Spam Detection - GRU (with FL).py       # PySyft version
├── Email Spam Detection - Logistic Regression (with Homomorphic Encryption FL).py
├── Email Spam Detection - Neural Networks (without FL).py
├── Multiple Models.py             # Model comparison
├── Homomorphic Encryption - Basic Working.py
├── app.py                        # Flask web application
├── requirements.txt              # Python dependencies
├── spam_model.pth                # Trained model weights
├── word_to_idx.json              # Vocabulary mapping
├── TECH_STACK.md                 # Technology documentation
├── DOCKER_GUIDE.md               # Docker deployment guide
└── README.md                     # This file
```

---

## 🔄 Retraining Models

### Inside Docker Container

```bash
# Access container shell
docker-compose exec spam-detection bash

# Run preprocessing
python Preprocessing.py

# Train model
python "Email Spam Detection - GRU (Simulated FL).py"

# Exit and restart
exit
docker-compose restart
```

### Without Docker

```bash
# Run preprocessing
python Preprocessing.py

# Train model
python "Email Spam Detection - GRU (Simulated FL).py"

# Restart Flask app
python app.py
```

---

## 📈 MLflow Experiment Tracking

View training metrics and model versions:

```bash
# Start MLflow UI
mlflow ui

# Access at: http://localhost:5000
```

Tracked metrics:
- AUC-ROC Score
- Accuracy
- F1 Score
- Training Loss
- Validation Loss

---

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `Preprocessing.py` | Data cleaning, tokenization, and client splitting |
| `Email Spam Detection - GRU (Simulated FL).py` | Main training script with simulated FL |
| `Email Spam Detection - GRU (with FL).py` | PySyft federated learning version |
| `Email Spam Detection - Logistic Regression (with Homomorphic Encryption FL).py` | Encrypted FL with logistic regression |
| `Email Spam Detection - Neural Networks (without FL).py` | Baseline neural network |
| `Multiple Models.py` | Compare multiple model architectures |
| `Homomorphic Encryption - Basic Working.py` | Encryption demo |
| `app.py` | Flask web application |

---

## 🐛 Troubleshooting

### Port Already in Use

Change port in `docker-compose.yml`:
```yaml
ports:
  - "8080:5001"
```

### Model Not Loading

Ensure preprocessing and training have been run:
```bash
python Preprocessing.py
python "Email Spam Detection - GRU (Simulated FL).py"
```

### Docker Build Fails

Try clean build:
```bash
docker-compose build --no-cache
```

### Out of Memory

Increase Docker memory limit:
- Docker Desktop → Settings → Resources → Memory → 8GB

For more troubleshooting, see [DOCKER_GUIDE.md](DOCKER_GUIDE.md#troubleshooting).

---

## 📝 Requirements

See [requirements.txt](requirements.txt) for full dependency list.

Key dependencies:
- numpy==1.24.3
- torch==2.0.1
- flask==2.3.2
- mlflow==2.5.0
- scikit-learn==1.3.0
- pandas==2.0.3

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

---

## 📄 License

This project is part of a research initiative on privacy-preserving federated learning.

---

## 📚 Documentation

- [TECH_STACK.md](TECH_STACK.md) - Detailed technology stack documentation
- [DOCKER_GUIDE.md](DOCKER_GUIDE.md) - Comprehensive Docker deployment guide
- [Final Report](Final%20Report/) - Academic research report

---

## 🎯 Future Enhancements

- [ ] FastAPI migration for better performance
- [ ] React dashboard for enhanced UI
- [ ] CI/CD pipeline integration
- [ ] Kafka streaming inference
- [ ] Model drift detection
- [ ] Production monitoring and alerting
- [ ] Kubernetes deployment manifests

---

## 📧 Contact

For questions or issues, please refer to the project documentation or create an issue in the repository.

---

**Quick Links:**
- 🌐 Web UI: http://localhost:5001
- 💚 Health Check: http://localhost:5001/health
- 🔌 API Endpoint: http://localhost:5001/predict
- 📊 MLflow UI: http://localhost:5000 (when running)
