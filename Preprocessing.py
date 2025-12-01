import numpy as np
import pandas as pd
import re #class for regular expression
from nltk.corpus import stopwords
import os
import json

# stopwords are wirds like the, is etc. that do not have any importance while classifying emails as spam or not
STOPWORDS = set([])  # set(stopwords.words('english'))

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)  # eliminate single letter words and white spaces
    text = ' '.join([word for word in text.split() if word not in STOPWORDS]) # removing the stop words
    return text


def tokenize(text, word_to_idx):
    tokens = [] # list of tokens i.e. words when converted to ids
    for word in text.split():
        tokens.append(word_to_idx[word])
    return tokens


def pad_and_truncate(messages, max_length=30):
    features = np.zeros((len(messages), max_length), dtype=int)
    for i, email in enumerate(messages):
        if len(email):
            features[i, -len(email):] = email[:max_length]
    return features


if __name__ == '__main__':
    #to read from the text file
    #data = pd.read_csv('./data/EmailSpamCollection.txt', sep='\t', header=None, names=['label', 'email'])  
    #to read from a csv file
    data = pd.read_csv('./data/EmailSpamCollection-mini.csv', names=['label', 'email'])
    data.email = data.email.astype(str) # to avoid pandas to consider email text as floating point numbers
    data.email = data.email.apply(clean_text)
    words = set((' '.join(data.email)).split())
    word_to_idx = {word: i for i, word in enumerate(words, 1)}
    
    # Save vocabulary
    with open('word_to_idx.json', 'w') as f:
        json.dump(word_to_idx, f)
        
    tokens = data.email.apply(lambda x: tokenize(x, word_to_idx))
    inputs = pad_and_truncate(tokens)

    labels = np.array((data.label == 'spam').astype(int))

    labels = np.array((data.label == 'spam').astype(int))

    # Split data into 3 clients
    n_samples = len(labels)
    idx1 = int(n_samples / 3)
    idx2 = int(n_samples * 2 / 3)

    clients = ['Client_1', 'Client_2', 'Client_3']
    splits = [
        (inputs[:idx1], labels[:idx1]),
        (inputs[idx1:idx2], labels[idx1:idx2]),
        (inputs[idx2:], labels[idx2:])
    ]

    for client, (client_inputs, client_labels) in zip(clients, splits):
        client_dir = os.path.join('./Data', client)
        if not os.path.exists(client_dir):
            os.makedirs(client_dir)
        
        np.save(os.path.join(client_dir, 'inputs.npy'), client_inputs)
        np.save(os.path.join(client_dir, 'labels.npy'), client_labels)
        print(f"Saved data for {client} in {client_dir}")

    # Keep original for reference if needed, or remove
    np.save('./Data/labels.npy', labels)
    np.save('./Data/inputs.npy', inputs)
