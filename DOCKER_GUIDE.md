# Docker Guide for Privacy-Preserving Federated Learning Email Spam Detection

This guide provides comprehensive instructions for using Docker to deploy and run the Privacy-Preserving Federated Learning Email Spam Detection application.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Building the Docker Image](#building-the-docker-image)
- [Running with Docker](#running-with-docker)
- [Running with Docker Compose](#running-with-docker-compose)
- [Volume Mounts Explained](#volume-mounts-explained)
- [Retraining Models Inside Container](#retraining-models-inside-container)
- [Accessing MLflow UI](#accessing-mlflow-ui)
- [Environment Variables](#environment-variables)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Docker Engine 20.10+ installed ([Install Docker](https://docs.docker.com/get-docker/))
- Docker Compose 1.29+ (usually included with Docker Desktop)
- At least 4GB of available disk space
- Port 5001 available on your host machine

## Quick Start

The fastest way to get started:

```bash
# Clone the repository (if not already done)
cd S:\WasteOfWork\Privacy-Preserving-Federated-Learning-Model-For-Email-Spam-Detection

# Start the application with Docker Compose
docker-compose up -d

# Check if the container is running
docker-compose ps

# View logs
docker-compose logs -f spam-detection

# Access the application
# Open http://localhost:5001 in your browser
```

To stop:
```bash
docker-compose down
```

## Building the Docker Image

### Using Docker Compose (Recommended)
Docker Compose will automatically build the image when you run:
```bash
docker-compose up --build
```

### Using Docker CLI
To build the image manually:
```bash
docker build -t spam-detection:latest .
```

Build with a specific tag:
```bash
docker build -t spam-detection:v1.0 .
```

Check the built image:
```bash
docker images | findstr spam-detection
```

## Running with Docker

### Basic Run
```bash
docker run -d -p 5001:5001 --name spam-detector spam-detection:latest
```

### Run with Volume Mounts
For data persistence and model updates:
```bash
docker run -d -p 5001:5001 ^
  -v "%cd%\Data:/app/Data" ^
  -v "%cd%\mlruns:/app/mlruns" ^
  -v "%cd%\spam_model.pth:/app/spam_model.pth" ^
  -v "%cd%\word_to_idx.json:/app/word_to_idx.json" ^
  --name spam-detector ^
  spam-detection:latest
```

### Run with Custom Port
```bash
docker run -d -p 8080:5001 --name spam-detector spam-detection:latest
```
Access at: http://localhost:8080

### Interactive Mode (for debugging)
```bash
docker run -it --rm -p 5001:5001 spam-detection:latest
```

## Running with Docker Compose

### Start Services
```bash
# Start in detached mode
docker-compose up -d

# Start with build (if code changed)
docker-compose up -d --build

# Start in foreground (see logs)
docker-compose up
```

### Stop Services
```bash
# Stop containers (keeps volumes)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes
docker-compose down -v
```

### View Logs
```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View last 100 lines
docker-compose logs --tail=100
```

### Check Status
```bash
# Check running services
docker-compose ps

# Check health status
docker-compose ps spam-detection
```

## Volume Mounts Explained

The Docker Compose configuration uses several volume mounts:

### 1. Data Directory (`./Data:/app/Data`)
- **Purpose**: Access training and test datasets
- **Use Case**: Required if you want to retrain models inside the container
- **Persistence**: Changes made inside container reflect on host

### 2. MLflow Directory (`./mlruns:/app/mlruns`)
- **Purpose**: Persist experiment tracking data
- **Use Case**: Keep training metrics and model versions across container restarts
- **Persistence**: MLflow data survives container recreation

### 3. Model Files
- `./spam_model.pth:/app/spam_model.pth` - Pre-trained GRU model
- `./word_to_idx.json:/app/word_to_idx.json` - Vocabulary mapping

**Purpose**: Allow hot-swapping of models without rebuilding the image

## Retraining Models Inside Container

### Access Container Shell
```bash
docker-compose exec spam-detection bash
```

### Run Preprocessing
```bash
python Preprocessing.py
```

### Train New Model
```bash
python "Email Spam Detection - GRU (Simulated FL).py"
```

### Verify New Model
```bash
ls -lh spam_model.pth word_to_idx.json
```

### Exit Container
```bash
exit
```

### Restart Service to Load New Model
```bash
docker-compose restart spam-detection
```

## Accessing MLflow UI

If you want to access MLflow UI for experiment tracking:

### Option 1: Run MLflow Server in Container
```bash
docker-compose exec spam-detection mlflow ui --host 0.0.0.0 --port 5000
```

Then access at: http://localhost:5000

### Option 2: Add MLflow Service to Docker Compose
Add this to `docker-compose.yml`:
```yaml
  mlflow:
    image: python:3.9-slim
    container_name: mlflow-ui
    ports:
      - "5000:5000"
    volumes:
      - ./mlruns:/mlruns
    command: >
      bash -c "pip install mlflow==2.5.0 && 
               mlflow ui --host 0.0.0.0 --backend-store-uri /mlruns"
    networks:
      - spam-detection-network
```

## Environment Variables

You can customize the application using environment variables:

### Available Variables
- `PORT` - Flask application port (default: 5001)
- `FLASK_ENV` - Flask environment (production/development)
- `PYTHONUNBUFFERED` - Python output buffering (1 = disabled)

### Set via Docker Run
```bash
docker run -d -p 5001:5001 ^
  -e PORT=5001 ^
  -e FLASK_ENV=production ^
  --name spam-detector ^
  spam-detection:latest
```

### Set via Docker Compose
Edit `docker-compose.yml`:
```yaml
environment:
  - PORT=5001
  - FLASK_ENV=production
  - PYTHONUNBUFFERED=1
```

## Production Deployment

### Best Practices

1. **Use Specific Tags**
   ```bash
   docker build -t spam-detection:v1.0.0 .
   ```

2. **Resource Limits**
   Add to `docker-compose.yml`:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '2'
         memory: 4G
       reservations:
         cpus: '1'
         memory: 2G
   ```

3. **Use Production WSGI Server**
   Update `Dockerfile` CMD:
   ```dockerfile
   CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5001", "app:app"]
   ```
   
   Add to `requirements.txt`:
   ```
   gunicorn==21.2.0
   ```

4. **Enable HTTPS**
   Use a reverse proxy like Nginx or Traefik

5. **Logging**
   Configure centralized logging:
   ```yaml
   logging:
     driver: "json-file"
     options:
       max-size: "10m"
       max-file: "3"
   ```

### Scaling with Docker Compose
```bash
# Run multiple instances
docker-compose up -d --scale spam-detection=3

# Use a load balancer (Nginx/HAProxy) to distribute traffic
```

## Troubleshooting

### Container Won't Start

**Check logs:**
```bash
docker-compose logs spam-detection
```

**Common issues:**
- Port 5001 already in use: Change port mapping in `docker-compose.yml`
- Missing model files: Ensure `spam_model.pth` and `word_to_idx.json` exist
- Permission issues: Check file permissions on mounted volumes

### Health Check Failing

**Check health status:**
```bash
docker inspect spam-detector | findstr Health
```

**Possible causes:**
- Model not loaded: Check if model files exist
- Flask app crashed: Check application logs
- Network issues: Verify container networking

### Cannot Access Application

**Verify container is running:**
```bash
docker-compose ps
```

**Check port mapping:**
```bash
docker port spam-detector
```

**Test from inside container:**
```bash
docker-compose exec spam-detection curl http://localhost:5001/health
```

### Model Predictions Not Working

**Verify model files:**
```bash
docker-compose exec spam-detection ls -lh spam_model.pth word_to_idx.json
```

**Check model loading:**
```bash
docker-compose logs spam-detection | findstr -i "model\|vocab"
```

### Volume Mount Issues (Windows)

**Enable file sharing in Docker Desktop:**
1. Open Docker Desktop Settings
2. Go to Resources → File Sharing
3. Add your project directory
4. Click "Apply & Restart"

**Use absolute paths:**
```yaml
volumes:
  - S:\WasteOfWork\Privacy-Preserving-Federated-Learning-Model-For-Email-Spam-Detection\Data:/app/Data
```

### Out of Memory

**Increase Docker memory:**
1. Docker Desktop → Settings → Resources
2. Increase Memory limit to at least 4GB
3. Click "Apply & Restart"

### Rebuild After Code Changes

```bash
# Rebuild and restart
docker-compose up -d --build

# Force rebuild (no cache)
docker-compose build --no-cache
docker-compose up -d
```

### Clean Up Everything

```bash
# Stop and remove containers
docker-compose down

# Remove images
docker rmi spam-detection:latest

# Remove all unused Docker resources
docker system prune -a
```

## Useful Commands Reference

```bash
# View container resource usage
docker stats spam-detector

# Execute command in running container
docker-compose exec spam-detection python --version

# Copy files from container
docker cp spam-detector:/app/spam_model.pth ./backup_model.pth

# Copy files to container
docker cp ./new_model.pth spam-detector:/app/spam_model.pth

# View container details
docker inspect spam-detector

# View container processes
docker-compose top

# Restart specific service
docker-compose restart spam-detection
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Flask Deployment Options](https://flask.palletsprojects.com/en/2.3.x/deploying/)
- [MLflow Documentation](https://mlflow.org/docs/latest/index.html)

---

For more information about the project, see the main [README.md](README.md).
