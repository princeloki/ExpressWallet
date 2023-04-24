import json
import pandas as pd
from mlxtend.frequent_patterns import apriori
from mlxtend.preprocessing import TransactionEncoder

# Read the transaction data from JSON file
with open('transactions.json') as f:
    data = json.load(f)
transactions = data['transactions']

# Convert the transaction data into a list of itemsets
itemsets = []
for transaction in transactions:
    itemset = [transaction['merchant_name'], transaction['item_category']]
    itemsets.append(itemset)

# Convert the itemsets into a one-hot encoded format
te = TransactionEncoder()
te_ary = te.fit(itemsets).transform(itemsets)
df = pd.DataFrame(te_ary, columns=te.columns_)

# Find frequent itemsets using the apriori algorithm
frequent_itemsets = apriori(df, min_support=0.2, use_colnames=True)

# Find the specific frequent item and its average amount
for index, row in frequent_itemsets.iterrows():
    item = list(row['itemsets'])
    support = row['support']
    total_amount = 0
    count = 0
    for transaction in transactions:
        # print(item,transaction)
        if len(item) == 1:
            if transaction['item_category'] == item[0]:
                total_amount += transaction['transaction_amount']
                count += 1
        else:
            if transaction['merchant_name'] == item[0] and transaction['item_category'] == item[1]:
                total_amount += transaction['transaction_amount']
                count += 1
    if count > 0:
        avg_amount = total_amount / count
    else:
        avg_amount = 0
    print("Frequent item:", item, "Average amount:", avg_amount, "Support:", support)
