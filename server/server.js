const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
var currentRooms = [];
var roomsUniqList = [];

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
  console.log("New user connected");
  console.log("Sending rooms list");

  users.users.map((user) => currentRooms.push(user.room));

  roomsUniqList = currentRooms.filter((val,i)=>{
      return currentRooms.indexOf(val) == i;
  });
  console.log("Current Active Rooms:"+ roomsUniqList);

  io.emit('updateRoomList', roomsUniqList);

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room are required.');
    }

    //if user already exists reject by returning a callback with err msg
    var userExists = users.users.filter((user)=> user.name == params.name);
    if (users.users.length >= 1 && userExists.length >= 1) {
      if (params.name === userExists[0].name) {
          return callback("User already exists. Please choose another username.")
      }
    }

    socket.join((params.room).toLowerCase());
    users.removeUser(socket.id);

    users.addUser(socket.id, params.name, params.room);

    //check for same rooms and get a unique list
    users.users.map((user) => currentRooms.push(user.room));

    roomsUniqList = currentRooms.filter((val,i)=>{
        return currentRooms.indexOf(val) == i;
    });
    console.log("Currently Active Rooms:"+ roomsUniqList);



    io.to(params.room).emit('updateUserList', users.getUserList(params.room));


    socket.emit('newMessage', generateMessage('Admin', "Welcome to the chat app."));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

    callback();
  });


  socket.on('createMessage', (message, callback)=>{
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on('createLocationMessage', (coords)=>{
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }

  });

  socket.on('disconnect', ()=>{
    console.log("User Disconnected");
    var user = users.removeUser(socket.id);

    roomsUniqList=[];
    currentRooms=[];
    users.users.map((user) => currentRooms.push(user.room));
    roomsUniqList = currentRooms.filter((val,i)=>{
      return currentRooms.indexOf(val) == i;
    });
    console.log("Currently Active Rooms:"+roomsUniqList);
    io.emit('updateRoomList', roomsUniqList);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
  });

});

server.listen(port, ()=>{
  console.log(`Server started on port ${port}..`);
});
