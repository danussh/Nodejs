 
const app = require('express');
const app = express();
app.listen(3000,()=>console.log('server is working '));
let room = [];
let bookRoom =[];
let customers=[];
app.post('/createRoom/:id/:roomName/:seatsAvailable/:amenities/:price_per_hr',(req,res)=>{
let  id = req.params.id;
let roomName = req.params.roomName;
let seatsAvailable = parseInt(req.params.seatsAvailable);
let amenities = JSON.parse(req.params.amenities);
let price_per_hr = req.params.price_per_hr;
let roomObj = {id,roomName,seatsAvailable,amenities,price_per_hr,bookedStatus:false};
room.push(roomObj);
console.log(room);
res.status(200).json({
    message:'room created',
    roomObj:roomObj
})
})

app.get('/showRooms',(req,res)=>{
    res.send(room);
    console.log(room)
})

//-------------------------------Booking a room-----------------------------
app.post('/bookRoom/:name/:date/:start/:end/:roomId',(req,res)=>{
    let flag=false;
    for(let i=0;i<room.length;i++)
    {
        if(req.params.roomId === room[i].id && room[i].seatsAvailable >0)
        {
             flag=true;
            let roombookObj = {
                customerName: req.params.name,
                roomName: room[i].roomName,
                date: req.params.date,
                start: req.params.start,
                end: req.params.end,
                roomId: req.params.roomId,
                bookedStatus:true
            };
            let customerObj = {
                customerName: req.params.name,
                roomName: room[i].roomName,
                date: req.params.date,
                start: req.params.start,
                end: req.params.end,  
            }
            bookRoom.push(roombookObj);
            customers.push(customerObj);
            res.status(200).json({
                'message':'room booked!',
                roombookObj,
            })

        }
    }
    if(flag === false){
        res.send("Cannot book room all places full! Please try later");
    }
})
app.get('/showBookedRooms',(req,res)=>{
    res.send(bookRoom);
})

app.get('/showCustomers',(req,res)=>{
    res.send(customers);
})

