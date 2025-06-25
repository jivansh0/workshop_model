import gspread
from google.oauth2.service_account import Credentials
from tabulate import tabulate
from datetime import datetime


SERVICE_ACCOUNT_FILE = r"C:\Users\jasle\Downloads\crudproject-463112-bf75339f029d.json"
SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

creds = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
client = gspread.authorize(creds)
sheet = client.open("inventory")


SHEET_MAP = {
    "sheet1": "Sheet1",
    "sheet2": "Sheet2",
    "sheet3": "Sheet3"
}


def get_ws(name):
    key = name.strip().lower()
    if key in SHEET_MAP:
        return sheet.worksheet(SHEET_MAP[key])
    raise ValueError(" Invalid sheet name.")

def print_tabular(sheet_name):
    try:
        ws = get_ws(sheet_name)
        data = ws.get_all_values()
        if data:
            print(f"\nSheet: {SHEET_MAP[sheet_name.strip().lower()]}")
            print(tabulate(data, headers="firstrow", tablefmt="grid"))
        else:
            print(f"{sheet_name} is empty.")
    except Exception as e:
        print(e)


def add_item():
    ws_inventory = get_ws("sheet1")
    ws_incoming = get_ws("sheet2")

    item_name = input("Item Name: ").strip()
    quantity = int(input("Quantity: ").strip())
    purchase_price = float(input("Purchase Price: ").strip())
    purchased_by = input("Purchased By: ").strip()
    date = datetime.now().strftime("%Y-%m-%d")
    selling_price = float(input("Selling Price: ").strip())

    data = ws_inventory.get_all_values()
    headers = data[0]
    item_col = [row[0].strip().lower() for row in data[1:]]
    updated = False

    for i, name in enumerate(item_col, start=2):
        if name == item_name.lower():
            existing = ws_inventory.row_values(i)
            new_qty = int(existing[1]) + quantity
            ws_inventory.update(f'A{i}:D{i}', [[existing[0], str(new_qty), str(purchase_price), str(selling_price)]])
            updated = True
            break

    if not updated:
        inventory_row = [item_name, str(quantity), str(purchase_price), str(selling_price)]
        ws_inventory.append_row(inventory_row)

    incoming_row = [item_name, str(quantity), str(purchase_price), purchased_by, date]
    ws_incoming.append_row(incoming_row)

    print("\n Item added/updated in Inventory and logged in Incoming tab.")

def delete_item():
    ws_inventory = get_ws("sheet1")
    ws_sales = get_ws("sheet3")

    item_name = input("Item Name to sell/delete: ").strip().lower()
    quantity_to_sell = int(input("Quantity to sell: ").strip())
    sold_to = input("Sold To: ").strip()
    date = datetime.now().strftime("%Y-%m-%d")

    data = ws_inventory.get_all_values()

    for i, row in enumerate(data[1:], start=2):
        if row[0].strip().lower() == item_name:
            current_qty = int(row[1])
            selling_price = float(row[3])

            if quantity_to_sell > current_qty:
                print(f"Cannot sell {quantity_to_sell}. Only {current_qty} in stock.")
                return

      
            ws_sales.append_row([row[0], str(quantity_to_sell), str(selling_price), sold_to, date])

            if quantity_to_sell == current_qty:
                ws_inventory.delete_rows(i)
                print(" Item sold completely and removed from inventory.")
            else:
                new_qty = current_qty - quantity_to_sell
                ws_inventory.update_cell(i, 2, str(new_qty))
                print(f" Sold {quantity_to_sell}. Remaining: {new_qty}")

            return

    print(" Item not found.")


def update_item():
    ws_inventory = get_ws("sheet1")
    item_name = input("Enter Item Name to update: ").strip().lower()
    data = ws_inventory.get_all_values()

    for i, row in enumerate(data[1:], start=2):
        if row[0].strip().lower() == item_name:
            print("\n Current Data:")
            print(tabulate([row], headers=data[0], tablefmt="grid"))

            print("\nWhat would you like to update?")
            print("1. Quantity")
            print("2. Purchase Price")
            print("3. Selling Price")
            choice = input("Enter choice (1/2/3): ").strip()

            if choice == '1':
                while True:
                    try:
                        new_quantity = int(input("Enter new Quantity: ").strip())
                        ws_inventory.update_cell(i, 2, str(new_quantity))
                        print(" Quantity updated.")
                        break
                    except ValueError:
                        print(" Please enter a valid number.")

            elif choice == '2':
                while True:
                    try:
                        new_purchase = float(input("Enter new Purchase Price: ").strip())
                        ws_inventory.update_cell(i, 3, str(new_purchase))
                        print("Purchase Price updated.")
                        break
                    except ValueError:
                        print(" Please enter a valid number.")

            elif choice == '3':
                while True:
                    try:
                        new_selling = float(input("Enter new Selling Price: ").strip())
                        ws_inventory.update_cell(i, 4, str(new_selling))
                        print(" Selling Price updated.")
                        break
                    except ValueError:
                        print(" Please enter a valid number.")

            else:
                print("Invalid choice.")
            return

    print(" Item not found.")


def view_item():
    ws_inventory = get_ws("sheet1")
    item_name = input("Enter item name to view: ").strip().lower()
    data = ws_inventory.get_all_values()
    headers = data[0]

    for row in data[1:]:
        if row[0].strip().lower() == item_name:
            print("\nItem details:")
            print(tabulate([row], headers=headers, tablefmt="grid"))
            return

    print(" Item not found.")


def main_menu():
    while True:
        print("\n===== Inventory Manager =====")
        print("1. Add Item")
        print("2. Delete Item (Sell)")
        print("3. Update Item")
        print("4. View Item")
        print("5. View Sheet (Sheet1/Sheet2/Sheet3)")
        print("6. Exit")

        choice = input("Select an option (1–6): ").strip()

        if choice == '1':
            add_item()
        elif choice == '2':
            delete_item()
        elif choice == '3':
            update_item()
        elif choice == '4':
            view_item()
        elif choice == '5':
            tab = input("Enter sheet name (Sheet1/Sheet2/Sheet3): ").strip()
            print_tabular(tab)
        elif choice == '6':
            print(" Exiting. Goodbye!")
            break
        else:
            print(" Invalid choice. Try again.")


if __name__ == "__main__":
    main_menu()
