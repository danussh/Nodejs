const fs = require("fs");
const express =require("express");
const app=express();
app.listen(3000,()=>{
    console.log("working Express")
})
app.get("/list", (request, response) => {
    console.log("working0")
    fs.readdir("./", "utf-8", (err, data) => {
        if (err) throw err;
        let result = " ";
        data.forEach((elem) => {
            console.log("working1")
            if(fs.lstatSync(`./${elem}`).isDirectory()){
                img = '<img src="https://th.bing.com/th/id/OIP.8KEOjdjMIF62PEBKH65zHAHaHa?pid=Api&rs=1" width="32px" style="position:relative; top:10px;">'
            }else{
                img = '<img src="https://th.bing.com/th/id/OIP.3zGoq8dGq5VPdzUede--QAHaKM?pid=Api&rs=1" width="32px" style="position:relative; top:10px;">'
            }
            result += `${img} ${elem}<br><br>`
            console.log("working")
        })
        response.send(result)
    })
});
