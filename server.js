const express = require('express');
const app = express();
const host = "127.0.0.1"
const port = process.env.PORT || 8000;
app.set('port', port);


app.use(express.static('public'));

app.get('/', function(req, res) {
    console.log(__dirname);
    res.sendFile(__dirname + "/index.html");
});


app.listen(app.get('port'), function() {
    console.log(`Server is running on http://${host}:${port}`);
  })