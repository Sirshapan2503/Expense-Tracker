// ---- State ----
let transactions = JSON.parse(localStorage.getItem('ledger-transactions')) || [];
let selectedType = 'expense';
let activeFilter = 'all';

// ---- DOM refs ----
const form = document.getElementById('entryForm');
const descInput = document.getElementById('desc');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const typeToggle = document.getElementById('typeToggle');
const ledgerEl = document.getElementById('ledger');
const balanceEl = document.getElementById('balance');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const filterCategoryEl = document.getElementById('filterCategory');

// ---- Type toggle (expense/income) ----
typeToggle.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  selectedType = btn.dataset.type;
  [...typeToggle.children].forEach(b => b.classList.toggle('active', b === btn));
});

// ---- Add transaction ----
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!desc || isNaN(amount) || amount <= 0) return;

  const txn = {
    id: Date.now(),
    desc,
    amount,
    type: selectedType,
    category: categorySelect.value,
    date: new Date().toISOString()
  };

  transactions.unshift(txn);
  save();
  render();

  form.reset();
  descInput.focus();
});

// ---- Delete transaction ----
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  save();
  render();
}

// ---- Persistence ----
function save() {
  localStorage.setItem('ledger-transactions', JSON.stringify(transactions));
}

// ---- Formatting helpers ----
function formatMoney(n) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ---- Render category filter options dynamically ----
function renderCategoryFilter() {
  const categories = [...new Set(transactions.map(t => t.category))];
  const current = filterCategoryEl.value;
  filterCategoryEl.innerHTML = '<option value="all">All categories</option>' +
    categories.map(c => `<option value="${c}">${c}</option>`).join('');
  filterCategoryEl.value = categories.includes(current) ? current : 'all';
}

filterCategoryEl.addEventListener('change', () => {
  activeFilter = filterCategoryEl.value;
  render();
});

// ---- Render everything ----
function render() {
  // Totals (always computed from ALL transactions, not filtered view)
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  balanceEl.textContent = formatMoney(balance);
  balanceEl.classList.toggle('negative', balance < 0);
  totalIncomeEl.textContent = formatMoney(income);
  totalExpenseEl.textContent = formatMoney(expense);

  // Filtered list for display
  const visible = activeFilter === 'all'
    ? transactions
    : transactions.filter(t => t.category === activeFilter);

  if (visible.length === 0) {
    ledgerEl.innerHTML = `
      <div class="empty-state">
        <div class="big">No transactions yet</div>
        <div>Add your first one above to get started.</div>
      </div>`;
  } else {
    ledgerEl.innerHTML = visible.map(t => `
      <div class="txn-row">
        <div class="txn-left">
          <span class="txn-dot" style="background: ${t.type === 'income' ? 'var(--income)' : 'var(--expense)'}"></span>
          <div class="txn-info">
            <div class="txn-desc">${escapeHtml(t.desc)}</div>
            <div class="txn-meta">${t.category} · ${formatDate(t.date)}</div>
          </div>
        </div>
        <div class="txn-right">
          <span class="txn-amount ${t.type}">${t.type === 'income' ? '+' : '−'}${formatMoney(t.amount)}</span>
          <button class="del-btn" onclick="deleteTransaction(${t.id})" title="Delete">✕</button>
        </div>
      </div>
    `).join('');
  }

  renderCategoryFilter();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---- Init ----
render();
