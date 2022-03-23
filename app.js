const express=require('express');
const app=express();
const port=8000;
const socket=require('socket.io');
const bodyparser=require('body-parser');
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')
const DB="mongodb+srv://shubhangimhetre:Shubhangi_123@cluster0.jiln6.mongodb.net/Mydb?retryWrites=true&w=majority&ssl=true"
const web=require('./routes/web')
const messages=require('./model/messagemodel')

app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
app.use(cookieParser())
app.use('/',web)
app.use(express.static('public'))

mongoose.connect(DB, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(()=>{console.log('connected to database..') })
.catch((err)=>{ console.log(err)})

const server=app.listen(port,()=>{
    console.log(`server listening at port ${port}`)
})

var io=socket(server);

io.on('connection', function (socket){
    console.log(socket.id," New user is connected..")  
    socket.on("click", async function(data){
        io.emit("chat",data)
        try{
            const new_msg=new messages(data)
            const messages_data= await new_msg.save()
            console.log(messages_data,"Data inserted to db")
        }catch(err){console.log(err)}
    })
    socket.on("typing",function(data){
        socket.broadcast.emit("typing",data)
    })
    socket.on('disconnect',()=>{
        console.log(socket.id,'one user disconnected..')
    })
})