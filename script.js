    let transactions = JSON.parse(localStorage.getItem("financeData")) || [];
    let myChart; 


function addTransactions(event) {
    if (event) event.preventDefault();
    let amount = document.getElementById('add-amount').value;
    let type = document.getElementById('type').value;
    let catagory = document.getElementById('add-catagory').value;
    let date = document.getElementById('add-date').value;


    if (!amount || !type || type === 'select' || !catagory || !date) {
        alert('All fields are required');
        return;
    }


    let newList = {
        Date: date,
        Amount: Number(amount),
        catagory: catagory,
        Type: type
    };


    transactions.push(newList);
    localStorage.setItem("financeData", JSON.stringify(transactions));



    document.getElementById("add-date").value = '';
    document.getElementById("add-amount").value = '';
    document.getElementById("add-catagory").value = '';
    document.getElementById("type").value = 'select';


    displayTransactions();
    updateSummary();
    renderChart();
    renderPieChart();
    showCategoryData()
    
}

function updateSummary() {
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
        if (t.Type === 'Income') {
            income += t.Amount;
        } else if (t.Type === 'Expense') {
            expense += t.Amount;
        }
    });

    let balance = (income) - (expense);

    document.getElementById("income").innerHTML = "$" + income;
    document.getElementById("expense").innerHTML = "$" + expense;
    document.getElementById("balance").innerHTML = "$" + balance;

    console.log(balance);
    console.log(expense);
    console.log(income);
};

function displayTransactions(data = transactions) {
    let table = document.querySelector("tbody");
    table.innerHTML = "";

    data.forEach(t => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${t.Date}</td>
            <td>${t.Amount}</td>
            <td>${t.catagory}</td>
            <td>${t.Type}</td>
        `;
        table.appendChild(row);
    });
}


document.getElementById("search").addEventListener("input", e => {
  const value = e.target.value.toLowerCase();

  const filtered = transactions.filter(t =>
    t.catagory && t.catagory.toLowerCase().includes(value)
  );

  displayTransactions(filtered);
});



document.getElementById("filterType").addEventListener("change", e => {
  const value = e.target.value;

  let filtered;

  if (value === "all") {
    filtered = transactions;
  } else {
    filtered = transactions.filter(t => 
      t.Type.toLowerCase() === value.toLowerCase()
    );
  }

  displayTransactions(filtered);
});




document.getElementById("sortAmount").addEventListener("change", e => {
  let sorted = [...transactions];

  if (e.target.value === "low") {
    sorted.sort((a, b) => a.Amount - b.Amount);
  } else if (e.target.value === "high") {
    sorted.sort((a, b) => b.Amount - a.Amount);
  }

  displayTransactions(sorted);
});





function renderChart() {
    const ctx = document.getElementById('myChart');

    if (!ctx) {
        console.log("Chart canvas not found");
        return;
    }

    let dates = [];
    let incomeData = [];
    let expenseData = [];

    transactions.forEach(t => {
        dates.push(t.Date);

        if (t.Type === "Income") {
            incomeData.push(t.Amount);
            expenseData.push(0);
        } else {
            expenseData.push(t.Amount);
            incomeData.push(0);
        }
    });

    if (myChart) {
    myChart.destroy();
    myChart = null;
}


    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    borderColor: '#22C55E',
                    tension: 0.4
                },
                {
                    label: 'Expense',
                    data: expenseData,
                    borderColor: '#EF4444',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
        }
    });
}

let pieChart;

function renderPieChart() {
    const ctx = document.getElementById('pieChart');

    if (!ctx) return;

    let catagoryMap = {};

    transactions.forEach(t => {
        if (!catagoryMap[t.catagory]) {
            catagoryMap[t.catagory] = 0;
        }
        catagoryMap[t.catagory] += t.Amount;
    });

    const labels = Object.keys(catagoryMap);
    const data = Object.values(catagoryMap);

    if (pieChart) {
        pieChart.destroy();
    }

    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#22C55E',
                    '#EF4444',
                    '#3B82F6',
                    '#F59E0B',
                    '#A855F7',
                    '#14B8A6'
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}


let role = "admin";

document.getElementById("roleSelect").addEventListener("change", (e) => {
    role = e.target.value;
    updateRoleUI();
});

function updateRoleUI() {
    const btn = document.getElementById("submit");

    if (role === "viewer") {
        btn.disabled = true;
        btn.style.opacity = "0.5";
    } else {
        btn.disabled = false;
        btn.style.opacity = "1";
    }
}

function getMaxCategory() {
  const transactions = JSON.parse(localStorage.getItem("financeData")) || [];

  const categoryData = {};

  transactions.forEach(txn => {
    if (txn.Type && txn.Type.trim().toLowerCase() === "expense") {
      const category = txn.catagory || "Other";
      const amount = Number(txn.Amount) || 0;

      categoryData[category] = (categoryData[category] || 0) + amount;
    }
  });

  console.log("Category Data:", categoryData);
  for (let key in categoryData) {
//   console.log(categoryData[key], ":", categoryData.categoryData[key] );
}

  let maxCategory = "";
  let maxAmount = 0;

  for (let category in categoryData) {
    if (categoryData[category] > maxAmount) {
      maxAmount = categoryData[category];
      maxCategory = category;
    }
  }

  return { maxCategory, maxAmount };
}
const result = getMaxCategory();
console.log("RESULT:", result);




function showCategoryData() {
  const transactions = JSON.parse(localStorage.getItem("financeData")) || [];

  const categoryData = {};

  // Step 1: group expenses by category
  transactions.forEach(txn => {
    if (txn.Type && txn.Type.toLowerCase() === "expense") {
      const category = txn.catagory;
      const amount = Number(txn.Amount);

      categoryData[category] = (categoryData[category] || 0) + amount;
    }
  });

  // Step 2: display in UI
  const container = document.getElementById("categoryList");
  container.innerHTML = "";

  for (let catagory in categoryData) {
    const amount = categoryData[catagory];

    const div = document.createElement("div");
    div.innerText = `${catagory} : $${amount}`;

    container.appendChild(div);
  }
}
document.addEventListener("DOMContentLoaded", showCategoryData);


window.onload = function () {
    displayTransactions();
    updateSummary();
    renderChart();
    renderPieChart();
    updateRoleUI();
    
    
};