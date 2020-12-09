const express=require('express');
const bodyparser=require('body-parser');
const mongoose=require('mongoose')
const URL="mongodb+srv://training:WUJMyPMB7rW9OP5F@guvi.k00x5.mongodb.net/<dbname>?retryWrites=true&w=majority"
 mongoose.connect(URL,{useUnifiedTopology:true ,useNewUrlParser: true})
mongoose.connection.on('connected',()=>{
    console.log("mongoose connected")
})


const { UrlModel }= require('./models/urlshort')
const app=express();
app.use(bodyparser.urlencoded({extended:true}))
app.use(express.static('public'));
app.set('view engine',"ejs")
app.get('/',function(req,res){
    let allUrl =UrlModel.find( function(err,results){
        res.render('home',{
            urlResult:results
        })
    })

});

app.post('/create',function(req,res){
//console.log(req.body.longurl)
// create a short url

let urlShort = new UrlModel({
    longUrl:req.body.longurl,
    shortUrl: url()
})
//console.log(urlShort);
urlShort.save( function(err,data){
   // console.log("entered to save");
    if (err) throw error;
    console.log(data)
    res.redirect('/')
    
})
})
app.get('/:urlID',function(req,res){
    UrlModel.findOne({shortUrl : req.params.urlID},function(err,data){
        if (err) throw error;
        res.redirect(data.longUrl)
    })
})
app.listen(3000,()=>{
    console.log("lisening to http://localhost:3000/")
})


function url(){
    var result ="";
    var char="ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";
    var charlength=char.length;
    for(var i=0;i<5;i++){
        result +=char.charAt(
            Math.floor(Math.random()*charlength)
        );
    }
    return result;
}