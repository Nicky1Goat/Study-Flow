# Budget Paycheck Tracker

A bi-weekly (26 paychecks/year) budget tracker, built with the **sheetsmith**
spreadsheet pipeline. The workbook ships with live formulas, conditional
formatting, and a themed dashboard.

## Files
- `budget-paycheck-tracker.xlsx` — the spreadsheet. Open in Excel or upload to Google Sheets.
- `budget-paycheck-tracker.spec.json` — the workbook spec (source of truth).
- `build_xlsx.py` — renders the spec into the `.xlsx` (needs `openpyxl`).

## Tabs
1. **Paycheck** — one paycheck, gross → deductions → take-home (net).
2. **Budget** — take-home split across categories, each as a % of pay, with a
   "Left to allocate" line that turns red if you over-budget.
3. **Log** — all 26 bi-weekly paychecks: dates auto-fill from Jan 2 2026,
   net flows from the Paycheck tab, and savings accumulate down the column.
4. **Dashboard** — KPI cards (take-home, saved/year, savings rate) plus a
   budget-by-category bar chart and a cumulative-savings line chart.

All sample numbers are placeholders — overwrite the **Gross pay**, the
**deduction** rows, the **Budgeted** amounts, and the **Spent** column with
your own figures; every total recalculates automatically.

## Rebuild
```sh
pip install openpyxl
python3 build_xlsx.py budget-paycheck-tracker.spec.json budget-paycheck-tracker.xlsx
```
