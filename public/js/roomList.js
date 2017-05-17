var socket = io();

socket.emit("joinInit", function(msg){
  console.log(msg);
});

socket.on('updateRoomList', function(rooms){
  console.log(rooms);
  var roomsList = $('select');
  roomsList.html("<option selected hidden>Select Room</option>");
  rooms.forEach(function(room){
    roomsList.append($('<option></option>').val(room).text(room));
  });

});


$('select[name="selectroom"]').change(function(){
  var value = this.value;
  $('.room-input').val(value);
});
