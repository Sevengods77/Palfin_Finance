# Tech Stack Documentation

## Project Overview
**Privacy-Preserving Federated Learning Model for Email Spam Detection**

This project implements a federated learning approach for email spam detection using GRU (Gated Recurrent Unit) neural networks with privacy-preserving techniques.

---

## Core Technologies

### 1. **Machine Learning & Deep Learning**

#### PyTorch (torch)
- **Purpose**: Primary deep learning framework
- **Usage**: 
  - Custom GRU implementation (`Selfmade_GRU.py`)
  - Model training and inference
  - Tensor operations and neural network modules
- **Version**: Not pinned (latest compatible)

#### Keras
- **Purpose**: Alternative neural network implementation
- **Usage**: Used in some model variants
- **Version**: Not pinned

#### Scikit-learn (sklearn)
- **Purpose**: Machine learning utilities and metrics
- **Usage**:
  - Model evaluation (ROC-AUC, F1-score, accuracy)
  - Data splitting
  - Logistic regression baseline
- **Version**: Not pinned

---

### 2. **Natural Language Processing (NLP)**

#### NLTK (Natural Language Toolkit)
- **Purpose**: Text preprocessing
- **Usage**:
  - Stopwords (currently disabled but available)
  - Text tokenization
- **Version**: Not pinned

#### Sacremoses
- **Purpose**: Advanced text tokenization
- **Usage**: Moses tokenizer for text preprocessing
- **Version**: Not pinned

---

### 3. **Privacy & Security**

#### PySyft (syft)
- **Purpose**: Federated learning framework
- **Usage**: 
  - Distributed training across simulated clients
  - Privacy-preserving computations
  - Currently commented out in simulated version
- **Version**: Not pinned

#### Paillier Homomorphic Encryption (phe)
- **Purpose**: Homomorphic encryption for privacy
- **Usage**: 
  - Encrypted model updates in federated learning
  - Used in `Email Spam Detection - Logistic Regression (with Homomorphic Encryption FL).py`
- **Version**: Not pinned

---

### 4. **Web Framework & API**

#### Flask
- **Purpose**: Web application framework
- **Usage**:
  - REST API for spam detection (`app.py`)
  - Serves HTML frontend
  - `/predict` endpoint for inference
- **Version**: Not pinned
- **Port**: 5001 (default)

---

### 5. **Data Processing & Analysis**

#### NumPy
- **Purpose**: Numerical computing
- **Usage**:
  - Array operations
  - Data preprocessing
  - Feature engineering
- **Version**: Not pinned

#### Pandas
- **Purpose**: Data manipulation and analysis
- **Usage**:
  - CSV data loading
  - Data cleaning and transformation
  - Dataset splitting
- **Version**: Not pinned

#### Matplotlib
- **Purpose**: Data visualization
- **Usage**:
  - Training metrics visualization
  - Word frequency analysis (`topWords1.png`)
- **Version**: Not pinned

---

### 6. **Experiment Tracking**

#### MLflow
- **Purpose**: Machine learning lifecycle management
- **Usage**:
  - Experiment tracking
  - Model versioning
  - Metrics logging (AUC-ROC, F1, accuracy, loss)
  - Model registry
- **Storage**: `mlruns/` directory
- **Version**: Not pinned

---

### 7. **Frontend**

#### HTML/CSS/JavaScript
- **Files**: `templates/index.html`
- **Features**:
  - Simple, clean UI for spam detection
  - Async fetch API for predictions
  - Real-time confidence scoring

---

## Project Architecture

### Module Breakdown (Based on Uploaded Image)

1. **Module 1: Data Acquisition & Preprocessing** ✅
   - `Preprocessing.py`
   - CSV data loading from `Data/` directory
   - Text cleaning, tokenization, padding

2. **Module 2: Feature Engineering & EDA** ✅
   - Word frequency analysis
   - Vocabulary building (`word_to_idx.json`)
   - Data visualization

3. **Module 3: Model Development & Training** ✅
   - `Selfmade_GRU.py` - Custom GRU implementation
   - `Email Spam Detection - GRU (Simulated FL).py`
   - `Email Spam Detection - GRU (with FL).py`
   - `Multiple Models.py`

4. **Module 4: Model Serialization & Explainability** ✅
   - Model saving: `spam_model.pth`
   - Vocabulary export: `word_to_idx.json`
   - MLflow tracking

5. **Module 5: API Development (FastAPI)** ⚠️
   - Currently using Flask (`app.py`)
   - Could be migrated to FastAPI for better performance

6. **Module 6: Containerization (Docker)** ❌ **TO BE IMPLEMENTED**

7. **Module 7: Monitoring & Logging** ✅
   - MLflow for experiment tracking
   - Console logging during training

8. **Module 8: Frontend Integration (React Dashboard)** ⚠️
   - Currently basic HTML/CSS/JS
   - Could be enhanced with React

9. **Module 9: CI/CD Pipeline** ❌ **TO BE IMPLEMENTED**

10. **Module 10: Streaming Inference with Kafka** ❌ **TO BE IMPLEMENTED**

11. **Module 11: Model Drift Detection** ❌ **TO BE IMPLEMENTED**

12. **Module 12: AutoML Experiment Tracking (MLflow)** ✅
    - MLflow already integrated

---

## Data Flow

```
Raw Email Data (CSV)
    ↓
Preprocessing.py → Clean, Tokenize, Pad
    ↓
Client Data Split (3 clients)
    ↓
Federated Training (GRU Model)
    ↓
Model Serialization (spam_model.pth)
    ↓
Flask API (app.py)
    ↓
Web Interface (index.html)
    ↓
Spam Prediction
```

---

## File Structure

```
├── Data/
│   ├── Client_1/          # Federated learning client 1 data
│   ├── Client_2/          # Federated learning client 2 data
│   ├── Client_3/          # Federated learning client 3 data
│   ├── EmailSpamCollection.csv
│   └── EmailSpamCollection-mini.csv
├── templates/
│   └── index.html         # Web UI
├── mlruns/                # MLflow experiment tracking
├── Preprocessing.py       # Data preprocessing pipeline
├── Selfmade_GRU.py       # Custom GRU implementation
├── Email Spam Detection - GRU (Simulated FL).py
├── Email Spam Detection - GRU (with FL).py
├── Email Spam Detection - Logistic Regression (with Homomorphic Encryption FL).py
├── Email Spam Detection - Neural Networks (without FL).py
├── Multiple Models.py     # Multiple model comparison
├── Homomorphic Encryption - Basic Working.py
├── app.py                # Flask web application
├── requirements.txt      # Python dependencies
├── spam_model.pth        # Trained model weights
├── word_to_idx.json      # Vocabulary mapping
├── train_data.csv        # Training dataset
└── test_data.csv         # Test dataset
```

---

## Dependencies Summary

| Package | Purpose | Category |
|---------|---------|----------|
| numpy | Numerical computing | Data Science |
| pandas | Data manipulation | Data Science |
| matplotlib | Visualization | Data Science |
| scikit-learn | ML utilities & metrics | Machine Learning |
| torch | Deep learning framework | Deep Learning |
| keras | Neural networks | Deep Learning |
| nltk | NLP preprocessing | NLP |
| sacremoses | Tokenization | NLP |
| phe | Homomorphic encryption | Privacy |
| syft | Federated learning | Privacy |
| mlflow | Experiment tracking | MLOps |
| flask | Web framework | Web |
| setuptools | Package management | Build |

---

## Key Features

### ✅ Implemented
- Custom GRU neural network for spam detection
- Federated learning across 3 simulated clients
- Privacy-preserving techniques (PySyft, Homomorphic Encryption)
- Web-based inference API
- Experiment tracking with MLflow
- Model serialization and versioning

### 🚧 Partially Implemented
- Frontend (basic HTML, could be enhanced)
- API (Flask instead of FastAPI)

### ❌ Not Yet Implemented
- Docker containerization
- CI/CD pipeline
- Kafka streaming inference
- Model drift detection
- Production monitoring

---

## Running the Project

### Prerequisites
```bash
pip install -r requirements.txt
```

### Step 1: Preprocess Data
```bash
python Preprocessing.py
```

### Step 2: Train Model
```bash
python "Email Spam Detection - GRU (Simulated FL).py"
```

### Step 3: Run Web Application
```bash
python app.py
```

### Step 4: Access UI
Navigate to: `http://localhost:5001`

---

## Model Details

### Architecture
- **Input**: Tokenized email text (max length: 30)
- **Embedding**: 50-dimensional word embeddings
- **Hidden Layer**: 30-dimensional GRU hidden state
- **Dropout**: 0.2
- **Output**: Binary classification (Spam/Not Spam)
- **Activation**: Sigmoid

### Training
- **Optimizer**: SGD
- **Learning Rate**: 0.1
- **Batch Size**: 32
- **Epochs**: 30
- **Loss**: Binary Cross-Entropy with class weighting
- **Gradient Clipping**: 5.0

### Metrics
- ROC-AUC Score
- F1 Score
- Accuracy
- Training/Validation Loss

---

## Next Steps for Production

1. **Dockerization** (Current Focus)
2. Implement FastAPI for better performance
3. Add React dashboard for better UX
4. Set up CI/CD pipeline
5. Implement Kafka for streaming inference
6. Add model drift detection
7. Production monitoring and alerting
