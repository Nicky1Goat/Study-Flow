#!/usr/bin/env python3
"""Generate the workbook spec for the Ocean & Teal budget paycheck tracker.

A premium, Etsy-ready 14-tab template. Writes budget-paycheck-tracker.spec.json,
which build_xlsx.py renders into the styled .xlsx (the sheetsmith pipeline).

Tab-name quoting rule (important):
  * formulas referencing a tab whose name has a space, hyphen, or leading digit
    must single-quote it:  ='Net Worth'!C12 , ='50-30-20'!D2
  * chart data/category refs must NOT be quoted — the builder splits on "!" and
    looks the sheet up by raw name:  "50-30-20!D2:D4"
Excel forbids / \\ ? * [ ] : in sheet names, so the 50/30/20 tab is named "50-30-20".
"""
import json

# ---- Ocean & Teal theme ----------------------------------------------------
TEAL, SKY, NAVY, SAND = "4E9C9C", "A8D0D0", "2E4A57", "F0EBE1"
TEAL_D, TINT, SAND_L = "3E7A82", "EAF3F2", "F5F1E8"
GREEN, AMBER, RED = "7ED2B6", "F6E5A8", "E8A6A6"

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
NUM = "#,##0"
DATEF = 'd" "mmm" "yyyy'


def bar(rng, label, color, font="FFFFFF", size=11, align="center"):
    return {"range": rng, "label": label, "color": color, "font_color": font, "size": size, "align": align}


def col(header, key, width, fmt=None):
    c = {"header": header, "key": key, "width": width}
    if fmt:
        c["number_format"] = fmt
    return c


# ===========================================================================
# 1. COVER
guide = [
    ("START HERE", "Instructions — set up in minutes"),
    ("PLAN", "Paycheck · Budget · 50/30/20"),
    ("TRACK", "Bills · Subscriptions · Paycheck Log"),
    ("GROW", "Savings Goals · Sinking Funds"),
    ("CRUSH DEBT", "Debt Payoff with payoff progress"),
    ("NET WORTH", "Net Worth · Annual Overview"),
    ("SEE IT ALL", "Dashboard — every number, live"),
]
cover_bars = [
    bar("B3:E5", "BUDGET  BY  PAYCHECK", NAVY, size=26),
    bar("B6:E6", "Bi-Weekly Budget, Savings & Debt Tracker", TEAL, size=14),
    bar("B8:E8", "WHAT'S  INSIDE  ·  14  TABS", TEAL_D, size=12, align="left"),
]
for i, (name, desc) in enumerate(guide):
    fill = SAND_L if i % 2 else TINT
    cover_bars.append(bar(f"B{9+i}:E{9+i}", f"   {name}   —   {desc}", fill, font=NAVY, size=11, align="left"))
cover_bars.append(bar("B17:E17", "Only the shaded cells need you — everything else is automatic", SAND_L, font=NAVY, size=10))
cover_bars.append(bar("B18:E18", "♡   Thank you for your purchase   ·   made with care", TEAL, size=12))

cover = {
    "name": "Cover", "columns": [], "hide_gridlines": True, "row_height": 22,
    "column_widths": {"A": 3, "B": 4, "C": 24, "D": 24, "E": 24, "F": 4},
    "fills": [{"range": "B2:E19", "color": SAND}],
    "section_bars": cover_bars,
}

# ===========================================================================
# 2. HOW-TO
howto = {
    "name": "How-to", "freeze": "A2",
    "columns": [col("Step", "step", 8), col("What to do", "txt", 95)],
    "rows": [
        {"step": "1", "txt": "Make your own copy first (File ▸ Make a copy / Save As) so the original stays clean."},
        {"step": "2", "txt": "Paycheck tab: enter your gross pay and each deduction. Take-home pay calculates itself."},
        {"step": "3", "txt": "Budget tab: set a Budgeted amount per category. Aim to keep 'Left to allocate' at 0."},
        {"step": "4", "txt": "Bills & Subscriptions: list what you owe each month and tick off bills as you pay them."},
        {"step": "5", "txt": "Paycheck Log: each payday, type what you Spent. Saved and Cumulative saved fill in for you."},
        {"step": "6", "txt": "Savings Goals & Sinking Funds: set targets and dates — your monthly contribution is calculated."},
        {"step": "7", "txt": "Debt Payoff & Net Worth: enter balances and watch '% paid' and your net worth update."},
        {"step": "8", "txt": "Dashboard & Annual Overview: open any time for your whole financial picture and charts."},
        {"step": "★", "txt": "Tip: only shaded input cells need you. Hide any tabs you don't use — totals still work."},
    ],
    "styles": {"header": HEADER, "banding": BAND},
}

# ===========================================================================
# 3. PAYCHECK
paycheck = {
    "name": "Paycheck", "freeze": "A2",
    "columns": [col("Item", "item", 34), col("Per paycheck", "amount", 15, MONEY), col("Per year (×26)", "annual", 15, MONEY)],
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
    "columns": [col("Category", "cat", 26), col("Budgeted", "amount", 14, MONEY), col("% of take-home", "pct", 16, PCT)],
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
# 5. 50-30-20  (needs / wants / savings rule)
rule = {
    "name": "50-30-20", "freeze": "A2",
    "columns": [
        col("Bucket", "bucket", 22), col("Target %", "tpct", 10, PCT),
        col("Target $ / paycheck", "target", 18, MONEY), col("Your plan $", "actual", 14, MONEY),
        col("Difference", "diff", 14, MONEY),
    ],
    "rows": [
        {"bucket": "Needs (housing, food…)", "tpct": 0.50},
        {"bucket": "Wants (fun, subs…)", "tpct": 0.30},
        {"bucket": "Savings & debt", "tpct": 0.20},
        {"bucket": "Total"},
    ],
    "formulas": [
        {"col": "C", "range_rows": [2, 4], "formula": "=Paycheck!$B$9*B{row}", "number_format": MONEY},
        {"cell": "D2", "formula": "=SUM(Budget!B2:B6)", "number_format": MONEY},
        {"cell": "D3", "formula": "=Budget!B7+Budget!B10+Budget!B11", "number_format": MONEY},
        {"cell": "D4", "formula": "=Budget!B8+Budget!B9", "number_format": MONEY},
        {"col": "E", "range_rows": [2, 4], "formula": "=D{row}-C{row}", "number_format": MONEY},
        {"cell": "B5", "formula": "=SUM(B2:B4)", "number_format": PCT},
        {"cell": "C5", "formula": "=SUM(C2:C4)", "number_format": MONEY},
        {"cell": "D5", "formula": "=SUM(D2:D4)", "number_format": MONEY},
        {"cell": "E5", "formula": "=D5-C5", "number_format": MONEY},
    ],
    "conditional_formats": [
        {"range": "E2:E4", "type": "color_scale", "min_color": GREEN, "mid_color": AMBER, "max_color": RED},
    ],
    "styles": {"header": HEADER, "banding": BAND},
}

# ===========================================================================
# 6. BILLS  (monthly bill tracker / payment schedule)
bills = {
    "name": "Bills", "freeze": "A2",
    "columns": [
        col("Bill", "bill", 22), col("Due day", "due", 9), col("Amount", "amount", 12, MONEY),
        col("Autopay", "auto", 10), col("Status", "status", 12), col("Category", "category", 16),
    ],
    "rows": [
        {"bill": "Rent / mortgage", "due": 1, "amount": 1200, "auto": "No", "status": "Unpaid", "category": "Housing"},
        {"bill": "Electric", "due": 5, "amount": 90, "auto": "Yes", "status": "Paid", "category": "Utilities"},
        {"bill": "Internet", "due": 10, "amount": 60, "auto": "Yes", "status": "Paid", "category": "Utilities"},
        {"bill": "Phone", "due": 15, "amount": 45, "auto": "Yes", "status": "Unpaid", "category": "Utilities"},
        {"bill": "Car insurance", "due": 20, "amount": 110, "auto": "No", "status": "Unpaid", "category": "Insurance"},
        {"bill": "Water", "due": 22, "amount": 40, "auto": "No", "status": "Unpaid", "category": "Utilities"},
        {"bill": "Gym", "due": 25, "amount": 30, "auto": "Yes", "status": "Paid", "category": "Health"},
        {"bill": "Credit card", "due": 28, "amount": 150, "auto": "No", "status": "Unpaid", "category": "Debt"},
        {"bill": "Total"},
    ],
    "formulas": [
        {"cell": "C10", "formula": "=SUM(C2:C9)", "number_format": MONEY},
    ],
    "conditional_formats": [
        {"range": "E2:E9", "type": "formula", "formula": ["$E2=\"Paid\""], "fill": GREEN},
        {"range": "E2:E9", "type": "formula", "formula": ["$E2=\"Unpaid\""], "fill": RED},
        {"range": "C2:C9", "type": "data_bar", "color": TEAL},
    ],
    "styles": {"header": HEADER, "banding": BAND},
}

# ===========================================================================
# 7. SUBSCRIPTIONS
subs = {
    "name": "Subscriptions", "freeze": "A2",
    "columns": [
        col("Subscription", "name", 22), col("Monthly cost", "monthly", 13, MONEY),
        col("Annual cost", "annual", 13, MONEY), col("Category", "category", 16),
    ],
    "rows": [
        {"name": "Netflix", "monthly": 15.49, "category": "Streaming"},
        {"name": "Spotify", "monthly": 11.99, "category": "Music"},
        {"name": "Amazon Prime", "monthly": 14.99, "category": "Shopping"},
        {"name": "iCloud storage", "monthly": 2.99, "category": "Software"},
        {"name": "Disney+", "monthly": 13.99, "category": "Streaming"},
        {"name": "Adobe", "monthly": 20.99, "category": "Software"},
        {"name": "YouTube Premium", "monthly": 13.99, "category": "Streaming"},
        {"name": "Total"},
    ],
    "formulas": [
        {"col": "C", "range_rows": [2, 8], "formula": "=B{row}*12", "number_format": MONEY},
        {"cell": "B9", "formula": "=SUM(B2:B8)", "number_format": MONEY},
        {"cell": "C9", "formula": "=SUM(C2:C8)", "number_format": MONEY},
    ],
    "conditional_formats": [
        {"range": "C2:C8", "type": "data_bar", "color": TEAL},
    ],
    "styles": {"header": HEADER, "banding": BAND},
}

# ===========================================================================
# 8. LOG  (26 bi-weekly paychecks)
log = {
    "name": "Log", "freeze": "A2",
    "columns": [
        col("#", "num", 5), col("Pay date", "date", 15, DATEF), col("Net pay", "net", 12, MONEY),
        col("Spent", "spent", 12, MONEY), col("Saved", "saved", 12, MONEY), col("Cumulative saved", "cum", 17, MONEY),
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
# 9. SAVINGS GOALS
goals = {
    "name": "Savings Goals", "freeze": "A2",
    "columns": [
        col("Goal", "goal", 22), col("Target", "target", 13, MONEY), col("Saved", "saved", 13, MONEY),
        col("Remaining", "rem", 13, MONEY), col("% Complete", "pct", 12, PCT), col("Target date", "date", 14, DATEF),
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
    "conditional_formats": [{"range": "E2:E6", "type": "data_bar", "color": TEAL}],
    "styles": {"header": HEADER, "banding": BAND},
}

# ===========================================================================
# 10. SINKING FUNDS  (monthly contribution calculator)
sinking = {
    "name": "Sinking Funds", "freeze": "A2",
    "columns": [
        col("Fund", "fund", 22), col("Target", "target", 13, MONEY), col("Saved", "saved", 13, MONEY),
        col("Need by", "date", 14, DATEF), col("Months left", "months", 11, NUM),
        col("Monthly set-aside", "monthly", 16, MONEY), col("Remaining", "rem", 13, MONEY),
    ],
    "rows": [
        {"fund": "Car maintenance", "target": 1200, "saved": 300},
        {"fund": "Holidays / gifts", "target": 1000, "saved": 250},
        {"fund": "Annual insurance", "target": 1400, "saved": 600},
        {"fund": "Medical / dental", "target": 800, "saved": 200},
        {"fund": "Home repairs", "target": 2000, "saved": 500},
        {"fund": "Travel", "target": 1500, "saved": 400},
        {"fund": "Total"},
    ],
    "formulas": [
        {"cell": "D2", "formula": "=DATE(2026,12,1)", "number_format": DATEF},
        {"cell": "D3", "formula": "=DATE(2026,12,15)", "number_format": DATEF},
        {"cell": "D4", "formula": "=DATE(2027,3,1)", "number_format": DATEF},
        {"cell": "D5", "formula": "=DATE(2026,11,1)", "number_format": DATEF},
        {"cell": "D6", "formula": "=DATE(2027,6,1)", "number_format": DATEF},
        {"cell": "D7", "formula": "=DATE(2026,9,1)", "number_format": DATEF},
        {"col": "E", "range_rows": [2, 7], "formula": "=MAX(DATEDIF(TODAY(),D{row},\"m\"),1)", "number_format": NUM},
        {"col": "F", "range_rows": [2, 7], "formula": "=MAX(B{row}-C{row},0)/E{row}", "number_format": MONEY},
        {"col": "G", "range_rows": [2, 7], "formula": "=MAX(B{row}-C{row},0)", "number_format": MONEY},
        {"cell": "B8", "formula": "=SUM(B2:B7)", "number_format": MONEY},
        {"cell": "C8", "formula": "=SUM(C2:C7)", "number_format": MONEY},
        {"cell": "F8", "formula": "=SUM(F2:F7)", "number_format": MONEY},
        {"cell": "G8", "formula": "=SUM(G2:G7)", "number_format": MONEY},
    ],
    "conditional_formats": [{"range": "F2:F7", "type": "data_bar", "color": TEAL_D}],
    "styles": {"header": HEADER, "banding": BAND},
}

# ===========================================================================
# 11. DEBT PAYOFF
debt = {
    "name": "Debt Payoff", "freeze": "A2",
    "columns": [
        col("Debt", "debt", 20), col("Starting balance", "start", 16, MONEY), col("Current balance", "cur", 16, MONEY),
        col("Paid off", "paid", 13, MONEY), col("% paid", "pct", 10, PCT), col("APR", "apr", 9, PCT2),
        col("Min payment", "min", 13, MONEY),
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
        {"range": "F2:F5", "type": "color_scale", "min_color": GREEN, "mid_color": AMBER, "max_color": RED},
    ],
    "styles": {"header": HEADER, "banding": BAND},
}

# ===========================================================================
# 12. NET WORTH
networth = {
    "name": "Net Worth", "freeze": "A2",
    "columns": [col("Account", "acct", 26), col("Type", "type", 14), col("Value", "value", 15, MONEY)],
    "rows": [
        {"acct": "Checking", "type": "Asset", "value": 2500},
        {"acct": "Savings", "type": "Asset", "value": 9300},
        {"acct": "Investments", "type": "Asset", "value": 6000},
        {"acct": "Retirement (401k/IRA)", "type": "Asset", "value": 18000},
        {"acct": "Car value", "type": "Asset", "value": 12000},
        {"acct": "Credit card", "type": "Liability", "value": 3100},
        {"acct": "Car loan", "type": "Liability", "value": 11500},
        {"acct": "Student loan", "type": "Liability", "value": 15800},
        {"acct": "Total assets"},
        {"acct": "Total liabilities"},
        {"acct": "NET WORTH"},
    ],
    "formulas": [
        {"cell": "C10", "formula": "=SUMIF($B$2:$B$9,\"Asset\",$C$2:$C$9)", "number_format": MONEY},
        {"cell": "C11", "formula": "=SUMIF($B$2:$B$9,\"Liability\",$C$2:$C$9)", "number_format": MONEY},
        {"cell": "C12", "formula": "=C10-C11", "number_format": MONEY},
    ],
    "conditional_formats": [
        {"range": "C12", "type": "cell_is", "operator": "lessThan", "formula": ["0"], "fill": "F4B7B7"},
    ],
    "styles": {"header": HEADER, "banding": BAND},
}

# ===========================================================================
# 13. ANNUAL OVERVIEW
annual = {
    "name": "Annual Overview", "freeze": "A2",
    "columns": [col("Metric", "metric", 30), col("Amount", "amount", 16, MONEY)],
    "rows": [
        {"metric": "Annual gross income"},
        {"metric": "Annual take-home (net)"},
        {"metric": "Annual savings"},
        {"metric": "Annual subscriptions"},
        {"metric": "Annual bills"},
        {"metric": "Total debt remaining"},
        {"metric": "Total net worth"},
        {"metric": "Savings rate"},
    ],
    "formulas": [
        {"cell": "B2", "formula": "=Paycheck!B2*26", "number_format": MONEY},
        {"cell": "B3", "formula": "=Paycheck!B9*26", "number_format": MONEY},
        {"cell": "B4", "formula": "=SUM(Log!E2:E27)", "number_format": MONEY},
        {"cell": "B5", "formula": "=SUM(Subscriptions!C2:C8)", "number_format": MONEY},
        {"cell": "B6", "formula": "=SUM(Bills!C2:C9)*12", "number_format": MONEY},
        {"cell": "B7", "formula": "='Debt Payoff'!C6", "number_format": MONEY},
        {"cell": "B8", "formula": "='Net Worth'!C12", "number_format": MONEY},
        {"cell": "B9", "formula": "=IF(B3=0,0,B4/B3)", "number_format": PCT},
    ],
    "styles": {"header": HEADER, "banding": BAND},
}

# ===========================================================================
# 14. DASHBOARD
def card(anchor, label, value, fmt, fill):
    return {"anchor": anchor, "span": [2, 1], "label": label, "value": value,
            "number_format": fmt, "fill": fill, "font_color": "FFFFFF",
            "label_size": 9, "value_size": 15, "border": True}

dashboard = {
    "name": "Dashboard", "columns": [], "hide_gridlines": True, "row_height": 18,
    "column_widths": {"A": 3, "B": 3, "C": 17, "D": 3, "E": 17, "F": 3, "G": 17, "H": 3, "I": 17, "J": 3},
    "fills": [{"range": "C3:I11", "color": SAND_L}],
    "section_bars": [
        bar("C2:I2", "M O N E Y   A T   A   G L A N C E", NAVY, size=12),
        bar("C13:I13", "B U D G E T   B Y   C A T E G O R Y", TEAL, size=11),
        bar("C28:I28", "S A V I N G S   G R O W T H   ·   26   P A Y C H E C K S", TEAL_D, size=11),
        bar("C43:I43", "G O A L S   ·   T A R G E T   vs   S A V E D", "5B9AA0", size=11),
        bar("C58:I58", "5 0  /  3 0  /  2 0     S P L I T", NAVY, size=11),
    ],
    "kpi_cards": [
        card("C4", "Take-home / paycheck", "=Paycheck!B9", MONEY, TEAL),
        card("E4", "Avg monthly income", "=Paycheck!B9*26/12", MONEY, NAVY),
        card("G4", "Saved / year", "=SUM(Log!E2:E27)", MONEY, TEAL_D),
        card("I4", "Savings rate", "=IF(SUM(Log!C2:C27)=0,0,SUM(Log!E2:E27)/SUM(Log!C2:C27))", PCT, NAVY),
        card("C7", "Total saved (goals)", "=SUM('Savings Goals'!C2:C6)", MONEY, NAVY),
        card("E7", "Goals progress", "=IF(SUM('Savings Goals'!B2:B6)=0,0,SUM('Savings Goals'!C2:C6)/SUM('Savings Goals'!B2:B6))", PCT, TEAL_D),
        card("G7", "Total debt left", "='Debt Payoff'!C6", MONEY, TEAL),
        card("I7", "Debt paid off", "='Debt Payoff'!D6", MONEY, NAVY),
        card("C10", "Net worth", "='Net Worth'!C12", MONEY, TEAL_D),
        card("E10", "Monthly bills", "=SUM(Bills!C2:C9)", MONEY, NAVY),
        card("G10", "Yearly subscriptions", "=SUM(Subscriptions!C2:C8)", MONEY, TEAL),
        card("I10", "Sinking funds saved", "=SUM('Sinking Funds'!C2:C7)", MONEY, NAVY),
    ],
    "charts": [
        {"type": "bar", "anchor": "C14", "data": "Budget!B1:B11", "categories": "Budget!A2:A11", "width": 18, "height": 8},
        {"type": "line", "anchor": "C29", "data": "Log!F1:F27", "categories": "Log!B2:B27", "width": 18, "height": 8},
        {"type": "bar", "anchor": "C44", "data": "Savings Goals!B1:C6", "categories": "Savings Goals!A2:A6", "width": 18, "height": 8},
        {"type": "doughnut", "anchor": "C59", "data": "50-30-20!D2:D4", "categories": "50-30-20!A2:A4", "width": 12, "height": 8},
    ],
}

spec = {
    "filename": "budget-paycheck-tracker.xlsx",
    "theme": theme,
    "tabs": [cover, howto, paycheck, budget, rule, bills, subs, log, goals, sinking, debt, networth, annual, dashboard],
}

if __name__ == "__main__":
    with open("budget-paycheck-tracker.spec.json", "w") as fh:
        json.dump(spec, fh, indent=2, ensure_ascii=False)
    print(f"Wrote budget-paycheck-tracker.spec.json  ({len(spec['tabs'])} tabs)")
