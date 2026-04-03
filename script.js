let transactions = [];

function addTransactions() {
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


    let table = document.getElementById("transactionList");
    let newRow = document.createElement("tr");
    newRow.innerHTML = `
                <td>${date}</td>
                <td>${amount}</td>
                <td>${catagory}</td>
                <td>${type}</td>
            `;
    table.appendChild(newRow);


    document.getElementById("add-date").value = '';
    document.getElementById("add-amount").value = '';
    document.getElementById("add-catagory").value = '';
    document.getElementById("type").value = 'select';


    updateSummary();
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
}