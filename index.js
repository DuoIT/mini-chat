const express = require("express");
const app = express();
require("dotenv").config();

global.Env = process.env;

const http  = require("http").Server(app);

http.listen(Env.PORT, () => {
    console.log(`Server run at port: ${Env.PORT}`);
  });

const io = require("socket.io")(http, {
    pingTimeout:3000,
    pingInterval:6000
});

let arrUser = [];
io.on("connect", function(socket){
    console.log("Connect success" +" "+ socket.id);

    socket.on("client-send-username", function(data){
        if(arrUser.indexOf(data)>=0)
        {
            socket.emit("server-send-fail");
        }
        else
        {
            arrUser.push(data);
            console.log(arrUser);
            socket.username = data;
            socket.emit("server-send-success", data);
            io.sockets.emit("server-send-all", arrUser);
        }
    });

    socket.on("user-send-message", function(data){
        io.sockets.emit("user-send-message", {un:socket.username, content:data});
    });

    socket.on("logout", function(){
        arrUser.splice(arrUser.indexOf(socket.userName), 1);
        socket.broadcast.emit("server-send-all", arrUser);
    });

    socket.on("person-typing", function(){
        console.log(socket.username + " is typing...");
        socket.broadcast.emit("one-person-is-typing", socket.username + " is typing...");
    });

    socket.on("person-stop-typing", function(){
        console.log(socket.username + " stop typing..");
        socket.broadcast.emit("one-person-stop-typing");
    });
})