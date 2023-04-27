

import sys
import json
import base64

class Expense:
    def __init__(self, name, amount, priority, state):
        self.name = name
        self.amount = amount
        self.priority = priority
        self.state = state

    def __repr__(self):
        return f"{self.name}: {self.amount} ({self.priority}, {self.state})"


def adjust(expenses, balance, adjustment_percentages):
    remaining_balance = balance
    if remaining_balance < 0:
        sorted_expenses = sorted(expenses, key=lambda x: (x.priority, -x.amount))
        while remaining_balance < 0:
            for expense in sorted_expenses:
                if expense.state == "F" and (expense.priority == "H" or expense.priority == "N"):
                    pass
                elif expense.state == "F" and expense.priority == "L":
                    pass
                else:
                    reduction_amount = 0
                    adjustment_percentage = adjustment_percentages[expense.priority]
                    reduction_amount = min(expense.amount, abs(remaining_balance), expense.amount * adjustment_percentage)
                    expense.amount -= reduction_amount
                    remaining_balance += reduction_amount
                    if expense.amount <= 0:
                        expenses.remove(expense)
                    if remaining_balance >= 0:
                        break

    return expenses, remaining_balance


def create_expenses_from_dict(expense_dict):
    expenses = []
    for priority, expense_list in expense_dict.items():
        for attributes in expense_list:
            expense = Expense(attributes["expense"], attributes["amount"], priority, attributes["state"])
            expenses.append(expense)
    return expenses

def get_adjustment_percentages(priority_data):
    adjustment_percentages = {}
    for item in priority_data:
        priority_name = item["priority_name"]
        percentage = item["percentage"] / 100  # Convert the percentage to a decimal value
        adjustment_percentages[priority_name] = percentage
    return adjustment_percentages


def main(expense_dict, earnings, adjustment_percentages):
    expenses = create_expenses_from_dict(expense_dict)
    remaining_balance = earnings - sum([expense.amount for expense in expenses])

    adjusted_expenses, adjusted_balance = adjust(expenses, remaining_balance, adjustment_percentages)
    adjusted_expenses_list = [expense.__dict__ for expense in adjusted_expenses]
    
    result_dict = {
        "adjusted_expenses": adjusted_expenses_list,
        "adjusted_balance": adjusted_balance
    }
    result_json = json.dumps(result_dict)
    print(result_json)


if __name__ == "__main__":
    json_base64_str = sys.argv[1]
    json_str = base64.b64decode(json_base64_str).decode('utf-8')
    expense_dict = json.loads(json_str)

    earnings = int(sys.argv[2])
    
    adj_base64 = sys.argv[3]
    adj = json.loads(base64.b64decode(adj_base64).decode('utf-8'))
    
    adjustment_percentages = get_adjustment_percentages(adj)


    main(expense_dict, earnings, adjustment_percentages)



