const path = require('path');
const express = require('express');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000
var app = express();

app.use(express.static(publicPath));
//app.set('view-engine', 'html');

// app.get('/', (req, res)=>{
//   res.send('index');
// });

app.listen(port, ()=>{
  console.log(`Server started on port ${port}..`);
});
