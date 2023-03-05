
const form=document.querySelector('form')

form.addEventListener('submit',addExpense)

async function addExpense(e){
    try{
        e.preventDefault()
        const expenseprice=document.getElementById('expenseprice').value
        const description=document.getElementById('description').value
        const typeofexpense=document.getElementById('typeofexpense').value
        
        const token=localStorage.getItem('token')
        let my_obj={
            expenseprice,
            description,
            typeofexpense
        }
    
        const res=await axios.post('http://35.78.73.83:4000/expense/addexpense', my_obj, { headers: {"Authorization" : token} })
        console.log('add',res)
        showOnScreen(res.data)

    }
    catch(err){
        console.log(err)
    }
    
}

function showOnScreen(data){
    console.log('sos',data)
    const items=document.getElementById('items')
    const childHTML=`<li id="${data.id}">${data.expenseprice} - ${data.description} -${data.typeofexpense}
                    <button onclick="deleteExpense('${data.id}')" class="btn btn-danger">DELETE</button>
                     </li>`
    items.innerHTML=items.innerHTML + childHTML
}

function showPremiumuserMessage() {
    document.getElementById("rzp-button").style.visibility = "hidden";
    document.getElementById("message").innerHTML = "You are a Premium user";
}

function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        window
        .atob(base64)
        .split("")
        .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
}

function showLeaderBoard(){
    const inputElement = document.createElement("input");
    inputElement.type = "button";
    inputElement.value = "Show Leaderboard";
    const parent=document.getElementById('message')
    inputElement.onclick = async () => {
        const token = localStorage.getItem("token");
        const userLeaderBoardArray = await axios.get(
          "http://35.78.73.83:4000/premium/showLeaderBoard",
          { headers: { Authorization: token } }
        );
        console.log(userLeaderBoardArray);
        var leaderBoardElem = document.getElementById("leaderboard");
        leaderBoardElem.innerHTML = "<h1> Leader Board </h1>";
        userLeaderBoardArray.data.forEach((userDetails) => {
          leaderBoardElem.innerHTML += `<li>Name - ${userDetails.username} Total Expense - ${userDetails.total_cost}  </li>`;
        });
    };
    parent.appendChild(inputElement)
}

async function getExpenses(){
    try{
        const token=localStorage.getItem('token')
        const select=localStorage.getItem('select')
        const decodeToken=parseJwt(token)
        const ispremiumuser=decodeToken.ispremiumuser
        if(ispremiumuser){
            showPremiumuserMessage()
            showLeaderBoard()
        }
        const res=await axios.get(`http://35.78.73.83:4000/expense/getexpense?limit=${select}`, { headers: {"Authorization" : token} })
        console.log(res)
        createpagination(res.data.pages);
        for(let i=0;i<res.data.expense.length;i++){
            showOnScreen(res.data.expense[i])
        }
    }
    catch(err){
        console.log(err)
    }
}

function createpagination(pages) {
    document.querySelector("#pagination").innerHTML = "";
    let childhtml = "";
    for (var i = 1; i <= pages; i++) {
      childhtml += `<a class="mx-2" id="page=${i}" >${i}</a>`;
    }
    const parentnode = document.querySelector("#pagination");
    parentnode.innerHTML = parentnode.innerHTML + childhtml;
}

document.querySelector("#pagination").addEventListener("click", getexpensepage);
async function getexpensepage(e) {
  //alert(e.target.id)
  const parentnode = document.querySelector("#items");
  //    const select=localStorage.getItem('select');
  parentnode.innerHTML = "";
  // const limit=`${select}?'&limit='${select}`;
  const token = localStorage.getItem("token");
  try {
    let response = await axios.get(
      `http://35.78.73.83:4000/expense/getexpense?${e.target.id}`,
      { headers: { Authorization: token } }
    );
    for (let i = 0; i < response.data.expense.length; i++) {
        showOnScreen(response.data.expense[i]);
    }
  } catch (err) {
    console.log(err);
  }
}

window.addEventListener("DOMContentLoaded",getExpenses)

async function deleteExpense(id){
    try{
        const token=localStorage.getItem('token')
        axios.delete(`http://35.78.73.83:4000/expense/deleteexpense/${id}`, { headers: {"Authorization" : token} })
        .then(result=>removeExpenseFromScreen(id))
    }
    catch(err){
        console.log(err)
    }
}

function removeExpenseFromScreen(id){
    try{
        const items=document.getElementById('items')
        const exptobedeleted=document.getElementById(id)
        items.removeChild(exptobedeleted)
    }
    catch(err){
        console.log(err)
    }
}

document.querySelector('#select').addEventListener('change',(e)=>{
    localStorage.setItem('select',e.target.value)
    getExpenses()
})

document.getElementById('rzp-button').onclick = async (e)=>{
   
      const token=localStorage.getItem('token')
      const response=await axios.get('http://35.78.73.83:4000/purchase/premiummembership', { headers: {"Authorization" : token} })
      console.log(response)
      var options={
        "key":response.data.keyid,
        "order_id":response.data.order.id,
        "handler": async function(response){
           await axios.post('http://35.78.73.83:4000/purchase/updatetransactionstatus',{
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id
           },{ headers: {"Authorization" : token} })
           showPremiumuserMessage()
           alert('you are a premium user now!')
      },
    };
const rzp1 = new Razorpay(options)
rzp1.open()
e.preventDefault()

rzp1.on('payment.failed',function (response){
    console.log(err)
    alert('Something went wrong!')
})
}

function download(){
    const token = localStorage.getItem("token")    
    axios.get('http://35.78.73.83:4000/user/download', { headers: {"Authorization" : token} })
        .then((response) => {
            if(response.status === 200){
                var a = document.createElement("a");
                a.href = response.data.fileURL;
                a.download = 'myexpense.csv';
                a.click();
                var alldownloadedfiles = document.getElementById("alldownloadedfiles");
                alldownloadedfiles.innerHTML = "<h1> All Downloaded Files </h1>";
                response.data.downloadedFiles.forEach((downloadedfile) => {
                alldownloadedfiles.innerHTML += `<li>Link - ${downloadedfile.fileUrl}  - Created At ${downloadedfile.createdAt}  </li>`;
        });
            } else {
                throw new Error(response.data.message)
            }
    
        })
        .catch((err) => {
            console.log(err)
        });
    }
