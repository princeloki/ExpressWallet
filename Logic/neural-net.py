

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
import pickle

# Load your dataset
data = pd.read_csv("transactions.csv")

# Extract MCC, merchant_name, and category columns
data = data[['mcc', 'merchant_name', 'category']]

# Standardize the MCC values
mcc_scaler = StandardScaler()
data['mcc'] = mcc_scaler.fit_transform(data['mcc'].values.reshape(-1, 1))

# Create a list of known merchant names based on the most frequent ones in the dataset
top_n_merchants = 100  # You can change this value according to your needs
merchant_counts = data['merchant_name'].value_counts()
known_merchants = list(merchant_counts.head(top_n_merchants).index)

# One-hot encode the merchant names
one_hot_encoder = OneHotEncoder(handle_unknown='ignore')
data['merchant_name'] = data['merchant_name'].apply(lambda x: 'Unknown' if x not in known_merchants else x)
merchant_name_encoded = one_hot_encoder.fit_transform(data['merchant_name'].values.reshape(-1, 1))

# Add a new feature indicating if the merchant is unknown
data['is_unknown_merchant'] = data['merchant_name'].apply(lambda x: 1 if x == 'Unknown' else 0)

# Encode the categories
label_encoder = LabelEncoder()
data['category'] = label_encoder.fit_transform(data['category'])

# Combine MCC values, one-hot encoded merchant names, and is_unknown_merchant feature
X = np.hstack([merchant_name_encoded.toarray(), data['mcc'].values.reshape(-1, 1), data['is_unknown_merchant'].values.reshape(-1, 1)])
y = data['category']

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define the neural network model
model = Sequential()
model.add(Dense(32, activation='relu', input_shape=(X_train.shape[1],)))
model.add(Dense(16, activation='relu'))
model.add(Dense(len(label_encoder.classes_), activation='softmax'))

# Compile the model
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(X_train, y_train, epochs=100, batch_size=32, validation_data=(X_test, y_test))

# Evaluate the model on the test set
test_loss, test_acc = model.evaluate(X_test, y_test, verbose=2)
print(f'Test accuracy: {test_acc:.4f}')
# Save the model and encoders to files

model.save("my_trained_model.h5")

with open("label_encoder.pkl", "wb") as f:
    pickle.dump(label_encoder, f)

with open("one_hot_encoder.pkl", "wb") as f:
    pickle.dump(one_hot_encoder, f)

with open("known_merchants.pkl", "wb") as f:
    pickle.dump(known_merchants, f)

with open("mcc_scaler.pkl", "wb") as f:
    pickle.dump(mcc_scaler, f)
