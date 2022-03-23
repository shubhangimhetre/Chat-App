var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
const message=require('../model/messagemodel');


exports.all_messages=async(req,res)=>{
        var messages=await message.find()
        res.json(messages) 
}

exports.send_message=async(req,res)=>{
    try {
        var chat = new message(req.body)
        await chat.save()
        res.json({status:200,message:"Message delivered"})
        //Emit the event
        io.emit("chat", req.body)
    } catch (error) {
        res.sendStatus(500)
        console.error(error)
    }
   
}

