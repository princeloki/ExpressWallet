import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
from sklearn.tree import DecisionTreeClassifier
import pickle

# Load your dataset
data = pd.read_csv("transactions.csv")
data['mcc'].fillna(data['mcc'].mean(), inplace=True)

# Extract MCC, merchant_name, category, and expense columns
data = data[['mcc', 'merchant_name', 'category', 'expense']]

# Standardize the MCC values
mcc_scaler = StandardScaler()
data['mcc'] = mcc_scaler.fit_transform(data['mcc'].values.reshape(-1, 1))

# Create a list of known merchant names based on the most frequent ones in the dataset
top_n_merchants = 100
merchant_counts = data['merchant_name'].value_counts()
known_merchants = list(merchant_counts.head(top_n_merchants).index)

# One-hot encode the merchant names
merchant_encoder = OneHotEncoder(handle_unknown='ignore')
data['merchant_name'] = data['merchant_name'].apply(lambda x: 'Unknown' if x not in known_merchants else x)
merchant_name_encoded = merchant_encoder.fit_transform(data['merchant_name'].values.reshape(-1, 1))

# One-hot encode the category values
category_encoder = OneHotEncoder(handle_unknown='ignore')
category_encoded = category_encoder.fit_transform(data['category'].values.reshape(-1, 1))

# Encode the expense values
expense_encoder = LabelEncoder()
data['expense'] = expense_encoder.fit_transform(data['expense'])

# Add a new feature indicating if the merchant is unknown
data['is_unknown_merchant'] = data['merchant_name'].apply(lambda x: 1 if x == 'Unknown' else 0)

# Combine all features
X = np.hstack((merchant_name_encoded.toarray(), data['mcc'].values.reshape(-1, 1), data['is_unknown_merchant'].values.reshape(-1, 1), category_encoded.toarray()))
y = data['expense']

# Split the dataset into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define the decision tree model
model = DecisionTreeClassifier(random_state=42)

# Train the model
model.fit(X_train, y_train)

# Evaluate the model on the test set
test_acc = model.score(X_test, y_test)
print(f'Test accuracy: {test_acc:.4f}')

# Get feature importance
importances = model.feature_importances_

# Generate feature names
feature_names = list(merchant_encoder.get_feature_names_out(['merchant_name'])) + ['mcc', 'is_unknown_merchant'] + list \
    (category_encoder.get_feature_names_out(['category']))

# Make sure the lengths of feature_names and importances match
assert len(feature_names) == len(importances), "Lengths of feature names and importances do not match."

# Create a DataFrame to display feature importances
importance_df = pd.DataFrame({
    'feature': feature_names,
    'importance': importances
})

# Sort by importance
importance_df = importance_df.sort_values('importance', ascending=False)

print(importance_df)

# Save the model and encoders to files
with open("my_trained_model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("mcc_scaler.pkl", "wb") as f:
    pickle.dump(mcc_scaler, f)

with open("category_encoder.pkl", "wb") as f:
    pickle.dump(category_encoder, f)

with open("expense_encoder.pkl", "wb") as f:
    pickle.dump(expense_encoder, f)

with open("merchant_encoder.pkl", "wb") as f:
    pickle.dump(merchant_encoder, f)

with open("known_merchants.pkl", "wb") as f:
    pickle.dump(known_merchants, f)

