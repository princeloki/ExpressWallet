

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



def main(expense_dict, earnings, adjustment_percentages):
    expenses = create_expenses_from_dict(expense_dict)
    remaining_balance = earnings - sum([expense.amount for expense in expenses])

    adjusted_expenses, adjusted_balance = adjust(expenses, remaining_balance, adjustment_percentages)
    
    # Convert adjusted expenses back to a list of dictionaries
    adjusted_expenses_list = [expense.__dict__ for expense in adjusted_expenses]
    
    # Create the result dictionary with adjusted expenses and adjusted balance
    result_dict = {
        "adjusted_expenses": adjusted_expenses_list,
        "adjusted_balance": adjusted_balance
    }
    
    # Convert the result dictionary to a JSON string and print it
    result_json = json.dumps(result_dict)
    print(result_json)


if __name__ == "__main__":
    json_base64_str = sys.argv[1]
    json_str = base64.b64decode(json_base64_str).decode('utf-8')
    expense_dict = json.loads(json_str)

    earnings = int(sys.argv[2])
    adjustment_percentages = {
        "H": 0.1,  # High priority adjustment percentage
        "N": 0.2,  # Normal priority adjustment percentage
        "L": 0.3   # Low priority adjustment percentage
    }

    main(expense_dict, earnings, adjustment_percentages)



