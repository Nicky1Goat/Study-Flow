#!/usr/bin/env python3
"""
Generate a simple bi-weekly budget paycheck tracker workbook.

Run:  python3 budget-paycheck-tracker.py
Out:  budget-paycheck-tracker.xlsx

The workbook has three tabs:
  1. Paycheck  - break a single paycheck down from gross to take-home pay.
  2. Budget    - allocate that take-home pay across expense categories.
  3. Year      - log all 26 bi-weekly paychecks and watch savings add up.

Yellow-tinted cells are the ones you type into; everything else is a
formula and updates on its own.
"""

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

# ---- shared styling -------------------------------------------------------
ACCENT = "2E5E4E"   # deep green
LIGHT = "E7F0EC"    # pale green
INPUT = "FFF4CC"    # soft yellow = "type here"

title_font = Font(name="Calibri", size=16, bold=True, color="FFFFFF")
header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
label_font = Font(name="Calibri", size=11)
total_font = Font(name="Calibri", size=11, bold=True)

accent_fill = PatternFill("solid", fgColor=ACCENT)
light_fill = PatternFill("solid", fgColor=LIGHT)
input_fill = PatternFill("solid", fgColor=INPUT)

money = '#,##0.00;[Red](#,##0.00)'
pct = '0.0%'

thin = Side(style="thin", color="C7D3CC")
border = Border(left=thin, right=thin, top=thin, bottom=thin)
center = Alignment(horizontal="center", vertical="center")
right = Alignment(horizontal="right")


def style_title(ws, cell, text, span):
    ws[cell] = text
    ws[cell].font = title_font
    ws[cell].fill = accent_fill
    ws[cell].alignment = Alignment(horizontal="left", vertical="center", indent=1)
    col = cell[0]
    row = int(cell[1:])
    ws.merge_cells(f"{col}{row}:{get_column_letter(ord(col) - 64 + span - 1)}{row}")
    ws.row_dimensions[row].height = 28


def header(ws, row, values, start_col=1):
    for i, v in enumerate(values):
        c = ws.cell(row=row, column=start_col + i, value=v)
        c.font = header_font
        c.fill = accent_fill
        c.alignment = center
        c.border = border


def input_cell(c, fmt=money):
    c.fill = input_fill
    c.number_format = fmt
    c.border = border
    c.alignment = right


def calc_cell(c, fmt=money, bold=False):
    c.number_format = fmt
    c.border = border
    c.alignment = right
    if bold:
        c.font = total_font


# ===========================================================================
wb = Workbook()

# ---- 1. Paycheck ----------------------------------------------------------
ws = wb.active
ws.title = "Paycheck"
ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 4
ws.column_dimensions["B"].width = 30
ws.column_dimensions["C"].width = 16

style_title(ws, "B2", "Single Paycheck Breakdown", 2)

ws["B4"] = "Gross pay (per paycheck)"
ws["B4"].font = label_font
input_cell(ws["C4"])
ws["C4"] = 2200

deductions = [
    ("Federal tax", 264),
    ("State tax", 88),
    ("Social Security + Medicare", 168),
    ("Health insurance", 95),
    ("401(k) retirement", 132),
]
header(ws, 6, ["Deductions", "Amount"], start_col=2)
r = 7
for name, amt in deductions:
    ws.cell(row=r, column=2, value=name).font = label_font
    ws.cell(row=r, column=2).border = border
    c = ws.cell(row=r, column=3, value=amt)
    input_cell(c)
    r += 1

ws.cell(row=r, column=2, value="Total deductions").font = total_font
ws.cell(row=r, column=2).border = border
ws.cell(row=r, column=2).fill = light_fill
tc = ws.cell(row=r, column=3, value=f"=SUM(C7:C{r - 1})")
calc_cell(tc, bold=True)
tc.fill = light_fill
total_ded_row = r

net_row = r + 2
ws.cell(row=net_row, column=2, value="Take-home pay (net)").font = total_font
ws.cell(row=net_row, column=2).fill = accent_fill
ws.cell(row=net_row, column=2).font = header_font
ws.cell(row=net_row, column=2).border = border
nc = ws.cell(row=net_row, column=3, value=f"=C4-C{total_ded_row}")
calc_cell(nc, bold=True)
nc.fill = accent_fill
nc.font = header_font

NET_REF = f"Paycheck!C{net_row}"

# ---- 2. Budget ------------------------------------------------------------
ws = wb.create_sheet("Budget")
ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 4
ws.column_dimensions["B"].width = 26
ws.column_dimensions["C"].width = 16
ws.column_dimensions["D"].width = 12

style_title(ws, "B2", "Per-Paycheck Budget", 3)

ws["B4"] = "Take-home pay this paycheck"
ws["B4"].font = total_font
ws["C4"] = f"={NET_REF}"
calc_cell(ws["C4"], bold=True)
ws["C4"].fill = light_fill

categories = [
    ("Rent / housing", 700),
    ("Utilities", 90),
    ("Groceries", 250),
    ("Transportation / gas", 120),
    ("Phone + internet", 60),
    ("Subscriptions", 35),
    ("Debt payment", 150),
    ("Savings", 200),
    ("Fun / dining out", 100),
    ("Miscellaneous", 50),
]
header(ws, 6, ["Category", "Budgeted", "% of pay"], start_col=2)
r = 7
first = r
for name, amt in categories:
    ws.cell(row=r, column=2, value=name).font = label_font
    ws.cell(row=r, column=2).border = border
    input_cell(ws.cell(row=r, column=3, value=amt))
    p = ws.cell(row=r, column=4, value=f"=IF($C$4=0,0,C{r}/$C$4)")
    calc_cell(p, fmt=pct)
    r += 1
last = r - 1

ws.cell(row=r, column=2, value="Total budgeted").font = total_font
ws.cell(row=r, column=2).fill = light_fill
ws.cell(row=r, column=2).border = border
calc_cell(ws.cell(row=r, column=3, value=f"=SUM(C{first}:C{last})"), bold=True)
ws.cell(row=r, column=3).fill = light_fill
calc_cell(ws.cell(row=r, column=4, value=f"=IF($C$4=0,0,C{r}/$C$4)"), fmt=pct, bold=True)
ws.cell(row=r, column=4).fill = light_fill
total_row = r

left_row = r + 2
ws.cell(row=left_row, column=2, value="Left over (unbudgeted)").font = total_font
ws.cell(row=left_row, column=2).fill = accent_fill
ws.cell(row=left_row, column=2).font = header_font
ws.cell(row=left_row, column=2).border = border
lc = ws.cell(row=left_row, column=3, value=f"=C4-C{total_row}")
calc_cell(lc, bold=True)
lc.fill = accent_fill
lc.font = header_font

# ---- 3. Year --------------------------------------------------------------
ws = wb.create_sheet("Year")
ws.sheet_view.showGridLines = False
ws.column_dimensions["A"].width = 4
widths = {"B": 6, "C": 14, "D": 14, "E": 14, "F": 14, "G": 16}
for col, w in widths.items():
    ws.column_dimensions[col].width = w

style_title(ws, "B2", "Bi-Weekly Paycheck Log (26 per year)", 6)

header(ws, 4, ["#", "Pay date", "Net pay", "Spent", "Saved", "Cumulative saved"], start_col=2)
first = 5
for i in range(26):
    row = first + i
    ws.cell(row=row, column=2, value=i + 1).alignment = center
    ws.cell(row=row, column=2).border = border
    # pay date + net default to the Paycheck tab so the log starts pre-filled
    dcell = ws.cell(row=row, column=3)
    dcell.border = border
    dcell.alignment = center
    dcell.number_format = "mm/dd/yyyy"
    input_cell(ws.cell(row=row, column=4, value=f"={NET_REF}"))
    input_cell(ws.cell(row=row, column=5))
    sv = ws.cell(row=row, column=6, value=f"=D{row}-E{row}")
    calc_cell(sv)
    cum = ws.cell(row=row, column=7,
                  value=f"=F{row}" if i == 0 else f"=G{row - 1}+F{row}")
    calc_cell(cum, bold=True)
    cum.fill = light_fill
last = first + 25

tr = last + 1
ws.cell(row=tr, column=2, value="").border = border
ws.cell(row=tr, column=3, value="Totals").font = total_font
ws.cell(row=tr, column=3).fill = accent_fill
ws.cell(row=tr, column=3).font = header_font
ws.cell(row=tr, column=3).border = border
for col in (4, 5, 6):
    letter = get_column_letter(col)
    c = ws.cell(row=tr, column=col, value=f"=SUM({letter}{first}:{letter}{last})")
    calc_cell(c, bold=True)
    c.fill = accent_fill
    c.font = header_font
ws.cell(row=tr, column=7).border = border
ws.cell(row=tr, column=7).fill = accent_fill

ws.freeze_panes = "A5"

# ---------------------------------------------------------------------------
out = "budget-paycheck-tracker.xlsx"
wb.save(out)
print(f"Wrote {out}")
