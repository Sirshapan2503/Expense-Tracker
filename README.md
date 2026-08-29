# Ledger — Expense Tracker

A simple, no-framework expense tracker built with vanilla HTML, CSS, and JavaScript. Add income and expenses, filter by category, and track your running balance — all saved locally in your browser.

![Ledger screenshot](screenshots/demo.png)

## Features

- Add transactions with description, amount, type (income/expense), and category
- Live balance, total income, and total expense summary
- Filter transaction list by category
- Delete transactions
- Data persists across page reloads via `localStorage`
- Fully responsive layout

## Tech stack

- HTML5
- CSS3 (custom properties, flexbox)
- Vanilla JavaScript (no frameworks or build tools)
- Fonts: Space Grotesk, Inter, IBM Plex Mono (Google Fonts)

## Getting started

No build step or dependencies required.

1. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/expense-tracker.git
   ```
2. Open `index.html` in your browser.

That's it — the app runs entirely client-side.

## Project structure

```
expense-tracker/
├── index.html      # Markup
├── style.css       # Styling
├── script.js       # App logic (state, rendering, localStorage)
├── README.md
└── screenshots/
    └── demo.png
```

## How it works

- All transactions are kept in a single `transactions` array (source of truth).
- Every add or delete calls `save()` (writes to `localStorage`) and `render()` (rebuilds the UI from current state).
- The category filter dropdown is generated dynamically from whatever categories exist in the data, so it never goes stale.

## Possible next steps

- Edit an existing transaction
- Spending breakdown chart (e.g. Chart.js) by category
- Date range filtering
- Export transactions as CSV

## License

MIT
