# Budget by Paycheck — Bi-Weekly Budget & Savings Tracker

A polished, ready-to-sell bi-weekly (26 paychecks/year) budget template in a
soft **Ocean & Teal** aesthetic. Built with the **sheetsmith** spreadsheet
pipeline — live formulas, conditional formatting, KPI cards, and themed charts.

## Files
- `budget-paycheck-tracker.xlsx` — the template. Open in Excel or upload to Google Sheets.
- `budget-paycheck-tracker.spec.json` — the workbook spec (source of truth).
- `make_spec.py` — generates the spec (theme, tabs, formulas, charts).
- `build_xlsx.py` — renders the spec into the `.xlsx` (needs `openpyxl`).

## Tabs (14)
1. **Cover** — branded welcome page with a tab guide.
2. **How-to** — step-by-step setup instructions for the buyer.
3. **Paycheck** — gross → deductions → take-home, with an annualized (×26) column.
4. **Budget** — take-home split across categories, each as a % of pay, with a
   "Left to allocate" line that turns red if you over-budget.
5. **50-30-20** — needs/wants/savings split: target $ per paycheck vs. your plan, with a heat-map.
6. **Bills** — monthly bill tracker / payment schedule; Paid vs. Unpaid auto-highlight.
7. **Subscriptions** — recurring subscriptions with auto annual cost and category.
8. **Log** — all 26 bi-weekly paychecks; dates auto-fill, net flows in, savings accumulate.
9. **Savings Goals** — targets, % complete with progress bars, and target dates.
10. **Sinking Funds** — monthly set-aside calculator (target ÷ months left to a date).
11. **Debt Payoff** — starting vs. current balances, % paid, APR heat-map, min payments.
12. **Net Worth** — assets − liabilities via SUMIF, with a live net-worth total.
13. **Annual Overview** — the whole year on one page (income, savings, debt, net worth, savings rate).
14. **Dashboard** — 12 KPI cards plus budget, savings-growth, goals, and 50/30/20 charts.

Only the shaded input cells need the buyer — every total, percentage, and chart
updates itself. All sample figures are placeholders.

## Rebuild
```sh
pip install openpyxl
python3 make_spec.py                                                          # → spec.json
python3 build_xlsx.py budget-paycheck-tracker.spec.json budget-paycheck-tracker.xlsx
```

## Customizing the look
Edit the palette constants at the top of `make_spec.py` (`TEAL`, `SKY`, `NAVY`,
`SAND`, …) and rebuild to re-skin the entire workbook in a different aesthetic.
