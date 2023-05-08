import sys
import json
import pandas as pd
from mlxtend.frequent_patterns import apriori
from mlxtend.preprocessing import TransactionEncoder
from collections import defaultdict

# Helper function to extract values from item list
def extract_values(item, columns):
    merchant_name = None
    category = None

    for value in item:
        if value in columns['merchant_name']:
            merchant_name = value
        elif value in columns['category']:
            category = value

    return merchant_name, category

# Read the transaction data from stdin
data = json.load(sys.stdin)
transactions = data["transactions"]

min_count = 2
min_support = min_count / len(transactions)

# Convert the transaction data into a list of itemsets
itemsets = []
columns = {
    'merchant_name': set(),
    'category': set(),
}
for transaction in transactions:
    itemset = [
        transaction['merchant_name'],
        transaction['category'],
    ]
    columns['merchant_name'].add(transaction['merchant_name'])
    columns['category'].add(transaction['category'])
    itemsets.append(itemset)

# Convert the itemsets into a one-hot encoded format
te = TransactionEncoder()
te_ary = te.fit(itemsets).transform(itemsets)
df = pd.DataFrame(te_ary, columns=te.columns_)

# Find frequent itemsets using the apriori algorithm
frequent_itemsets = apriori(df, min_support=min_support, use_colnames=True)

# Create a list to store the frequent items
frequent_items_list = []

# Find the specific frequent item and its average amount
for index, row in frequent_itemsets.iterrows():
    item = list(row['itemsets'])
    merchant_name, category = extract_values(item, columns)
    
    if merchant_name is not None and category is not None:
        support = row['support']
        total_amount = 0
        count = 0

        for transaction in transactions:
            if transaction['merchant_name'] == merchant_name and transaction['category'] == category:
                total_amount += transaction['amount']
                count += 1

        if count > 0:
            avg_amount = total_amount / count
        else:
            avg_amount = 0

        # Add the frequent item data to the list
        frequent_items_list.append({
            "merchant_name": merchant_name,
            "category": category,
            "average_amount": avg_amount,
            "support": support
        })

# Convert the list to a JSON object and print it to stdout
json_output = json.dumps(frequent_items_list)
print(json_output)

