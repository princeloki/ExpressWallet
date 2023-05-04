

import os
import sys
import json
import base64
import numpy as np
import pandas as pd
import pickle
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from tensorflow.keras.models import load_model



# Set the absolute path to the directory containing the files
abs_dir_path = "C:\\Users\\teriq\\OneDrive\\Documents\\returntocoding\\ExpressWallet\\Logic"

# Load the label encoder
with open(os.path.join(abs_dir_path, "label_encoder.pkl"), "rb") as f:
    label_encoder = pickle.load(f)

# Load the one-hot encoder
with open(os.path.join(abs_dir_path, "one_hot_encoder.pkl"), "rb") as f:
    one_hot_encoder = pickle.load(f)

# Load the known_merchants list
with open(os.path.join(abs_dir_path, "known_merchants.pkl"), "rb") as f:
    known_merchants = pickle.load(f)

# Load the MCC scaler
with open(os.path.join(abs_dir_path, "mcc_scaler.pkl"), "rb") as f:
    mcc_scaler = pickle.load(f)

# Load the model
loaded_model = load_model(os.path.join(abs_dir_path, "my_trained_model.h5"))



# Receive input data as a command-line argument
base64_data = sys.argv[1]

# Decode the base64 string back to JSON
input_data = json.loads(base64.b64decode(base64_data))
# Convert input data to a DataFrame
new_data = pd.DataFrame(input_data)


# Standardization for MCC codes
new_mcc_scaled = mcc_scaler.transform(new_data['mcc'].values.reshape(-1, 1))

# Assign "Unknown" category to new unseen merchant names
new_data['merchant_name'] = new_data['merchant_name'].apply(lambda x: 'Unknown' if x not in known_merchants else x)

# One-hot encode the merchant names for new data
new_merchant_encoded = one_hot_encoder.transform(new_data['merchant_name'].values.reshape(-1, 1))

# Add a new feature indicating if the merchant is unknown
new_data['is_unknown_merchant'] = new_data['merchant_name'].apply(lambda x: 1 if x == 'Unknown' else 0)

new_X = np.hstack([new_merchant_encoded.toarray(), new_mcc_scaled, new_data['is_unknown_merchant'].values.reshape(-1, 1)])
# Make predictions using the loaded model
probs = loaded_model.predict(new_X, verbose=0)

# Get the index of the highest probability for each transaction
predicted_indices = np.argmax(probs, axis=1)

# Convert the indices back to the original category names
predicted_categories = label_encoder.inverse_transform(predicted_indices)

# Return the predicted categories as JSON

print(json.dumps(predicted_categories.tolist()))
