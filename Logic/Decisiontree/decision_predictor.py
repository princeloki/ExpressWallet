import os
import sys
import json
import base64
import numpy as np
import pandas as pd
import pickle
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# Set the absolute path to the directory containing the files
abs_dir_path = "C:\\Users\\teriq\\OneDrive\\Documents\\returntocoding\\ExpressWallet\\Logic\\Decisiontree"

# Load the encoders, known_merchants list, and mcc_mean
with open(os.path.join(abs_dir_path, "merchant_encoder.pkl"), "rb") as f:
    merchant_encoder = pickle.load(f)

with open(os.path.join(abs_dir_path, "expense_encoder.pkl"), "rb") as f:
    expense_encoder = pickle.load(f)

with open(os.path.join(abs_dir_path, "category_encoder.pkl"), "rb") as f:
    category_encoder = pickle.load(f)

with open(os.path.join(abs_dir_path, "label_encoder.pkl"), "rb") as f:
    label_encoder = pickle.load(f)

with open(os.path.join(abs_dir_path, "mcc_scaler.pkl"), "rb") as f:
    mcc_scaler = pickle.load(f)

with open(os.path.join(abs_dir_path, "known_merchants.pkl"), "rb") as f:
    known_merchants = pickle.load(f)

with open(os.path.join(abs_dir_path, "mcc_mean.pkl"), "rb") as f:
    mcc_mean = pickle.load(f)

with open(os.path.join(abs_dir_path, 'category_frequency_bins.pkl'), 'rb') as f:
    category_frequency_bins = pickle.load(f)

# Load the model
with open(os.path.join(abs_dir_path, "my_trained_model.pkl"), "rb") as f:
    loaded_model = pickle.load(f)

# Receive input data as a command-line argument
base64_data = sys.argv[1]

# Decode the base64 string back to JSON
input_data = json.loads(base64.b64decode(base64_data))

# Convert input data to a DataFrame
new_data = pd.DataFrame(input_data)

# Create a new feature indicating if the MCC code is unknown
new_data['unknown_mcc'] = new_data['mcc'].isna().astype(int)

# Fill NA in MCC codes with mcc_mean
new_data['mcc'].fillna(mcc_mean, inplace=True)

# Standardization for MCC codes
new_mcc_scaled = mcc_scaler.transform(new_data['mcc'].values.reshape(-1, 1))

# Assign "Unknown" category to new unseen merchant names
new_data['merchant_name'] = new_data['merchant_name'].apply(lambda x: 'Unknown' if x not in known_merchants else x)

# One-hot encode the merchant names for new data
new_merchant_encoded = merchant_encoder.transform(new_data['merchant_name'].values.reshape(-1, 1))

# Add a new feature indicating if the merchant is unknown
new_data['is_unknown_merchant'] = new_data['merchant_name'].apply(lambda x: 1 if x == 'Unknown' else 0)


# Map the categories of the new data to their frequency bins
new_data['category'] = new_data['category'].map(category_frequency_bins).fillna('Medium Frequency')


# One-hot encode the category for new data
new_category_encoded = category_encoder.transform(new_data['category'].values.reshape(-1, 1))

# Combine the features
new_X = np.hstack((new_merchant_encoded.toarray(), new_data['mcc'].values.reshape(-1, 1), new_data['unknown_mcc'].values.reshape(-1, 1), new_data['is_unknown_merchant'].values.reshape(-1, 1), new_category_encoded.toarray()))

# Convert the indices back to the original category names
predicted_expenses = expense_encoder.inverse_transform(loaded_model.predict(new_X))

# Return the predicted expenses as JSON
print(json.dumps(predicted_expenses.tolist()))
