//--------------------------------------------------------ADD skills
async function addskills() {
    let skills=document.getElementById("skills").value;
    let data = {
    Skills:skills
}
await fetch('http://localhost:3000/addskills', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        'Content-type': 'application/json'
    }
})
        var flex=document.createElement('div')
        flex.setAttribute("class","p-2");
        flex.innerHTML =`${data.Skills}`
        document.getElementById("flexbox").append(flex);
        document.getElementById("skills").innerHTML=""

}

//----------------------------------------------------------show Skills
function showskills(){
  fetch('http://localhost:3000/showskills', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res=>res.json()).then(data =>{
      console.log(data)
      for(var i=0;i<data.length;i++){
        var flex=document.createElement('div')
        flex.setAttribute("class","p-2");
        flex.innerHTML =`${data[i].Skills}`
        document.getElementById("flexbox").append(flex);

      }
    })         
}
showskills(); 
//------------------------------------------------------------------add work
async function addwork() {
    let cname=document.getElementById("company-name").value;
    let mname=document.getElementById("message-text").value;
    let data = {
    CompanyName:cname,
    Role:mname
}
await fetch('http://localhost:3000/addwork', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        'Content-type': 'application/json'
    }
})
        var flex1=document.createElement('div')
        flex1.setAttribute("class","p-2");
        flex1.innerHTML +=`<span style="color:black"><b>Company Name:</b></span> ${data.CompanyName} &nbsp &nbsp <span style="color:black"><b>Role:</b></span> ${data.Role} `
         document.getElementById("flexbox1").append(flex1);
}

//----------------------------------------------------------------show work 
function showwork(){
  fetch('http://localhost:3000/showwork', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(res=>res.json()).then(data =>{
      for(var i=0;i<data.data.length;i++){
        var flex1=document.createElement('div')
        flex1.setAttribute("class","p-2");
        flex1.innerHTML =`<span style="color:black"><b>Company Name:</b></span> ${data.data[i].CompanyName} &nbsp &nbsp <span style="color:black"><b>Role:</b></span> ${data.data[i].Role} `
         document.getElementById("flexbox1").append(flex1);
      }
    })         

}
showwork();