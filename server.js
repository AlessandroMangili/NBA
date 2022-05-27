const express = require('express');
const res = require('express/lib/response');
const path = require('path');
const app = express();
const host = "127.0.0.1"
const port = process.env.PORT || 8000;
app.set('port', port);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.get('/statistics/table', (req, res) => {
    //console.log("Statistiche table", __dirname);
    res.sendFile(path.join(__dirname, "/public/pages/IndividualStatistics-table.html"));
})

app.get('/statistics/chart', (req, res) => {
    //console.log("Statistiche chart", __dirname);
    res.sendFile(path.join(__dirname + "/public/pages/IndividualStatistics-chart.html"));
})

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + "/public/pages/404.html"));
});


app.listen(app.get('port'), function() {
    console.log(`Server is running on http://${host}:${port}`);
  })