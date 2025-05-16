const form = document.getElementById('expense-form');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const tableBody = document.getElementById('expense-table-body');
const exportBtn = document.getElementById('export-csv');
const chartCanvas = document.getElementById('expense-chart');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function renderTable() {
  tableBody.innerHTML = '';
  expenses.forEach((exp, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${exp.title}</td>
      <td>$${exp.amount.toFixed(2)}</td>
      <td><button onclick="deleteExpense(${index})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  saveExpenses();
  renderTable();
  renderChart();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const amount = parseFloat(amountInput.value);
  if (!title || isNaN(amount)) return;

  expenses.push({ title, amount });
  saveExpenses();
  renderTable();
  renderChart();
  titleInput.value = '';
  amountInput.value = '';
});

exportBtn.addEventListener('click', () => {
  let csv = "Title,Amount\n";
  expenses.forEach(exp => {
    csv += `${exp.title},${exp.amount}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "expenses.csv";
  a.click();
  URL.revokeObjectURL(url);
});

let chart;

function renderChart() {
  const titles = expenses.map(e => e.title);
  const amounts = expenses.map(e => e.amount);
  const colors = titles.map(() => '#' + Math.floor(Math.random()*16777215).toString(16));

  if (chart) chart.destroy();

  chart = new Chart(chartCanvas, {
    type: 'pie',
    data: {
      labels: titles,
      datasets: [{
        data: amounts,
        backgroundColor: colors,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });
}

renderTable();
renderChart();

