const express=require('express');
const app=express();
const port=8000;
const socket=require('socket.io');
const mongoose=require('mongoose');
require('dotenv').config();
const cookieParser=require('cookie-parser');
const web=require('./routes/web');
const messages=require('./model/messagemodel');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use('/',web);
app.use(express.static('public'));

mongoose.connect(process.env.db_connect,{useNewUrlParser:true})
.then(()=>console.log("Connected to database.."))
.catch((err)=>console.log(err));


const server=app.listen(port,()=>console.log("Server is listening..."));

var io=socket(server);

io.on('connection', function (socket){
    console.log(socket.id," New user is connected..")  
    socket.on("click", async function(data){
        io.emit("chat",data)
        try{
            const new_msg=new messages(data);
            const messages_data= await new_msg.save();
            console.log("Data inserted to db");
        }catch(err){console.log(err)}
    })
    socket.on("typing",function(data){
        socket.broadcast.emit("typing",data);
    })
    socket.on('disconnect',()=>{
        console.log(socket.id,'one user disconnected..');
    })
})