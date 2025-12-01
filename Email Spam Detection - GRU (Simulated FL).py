import numpy as np
import warnings
import torch
from torch import nn, optim
import mlflow
import mlflow.pytorch
from torch.utils.data import TensorDataset, DataLoader
from sklearn.metrics import roc_auc_score
from sklearn.metrics import f1_score
from sklearn.metrics import accuracy_score
warnings.filterwarnings("ignore")

import json

inputs = np.load('./data/inputs.npy')
labels = np.load('./data/labels.npy')

# Load vocabulary to get consistent VOCAB_SIZE
with open('word_to_idx.json', 'r') as f:
    word_to_idx = json.load(f)
VOCAB_SIZE = len(word_to_idx) + 1

# Training params
EPOCHS = 30
CLIP = 5 # gradient clipping - to avoid gradient explosion (frequent in RNNs)
lr = 0.1
BATCH_SIZE = 32  # we follow mini batch gradient descent to ensure faster convergence

# Model params
EMBEDDING_DIM = 50
HIDDEN_DIM = 30
DROPOUT = 0.2

# import syft as sy # REMOVED

# Load data from client folders
clients = ['Client_1', 'Client_2', 'Client_3']
train_loaders = []
test_loaders = []

for client in clients:
    client_path = f'./Data/{client}'
    c_inputs = np.load(f'{client_path}/inputs.npy')
    c_labels = np.load(f'{client_path}/labels.npy')
    
    c_inputs = torch.tensor(c_inputs).to(torch.int64)
    c_labels = torch.tensor(c_labels).to(torch.int64)
    
    # Split train/test for this client
    pct_test = 0.2
    split_idx = int(len(c_labels) * (1 - pct_test))
    
    train_inputs_c = c_inputs[:split_idx]
    train_labels_c = c_labels[:split_idx]
    test_inputs_c = c_inputs[split_idx:]
    test_labels_c = c_labels[split_idx:]
    
    train_dataset = TensorDataset(train_inputs_c, train_labels_c)
    test_dataset = TensorDataset(test_inputs_c, test_labels_c)
    
    train_loaders.append(DataLoader(train_dataset, shuffle=True, batch_size=BATCH_SIZE))
    test_loaders.append(DataLoader(test_dataset, shuffle=False, batch_size=BATCH_SIZE))

from Selfmade_GRU import GRU

# Initiating the model
model = GRU(vocab_size=VOCAB_SIZE, hidden_dim=HIDDEN_DIM, embedding_dim=EMBEDDING_DIM, dropout=DROPOUT)

# Defining loss and optimizer
# Use reduction='none' to apply manual weights
criterion = nn.BCELoss(reduction='none')
optimizer = optim.SGD(model.parameters(), lr=lr)

# Calculate positive weight for spam class
num_spam = labels.sum()
num_ham = len(labels) - num_spam
pos_weight = num_ham / num_spam
print(f"Using Positive Weight: {pos_weight:.2f}")

mlflow.set_experiment("Federated_Spam_Detection_GRU")
mlflow.start_run()
mlflow.log_param("epochs", EPOCHS)
mlflow.log_param("batch_size", BATCH_SIZE)
mlflow.log_param("lr", lr)
mlflow.log_param("embedding_dim", EMBEDDING_DIM)
mlflow.log_param("hidden_dim", HIDDEN_DIM)
mlflow.log_param("dropout", DROPOUT)
mlflow.log_param("pos_weight", pos_weight)

for e in range(EPOCHS):
    
    ######### Training ##########
    
    losses = []
    # Batch loop
    # for inputs, labels in federated_train_loader:
    
    # Iterate through each worker's data
    for loader_idx, loader in enumerate(train_loaders):
        for inputs, labels in loader:
            # Location of current batch
            # worker = inputs.location # REMOVED
            
            # Initialize hidden state and send it to worker
            # h = torch.Tensor(np.zeros((BATCH_SIZE, HIDDEN_DIM))).send(worker) # REMOVED
            h = torch.Tensor(np.zeros((BATCH_SIZE, HIDDEN_DIM)))
            
            # Send model to current worker
            # model.send(worker) # REMOVED
            
            # Setting accumulated gradients to zero before backward step
            optimizer.zero_grad()
            # Output from the model
            output, _ = model(inputs, h)
            
            # Calculate the loss and perform backprop
            # Weighted Loss
            loss_unreduced = criterion(output.squeeze(), labels.float())
            weights = labels.float() * (pos_weight - 1) + 1
            loss = (loss_unreduced * weights).mean()
            
            loss.backward()
            # Clipping the gradient to avoid explosion
            nn.utils.clip_grad_norm_(model.parameters(), CLIP)
            # Backpropagation step
            optimizer.step() 
            # Get the model back to the local worker
            # model.get() # REMOVED
            # losses.append(loss.get()) # REMOVED
            losses.append(loss.item())
    
    ######## Evaluation ##########
    
    # Model in evaluation mode
    model.eval()

    with torch.no_grad():
        test_preds = []
        test_labels_list = []
        eval_losses = []

        # for inputs, labels in federated_test_loader:
        for loader in test_loaders:
            for inputs, labels in loader:
                # get current location
                # worker = inputs.location # REMOVED
                # Initialize hidden state and send it to worker
                # h = torch.Tensor(np.zeros((BATCH_SIZE, HIDDEN_DIM))).send(worker) # REMOVED
                h = torch.Tensor(np.zeros((BATCH_SIZE, HIDDEN_DIM)))
                # Send model to worker
                # model.send(worker) # REMOVED
                
                output, _ = model(inputs, h)
                # loss = criterion(output.squeeze(), labels.float())
                loss_unreduced = criterion(output.squeeze(), labels.float())
                weights = labels.float() * (pos_weight - 1) + 1
                loss = (loss_unreduced * weights).mean()
                
                # eval_losses.append(loss.get()) # REMOVED
                eval_losses.append(loss.item())
                # preds = output.squeeze().get() # REMOVED
                preds = output.squeeze()
                test_preds += list(preds.numpy())
                # test_labels_list += list(labels.get().numpy().astype(int)) # REMOVED
                test_labels_list += list(labels.numpy().astype(int))
                # Get the model back to the local worker
                # model.get() # REMOVED
        
        score = roc_auc_score(test_labels_list, test_preds)
        test_preds_2 = []
        for i in range(0,len(test_preds)):
            if test_preds[i] < 0.5:
                test_preds_2.append(0)
            else:
                test_preds_2.append(1)
        acc = accuracy_score(test_labels_list, test_preds_2)
        f1 = f1_score(test_labels_list, test_preds_2)

    
    print("Epoch {}/{}...  \
    AUC_ROC Score: {:.3%}...  \
    Validation Accuracy: {:.3%}...  \
    F1 Score: {:.5f}...  \
    Training loss: {:.5f}...  \
    Validation loss: {:.5f}".format(e+1, EPOCHS, score, acc, f1, sum(losses)/len(losses), sum(eval_losses)/len(eval_losses)))
    
    mlflow.log_metric("auc_roc", score, step=e)
    mlflow.log_metric("accuracy", acc, step=e)
    mlflow.log_metric("f1_score", f1, step=e)
    mlflow.log_metric("train_loss", sum(losses)/len(losses), step=e)
    mlflow.log_metric("val_loss", sum(eval_losses)/len(eval_losses), step=e)
    
    model.train()

torch.save(model.state_dict(), 'spam_model.pth')
mlflow.pytorch.log_model(model, "model")
mlflow.end_run()
