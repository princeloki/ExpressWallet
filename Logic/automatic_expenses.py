import sys
import json
import pandas as pd
from mlxtend.frequent_patterns import apriori
from mlxtend.preprocessing import TransactionEncoder

# Helper function to extract values from item list

min_count = 2  # You can set this to any desired value

# Calculate the minimum support value
def extract_values(item, columns):
    merchant_name = None
    category = None
    amount = None

    for value in item:
        if value in columns['merchant_name']:
            merchant_name = value
        elif value in columns['category']:
            category = value
        elif value in columns['amount']:
            amount = value
    
    return merchant_name, category, amount

# Read the transaction data from stdin
data = json.load(sys.stdin)
transactions = data["transactions"]

min_support = min_count / len(transactions)
# Convert the transaction data into a list of itemsets
itemsets = []
columns = {
    'merchant_name': set(),
    'category': set(),
    'amount': set(),
}
for transaction in transactions:
    itemset = [
        transaction['merchant_name'],
        transaction['category'],
        str(transaction['date']),
        str(transaction['amount']),
    ]
    columns['merchant_name'].add(transaction['merchant_name'])
    columns['category'].add(transaction['category'])
    columns['amount'].add(str(transaction['amount']))
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
    merchant_name, category, amount = extract_values(item, columns)
    
    if merchant_name is not None and category is not None and amount is not None:  # Check if all three values are not None
        support = row['support']
        total_amount = 0
        count = 0
        for transaction in transactions:
            if transaction['merchant_name'] == merchant_name and transaction['category'] == category and str(transaction['amount']) == amount:
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
            "amount": amount,
            "average_amount": avg_amount,
            "support": support
        })

# Convert the list to a JSON object and print it to stdout
json_output = json.dumps(frequent_items_list)
print(json_output)
