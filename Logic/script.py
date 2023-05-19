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
    """
    Adjusts the expenses based on the remaining balance and adjustment percentages.
    """
    remaining_balance = balance
    if remaining_balance < 0:
        priority_mapping = {'L': 1, 'N': 2, 'H': 3}  # Define the priority mapping
        sorted_expenses = sorted(expenses, key=lambda x: (priority_mapping[x.priority], -x.amount))  # Use the mapping in sorting
        priorities = ['L', 'N', 'H']  # List of priorities in the order of adjustment
        for priority in priorities:
            i = 0
            while i < len(sorted_expenses):
                expense = expenses[i]
                if expense.priority != priority or expense.state == "F":
                    i += 1
                    continue
                if remaining_balance >= 0:
                    break
                adjustment_percentage = adjustment_percentages[expense.priority]
                reduction_amount = expense.amount * adjustment_percentage
                expense.amount *= (1 - adjustment_percentage)
                remaining_balance += reduction_amount
                if round(expense.amount) <= 0:
                    i += 1
    return expenses, remaining_balance


def create_expenses_from_dict(expense_dict):
    """
    Creates Expense objects from the expense dictionary.
    """
    expenses = []
    for priority, expense_list in expense_dict.items():
        for attributes in expense_list:
            expense = Expense(attributes["expense"], attributes["amount"], priority, attributes["state"])
            expenses.append(expense)
    return expenses


def get_adjustment_percentages(priority_data):
    """
    Retrieves adjustment percentages from the priority data.
    """
    adjustment_percentages = {}
    for item in priority_data:
        priority_name = item["priority_name"]
        percentage = item["percentage"] / 100  # Convert the percentage to a decimal value
        adjustment_percentages[priority_name] = percentage
    return adjustment_percentages


def total_adjustable_expenses(expenses):
    """
    Calculates the total amount of adjustable expenses.
    """
    total = 0
    for expense in expenses:
        if expense.state != "F":
            total += expense.amount
    return total


def main(expense_dict, remaining_balance, adjustment_percentages, rembudget, balance, alert):
    """
    Main function to handle the adjustment process.
    """
    expenses = create_expenses_from_dict(expense_dict)
    total_adjustable = total_adjustable_expenses(expenses)
    
    if rembudget >= ((100 - alert) / 100) * balance and remaining_balance >= 0:
        result_dict = {
            "message": "At risk",
            "adjusted_expenses": []
        }
        result_json = json.dumps(result_dict)
        print(result_json)
    elif remaining_balance >= 0 and rembudget <= ((100 - alert) / 100) * balance:
        result_dict = {
            "message": "Nothing to adjust",
            "adjusted_expenses": []
        }
        result_json = json.dumps(result_dict)
        print(result_json)
    elif abs(remaining_balance) > total_adjustable:
        result_message = {"message": "Not adjustable", "adjusted_expenses": []}
        result_json = json.dumps(result_message)
        print(result_json)
    else:
        adjusted_expenses, adjusted_balance = adjust(expenses, remaining_balance, adjustment_percentages)
        adjusted_expenses_list = [expense.__dict__ for expense in adjusted_expenses]

        result_dict = {
            "message": "Success",
            "adjusted_expenses": adjusted_expenses_list,
            "adjusted_balance": adjusted_balance
        }
        result_json = json.dumps(result_dict)
        print(result_json)

if __name__ == "__main__":
    json_base64_str = sys.argv[1]
    json_str = base64.b64decode(json_base64_str).decode('utf-8')
    expense_dict = json.loads(json_str)

    balance = float(sys.argv[2])



    adj_base64 = sys.argv[3]
    adj = json.loads(base64.b64decode(adj_base64).decode('utf-8'))
    
    remBudget = float(sys.argv[4])
    actual_balance = float(sys.argv[5])
    alert = int(sys.argv[6])

    
    adjustment_percentages = get_adjustment_percentages(adj)
    main(expense_dict, balance, adjustment_percentages, remBudget, actual_balance, alert)


