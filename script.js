let transactions =
JSON.parse(localStorage.getItem("orbitData")) || [];

let filter = "all";
let editId = null;

const desc = document.getElementById("desc");
const amt = document.getElementById("amt");
const cat = document.getElementById("cat");
const type = document.getElementById("type");

function toast(message){

const toast =
document.getElementById("toast");

toast.innerText = message;
toast.style.display = "block";

setTimeout(()=>{
toast.style.display = "none";
},2000);
}

function quick(d,a,c,t){

desc.value = d;
amt.value = a;
cat.value = c;
type.value = t;
}

function setFilter(value){
filter = value;
render();
}

function saveTransaction(){

if(!desc.value || !amt.value){
return;
}

if(editId){

let transaction =
transactions.find(
t => t.id === editId
);

transaction.desc = desc.value;
transaction.amount = Number(amt.value);
transaction.cat = cat.value;
transaction.type = type.value;

toast("✓ Transaction Updated");

editId = null;

document.getElementById(
"saveBtn"
).innerText = "Add Transaction";

}else{

transactions.push({
id: Date.now(),
desc: desc.value,
amount: Number(amt.value),
cat: cat.value,
type: type.value
});

toast("✓ Transaction Added");
}

localStorage.setItem(
"orbitData",
JSON.stringify(transactions)
);

clearForm();
render();
}

function editTransaction(id){

let t =
transactions.find(
item => item.id === id
);

desc.value = t.desc;
amt.value = t.amount;
cat.value = t.cat;
type.value = t.type;

editId = id;

document.getElementById(
"saveBtn"
).innerText =
"Update Transaction";
}

function deleteTransaction(id){

if(!confirm(
"Delete this transaction?"
)){
return;
}

transactions =
transactions.filter(
t => t.id !== id
);

localStorage.setItem(
"orbitData",
JSON.stringify(transactions)
);

toast("🗑 Transaction Deleted");

render();
}

function clearForm(){

desc.value = "";
amt.value = "";
}

function render(){

let income =
transactions
.filter(t=>t.type==="income")
.reduce(
(sum,t)=>sum+t.amount,
0
);

let expense =
transactions
.filter(t=>t.type==="expense")
.reduce(
(sum,t)=>sum+t.amount,
0
);

let topExpense =
Math.max(
0,
...transactions
.filter(t=>t.type==="expense")
.map(t=>t.amount)
);

document.getElementById("bal")
.innerText =
"₹"+(income-expense).toLocaleString();

document.getElementById("inc")
.innerText =
"₹"+income.toLocaleString();

document.getElementById("exp")
.innerText =
"₹"+expense.toLocaleString();

document.getElementById("count")
.innerText =
transactions.length;

document.getElementById("high")
.innerText =
"₹"+topExpense.toLocaleString();

let search =
document
.getElementById("search")
.value
.toLowerCase();

let filtered =
transactions.filter(t=>
(filter==="all" ||
t.type===filter) &&
(
t.desc.toLowerCase().includes(search)
||
t.cat.toLowerCase().includes(search)
)
);

const list =
document.getElementById("list");

list.innerHTML = "";

filtered
.slice()
.reverse()
.forEach(t=>{

list.innerHTML += `
<div class="item ${t.type}">
<div>
<b>${t.desc}</b><br>
<small>${t.cat}</small>
</div>

<div class="action-buttons">

<div class="${
t.type==="income"
? "green"
: "red"
}">
${t.type==="income"
? "+"
: "-"
} ₹${t.amount}
</div>

<button
class="edit-btn"
onclick="editTransaction(${t.id})">
✏
</button>

<button
class="delete-btn"
onclick="deleteTransaction(${t.id})">
🗑
</button>

</div>
</div>
`;
});

if(filtered.length===0){

list.innerHTML = `
<div style="
padding:30px;
text-align:center;
color:#94a3b8">
💸 No transactions found
</div>
`;
}

let budget =
Number(
localStorage.getItem(
"orbitBudget"
)
) || 0;

document.getElementById(
"budget"
).value = budget;

if(budget>0){

let percent =
Math.min(
(expense/budget)*100,
100
);

document.getElementById(
"bar"
).style.width =
percent + "%";

document.getElementById(
"budgetText"
).innerText =
`₹${expense.toLocaleString()} spent of ₹${budget.toLocaleString()} (${percent.toFixed(0)}%)`;

}
}

document
.getElementById("search")
.addEventListener(
"input",
render
);

document
.getElementById("budget")
.addEventListener(
"input",
function(){

localStorage.setItem(
"orbitBudget",
this.value
);

render();
}
);

render();
