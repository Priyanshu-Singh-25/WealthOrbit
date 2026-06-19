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

