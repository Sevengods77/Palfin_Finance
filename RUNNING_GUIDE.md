# How to Run the Project

This guide provides clear, step-by-step instructions to run the **Privacy-Preserving Federated Learning Model for Email Spam Detection**.

You can run the project in two ways:
1.  **Using Docker (Recommended)** - Easiest and most stable.
2.  **Running Locally (Python)** - Good for development.

---

## Option 1: Using Docker (Recommended)

This method handles all dependencies and configuration for you.

### Prerequisites
- Docker Desktop installed and running.

### Steps

1.  **Open a terminal** in the project directory:
    ```bash
    cd s:\WasteOfWork\Privacy-Preserving-Federated-Learning-Model-For-Email-Spam-Detection
    ```

2.  **Start the application**:
    ```bash
    docker-compose up -d
    ```
    *Note: The first run may take a few minutes to build the image.*

3.  **Access the Application**:
    - Open your browser to: **[http://localhost:5001](http://localhost:5001)**
    - Health check: [http://localhost:5001/health](http://localhost:5001/health)

4.  **Stop the Application**:
    ```bash
    docker-compose down
    ```

---

## Option 2: Running Locally (Python)

Use this if you want to run the code directly on your machine without Docker.

### Prerequisites
- Python 3.9 installed.
- `pip` package manager.

### Steps

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
    *Note: If you don't have a GPU, you might want to install the CPU version of PyTorch to save space:*
    ```bash
    pip install torch==2.0.1+cpu --extra-index-url https://download.pytorch.org/whl/cpu
    ```

2.  **Prepare Data (First Run Only)**:
    Run the preprocessing script to generate vocabulary and split data:
    ```bash
    python Preprocessing.py
    ```

3.  **Train the Model (Optional)**:
    If you want to retrain the model from scratch:
    ```bash
    python "Email Spam Detection - GRU (Simulated FL).py"
    ```
    *This will generate a new `spam_model.pth`.*

4.  **Run the Web Application**:
    ```bash
    python app.py
    ```

5.  **Access the Application**:
    - Open your browser to: **[http://localhost:5001](http://localhost:5001)**

---

## Troubleshooting

### "System cannot find the file specified" (Docker)
- **Cause**: Docker Desktop is not running.
- **Fix**: Open Docker Desktop and wait for the whale icon to stop animating.

### Application Crashes on Start
- **Cause**: Often due to PyTorch version mismatch or missing dependencies.
- **Fix**: The Docker setup uses a CPU-optimized version of PyTorch (`torch==2.0.1+cpu`) which is very stable. If running locally, try installing that version.

### Port 5001 Already in Use
- **Fix**: Edit `docker-compose.yml` (or `app.py` for local) to use a different port, e.g., `8080:5001`.
