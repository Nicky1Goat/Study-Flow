#!/usr/bin/env python3
"""Generate the workbook spec for the Ocean & Teal budget paycheck tracker.

Writes budget-paycheck-tracker.spec.json, which scripts/build_xlsx.py renders
into the styled .xlsx (the sheetsmith pipeline).
"""
import json

# ---- Ocean & Teal theme ----------------------------------------------------
TEAL, SKY, NAVY, SAND = "4E9C9C", "A8D0D0", "2E4A57", "F0EBE1"
TEAL_D, TINT, SAND_L = "3E7A82", "EAF3F2", "F5F1E8"

theme = {
    "accent": TEAL,
    "header_font": "FFFFFF",
    "border": "CBDCDC",
    "section_colors": [NAVY, TEAL, TEAL_D, "5B9AA0", NAVY],
    "body_tints": [TINT, SAND, "E6F0F0", SAND_L, TINT],
    "chart_palette": [TEAL, SKY, NAVY, "7FB8BE", "6FA8AE", "BFE0DE", TEAL_D, "8FC0C0"],
}

HEADER = {"bold": True, "fill": NAVY, "font_color": "FFFFFF"}
BAND = {"enabled": True, "color": TINT}
MONEY = "#,##0.00"
PCT = "0.0%"
PCT2 = "0.00%"
DATEF = 'd" "mmm" "yyyy'


def bar(rng, label, color, font="FFFFFF", size=11, align="center"):
    return {"range": rng, "label": label, "color": color, "font_color": font, "size": size, "align": align}


# ===========================================================================
# 1. COVER
guide = [
    ("1  ·  Instructions", "how to set everything up"),
    ("2  ·  Paycheck", "your gross pay → take-home"),
    ("3  ·  Budget", "give every dollar a job"),
    ("4  ·  Paycheck Log", "track all 26 paydays"),
    ("5  ·  Savings Goals", "hit every target"),
    ("6  ·  Debt Payoff", "watch balances shrink"),
    ("7  ·  Dashboard", "your money at a glance"),
]
cover_bars = [
    bar("B3:E5", "BUDGET  BY  PAYCHECK", NAVY, size=26),
    bar("B6:E6", "Bi-Weekly Budget & Savings Tracker", TEAL, size=14),
    bar("B8:E8", "WHAT'S  INSIDE", TEAL_D, size=12, align="left"),
]
for i, (name, desc) in enumerate(guide):
    fill = SAND_L if i % 2 else TINT
    cover_bars.append(bar(f"B{9+i}:E{9+i}", f"   {name}   —   {desc}", fill, font=NAVY, size=11, align="left"))
cover_bars.append(bar("B17:E17", "♡   Thank you for your purchase   ·   made with care", TEAL, size=12))

cover = {
    "name": "Cover", "columns": [], "hide_gridlines": True, "row_height": 22,
    "column_widths": {"A": 3, "B": 4, "C": 24, "D": 24, "E": 24, "F": 4},
    "fills": [{"range": "B2:E18", "color": SAND}],
    "section_bars": cover_bars,
}

# ===========================================================================
# 2. HOW-TO
howto = {
    "name": "How-to", "freeze": "A2",
    "columns": [
        {"header": "Step", "key": "step", "width": 8},
        {"header": "What to do", "key": "txt", "width": 92},
    ],
    "rows": [
        {"step": "1", "txt": "Paycheck tab: enter your gross pay and each deduction. Your take-home pay calculates itself."},
        {"step": "2", "txt": "Budget tab: set a Budgeted amount per category. Aim to keep 'Left to allocate' at 0."},
        {"step": "3", "txt": "Paycheck Log: each payday, type what you Spent. Saved and Cumulative saved fill in for you."},
        {"step": "4", "txt": "Savings Goals: set a Target for each goal. The progress bar fills as your Saved amount grows."},
        {"step": "5", "txt": "Debt Payoff: enter starting and current balances. Watch '% paid' and total debt move."},
        {"step": "6", "txt": "Dashboard: open it any time for your take-home, savings rate, debt, and charts."},
        {"step": "7", "txt": "Only the shaded input cells need you — every total, percentage, and chart updates automatically."},
    ],
    "styles": {"header": HEADER, "banding": BAND},
}

# ===========================================================================
# 3. PAYCHECK
paycheck = {
    "name": "Paycheck", "freeze": "A2",
    "columns": [
        {"header": "Item", "key": "item", "width": 34},
        {"header": "Per paycheck", "key": "amount", "width": 15, "number_format": MONEY},
        {"header": "Per year (×26)", "key": "annual", "width": 15, "number_format": MONEY},
    ],
    "rows": [
        {"item": "Gross pay", "amount": 2200},
        {"item": "Federal tax", "amount": 264},
        {"item": "State tax", "amount": 88},
        {"item": "FICA (Social Security + Medicare)", "amount": 168},
        {"item": "Health insurance", "amount": 95},
        {"item": "401(k) retirement", "amount": 132},
        {"item": "Total deductions"},
        {"item": "Take-home pay (net)"},
    ],
    "formulas": [
        {"cell": "B8", "formula": "=SUM(B3:B7)", "number_format": MONEY},
        {"cell": "B9", "formula": "=B2-B8", "number_format": MONEY},
        {"col": "C", "range_rows": [2, 9], "formula": "=B{row}*26", "number_format": MONEY},
    ],
    "styles": {"header": HEADER, "banding": BAND},
}

# ===========================================================================
# 4. BUDGET
budget = {
    "name": "Budget", "freeze": "A2",
    "columns": [
        {"header": "Category", "key": "cat", "width": 26},
        {"header": "Budgeted", "key": "amount", "width": 14, "number_format": MONEY},
        {"header": "% of take-home", "key": "pct", "width": 16, "number_format": PCT},
    ],
    "rows": [
        {"cat": "Rent / housing", "amount": 600},
        {"cat": "Utilities", "amount": 90},
        {"cat": "Groceries", "amount": 220},
        {"cat": "Transportation / gas", "amount": 100},
        {"cat": "Phone + internet", "amount": 60},
        {"cat": "Subscriptions", "amount": 30},
        {"cat": "Debt payment", "amount": 100},
        {"cat": "Savings", "amount": 150},
        {"cat": "Fun / dining out", "amount": 60},
        {"cat": "Miscellaneous", "amount": 43},
        {"cat": "Total budgeted"},
        {"cat": "Take-home pay (net)"},
        {"cat": "Left to allocate"},
    ],
    "formulas": [
        {"cell": "B12", "formula": "=SUM(B2:B11)", "number_format": MONEY},
        {"cell": "B13", "formula": "=Paycheck!B9", "number_format": MONEY},
        {"cell": "B14", "formula": "=B13-B12", "number_format": MONEY},
        {"col": "C", "range_rows": [2, 12], "formula": "=IF($B$13=0,0,B{row}/$B$13)", "number_format": PCT},
    ],
    "conditional_formats": [
        {"range": "C2:C11", "type": "data_bar", "color": TEAL},
        {"range": "B14", "type": "cell_is", "operator": "lessThan", "formula": ["0"], "fill": "F4B7B7"},
    ],
    "styles": {"header": HEADER, "banding": BAND},
}

# ===========================================================================
# 5. LOG  (26 bi-weekly paychecks)
log = {
    "name": "Log", "freeze": "A2",
    "columns": [
        {"header": "#", "key": "num", "width": 5},
        {"header": "Pay date", "key": "date", "width": 15, "number_format": DATEF},
        {"header": "Net pay", "key": "net", "width": 12, "number_format": MONEY},
        {"header": "Spent", "key": "spent", "width": 12, "number_format": MONEY},
        {"header": "Saved", "key": "saved", "width": 12, "number_format": MONEY},
        {"header": "Cumulative saved", "key": "cum", "width": 17, "number_format": MONEY},
    ],
    "rows": [{"num": i + 1, "spent": 1303} for i in range(26)],
    "formulas": [
        {"col": "B", "range_rows": [2, 27], "formula": "=DATE(2026,1,2)+14*({row}-2)", "number_format": DATEF},
        {"col": "C", "range_rows": [2, 27], "formula": "=Paycheck!$B$9", "number_format": MONEY},
        {"col": "E", "range_rows": [2, 27], "formula": "=C{row}-D{row}", "number_format": MONEY},
        {"col": "F", "range_rows": [2, 27], "formula": "=SUM($E$2:E{row})", "number_format": MONEY},
    ],
    "conditional_formats": [
        {"range": "F2:F27", "type": "color_scale", "min_color": SAND, "mid_color": SKY, "max_color": TEAL},
    ],
    "styles": {"header": HEADER, "banding": BAND},
}

# ===========================================================================
# 6. SAVINGS GOALS
goals = {
    "name": "Savings Goals", "freeze": "A2",
    "columns": [
        {"header": "Goal", "key": "goal", "width": 22},
        {"header": "Target", "key": "target", "width": 13, "number_format": MONEY},
        {"header": "Saved", "key": "saved", "width": 13, "number_format": MONEY},
        {"header": "Remaining", "key": "rem", "width": 13, "number_format": MONEY},
        {"header": "% Complete", "key": "pct", "width": 12, "number_format": PCT},
        {"header": "Target date", "key": "date", "width": 14, "number_format": DATEF},
    ],
    "rows": [
        {"goal": "Emergency fund", "target": 5000, "saved": 1500},
        {"goal": "Vacation", "target": 2500, "saved": 800},
        {"goal": "New car fund", "target": 8000, "saved": 2200},
        {"goal": "Holiday gifts", "target": 1200, "saved": 300},
        {"goal": "Home down payment", "target": 20000, "saved": 4500},
        {"goal": "Total"},
    ],
    "formulas": [
        {"col": "D", "range_rows": [2, 6], "formula": "=MAX(B{row}-C{row},0)", "number_format": MONEY},
        {"col": "E", "range_rows": [2, 6], "formula": "=IF(B{row}=0,0,C{row}/B{row})", "number_format": PCT},
        {"cell": "F2", "formula": "=DATE(2026,12,31)", "number_format": DATEF},
        {"cell": "F3", "formula": "=DATE(2026,8,15)", "number_format": DATEF},
        {"cell": "F4", "formula": "=DATE(2027,6,1)", "number_format": DATEF},
        {"cell": "F5", "formula": "=DATE(2026,12,1)", "number_format": DATEF},
        {"cell": "F6", "formula": "=DATE(2028,1,1)", "number_format": DATEF},
        {"cell": "B7", "formula": "=SUM(B2:B6)", "number_format": MONEY},
        {"cell": "C7", "formula": "=SUM(C2:C6)", "number_format": MONEY},
        {"cell": "D7", "formula": "=SUM(D2:D6)", "number_format": MONEY},
        {"cell": "E7", "formula": "=IF(B7=0,0,C7/B7)", "number_format": PCT},
    ],
    "conditional_formats": [
        {"range": "E2:E6", "type": "data_bar", "color": TEAL},
    ],
    "styles": {"header": HEADER, "banding": BAND},
}

# ===========================================================================
# 7. DEBT PAYOFF
debt = {
    "name": "Debt Payoff", "freeze": "A2",
    "columns": [
        {"header": "Debt", "key": "debt", "width": 20},
        {"header": "Starting balance", "key": "start", "width": 16, "number_format": MONEY},
        {"header": "Current balance", "key": "cur", "width": 16, "number_format": MONEY},
        {"header": "Paid off", "key": "paid", "width": 13, "number_format": MONEY},
        {"header": "% paid", "key": "pct", "width": 10, "number_format": PCT},
        {"header": "APR", "key": "apr", "width": 9, "number_format": PCT2},
        {"header": "Min payment", "key": "min", "width": 13, "number_format": MONEY},
    ],
    "rows": [
        {"debt": "Credit card", "start": 4200, "cur": 3100, "apr": 0.1999, "min": 120},
        {"debt": "Car loan", "start": 18000, "cur": 11500, "apr": 0.0549, "min": 340},
        {"debt": "Student loan", "start": 24000, "cur": 15800, "apr": 0.0450, "min": 210},
        {"debt": "Personal loan", "start": 6000, "cur": 2400, "apr": 0.1100, "min": 180},
        {"debt": "Total"},
    ],
    "formulas": [
        {"col": "D", "range_rows": [2, 5], "formula": "=B{row}-C{row}", "number_format": MONEY},
        {"col": "E", "range_rows": [2, 5], "formula": "=IF(B{row}=0,0,D{row}/B{row})", "number_format": PCT},
        {"cell": "B6", "formula": "=SUM(B2:B5)", "number_format": MONEY},
        {"cell": "C6", "formula": "=SUM(C2:C5)", "number_format": MONEY},
        {"cell": "D6", "formula": "=SUM(D2:D5)", "number_format": MONEY},
        {"cell": "E6", "formula": "=IF(B6=0,0,D6/B6)", "number_format": PCT},
        {"cell": "G6", "formula": "=SUM(G2:G5)", "number_format": MONEY},
    ],
    "conditional_formats": [
        {"range": "E2:E5", "type": "data_bar", "color": TEAL},
        {"range": "F2:F5", "type": "color_scale", "min_color": "7ED2B6", "mid_color": "F6E5A8", "max_color": "E8A6A6"},
    ],
    "styles": {"header": HEADER, "banding": BAND},
}

# ===========================================================================
# 8. DASHBOARD
def card(anchor, label, value, fmt, fill):
    return {"anchor": anchor, "span": [2, 1], "label": label, "value": value,
            "number_format": fmt, "fill": fill, "font_color": "FFFFFF",
            "label_size": 9, "value_size": 16, "border": True}

dashboard = {
    "name": "Dashboard", "columns": [], "hide_gridlines": True, "row_height": 18,
    "column_widths": {"A": 3, "B": 3, "C": 17, "D": 3, "E": 17, "F": 3, "G": 17, "H": 3, "I": 17, "J": 3},
    "fills": [{"range": "C3:I8", "color": SAND_L}],
    "section_bars": [
        bar("C2:I2", "M O N E Y   A T   A   G L A N C E", NAVY, size=12),
        bar("C10:I10", "B U D G E T   B Y   C A T E G O R Y", TEAL, size=11),
        bar("C26:I26", "S A V I N G S   G R O W T H   ·   26   P A Y C H E C K S", TEAL_D, size=11),
        bar("C42:I42", "G O A L S   ·   T A R G E T   vs   S A V E D", "5B9AA0", size=11),
    ],
    "kpi_cards": [
        card("C4", "Take-home / paycheck", "=Paycheck!B9", MONEY, TEAL),
        card("E4", "Avg monthly income", "=Paycheck!B9*26/12", MONEY, NAVY),
        card("G4", "Saved / year", "=SUM(Log!E2:E27)", MONEY, TEAL_D),
        card("I4", "Savings rate", "=IF(SUM(Log!C2:C27)=0,0,SUM(Log!E2:E27)/SUM(Log!C2:C27))", PCT, NAVY),
        card("C7", "Total saved (goals)", "=SUM('Savings Goals'!C2:C6)", MONEY, NAVY),
        card("E7", "Goals progress", "=IF(SUM('Savings Goals'!B2:B6)=0,0,SUM('Savings Goals'!C2:C6)/SUM('Savings Goals'!B2:B6))", PCT, TEAL_D),
        card("G7", "Total debt left", "=SUM('Debt Payoff'!C2:C5)", MONEY, TEAL),
        card("I7", "Debt paid off", "=SUM('Debt Payoff'!D2:D5)", MONEY, NAVY),
    ],
    "charts": [
        {"type": "bar", "anchor": "C11", "data": "Budget!B1:B11", "categories": "Budget!A2:A11", "width": 18, "height": 8},
        {"type": "line", "anchor": "C27", "data": "Log!F1:F27", "categories": "Log!B2:B27", "width": 18, "height": 8},
        {"type": "bar", "anchor": "C43", "data": "Savings Goals!B1:C6", "categories": "Savings Goals!A2:A6", "width": 18, "height": 8},
    ],
}

spec = {
    "filename": "budget-paycheck-tracker.xlsx",
    "theme": theme,
    "tabs": [cover, howto, paycheck, budget, log, goals, debt, dashboard],
}

if __name__ == "__main__":
    with open("budget-paycheck-tracker.spec.json", "w") as fh:
        json.dump(spec, fh, indent=2, ensure_ascii=False)
    print("Wrote budget-paycheck-tracker.spec.json")
