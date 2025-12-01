import numpy as np
import torch
from torch import nn
import torch.nn.functional as F
from flask import Flask, request, jsonify, render_template
import pandas as pd
import json
import re
import os
from Selfmade_GRU import GRU

app = Flask(__name__)

# Load configuration and assets
VOCAB_SIZE = 0
EMBEDDING_DIM = 50
HIDDEN_DIM = 30
DROPOUT = 0.2
MAX_LENGTH = 30
STOPWORDS = set([]) # Keep empty as per Preprocessing.py

# Global variables for model and vocab
model = None
word_to_idx = {}

def load_assets():
    global model, word_to_idx, VOCAB_SIZE
    
    # Load Vocabulary
    if os.path.exists('word_to_idx.json'):
        with open('word_to_idx.json', 'r') as f:
            word_to_idx = json.load(f)
            VOCAB_SIZE = len(word_to_idx) + 1
    else:
        print("Warning: word_to_idx.json not found. Run Preprocessing.py first.")
        return

    # Load Model
    model = GRU(vocab_size=VOCAB_SIZE, hidden_dim=HIDDEN_DIM, embedding_dim=EMBEDDING_DIM, dropout=DROPOUT)
    if os.path.exists('spam_model.pth'):
        model.load_state_dict(torch.load('spam_model.pth'))
        model.eval()
    else:
        print("Warning: spam_model.pth not found. Run training script first.")

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    text = ' '.join([word for word in text.split() if word not in STOPWORDS])
    return text

def tokenize(text, word_to_idx):
    tokens = []
    for word in text.split():
        if word in word_to_idx:
            tokens.append(word_to_idx[word])
        # Ignore unknown words
    return tokens

def pad_and_truncate(tokens, max_length=30):
    features = np.zeros((1, max_length), dtype=int)
    if len(tokens):
        features[0, -len(tokens):] = tokens[:max_length]
    return features

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({'error': 'Model not loaded'}), 500
        
    data = request.get_json()
    email_text = data.get('email', '')
    
    if not email_text:
        return jsonify({'error': 'No email text provided'}), 400
        
    # Preprocess
    cleaned_text = clean_text(email_text)
    tokens = tokenize(cleaned_text, word_to_idx)
    inputs = pad_and_truncate(tokens, MAX_LENGTH)
    
    # Convert to tensor
    inputs_tensor = torch.tensor(inputs).to(torch.int64)
    h = torch.Tensor(np.zeros((1, HIDDEN_DIM)))
    
    # Predict
    with torch.no_grad():
        output, _ = model(inputs_tensor, h)
        score = output.item()
        
    prediction = "Spam" if score >= 0.5 else "Not Spam"
    confidence = score if score >= 0.5 else 1 - score
    
    return jsonify({
        'prediction': prediction,
        'confidence': f"{confidence:.2%}",
        'score': score
    })

@app.route('/health')
def health():
    """Health check endpoint for Docker"""
    if model is None:
        return jsonify({'status': 'unhealthy', 'reason': 'Model not loaded'}), 503
    return jsonify({'status': 'healthy'}), 200

@app.route('/stats')
def stats():
    try:
        if os.path.exists('train_data.csv'):
            df = pd.read_csv('train_data.csv')
            # Assuming 'target' column exists and has values like 'spam'/'ham' or 0/1
            # Adjust based on actual CSV content inspection if needed.
            # Based on previous `head` command, it has 'emails' and 'target'.
            # Let's check unique values to be safe, but for now assume standard.
            counts = df['target'].value_counts().to_dict()
            return jsonify(counts)
        else:
            return jsonify({'error': 'Training data not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    load_assets()
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 5001))
    # Use 0.0.0.0 to accept connections from outside container
    # Set debug=False for production use
    app.run(host='0.0.0.0', port=port, debug=False)

