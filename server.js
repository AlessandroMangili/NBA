const express = require('express');
const res = require('express/lib/response');
const path = require('path');
const fs = require('fs');
const app = express();
const host = "127.0.0.1"
const port = process.env.PORT || 8000;
app.set('port', port);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.get('/statistics/table', (req, res) => {
    res.sendFile(path.join(__dirname, "/public/pages/IndividualStatistics-table.html"));
})

app.get('/statistics/chart', (req, res) => {
    res.sendFile(path.join(__dirname + "/public/pages/IndividualStatistics-chart.html"));
})

app.get('/data', (req, res) => {
    let player_path = path.join(__dirname, 'public/data/player4teams.csv');
    fs.access(player_path, fs.F_OK, (success) => {
        if(!success) {  
            fs.readFile(player_path, 'utf8', (err, data) => {
                if (err) {
                    const responseData = {
                        message:"Errore nella lettura del file",
                        error : err
                    }
                    const jsonContent = JSON.stringify(responseData);
                    res.writeHead(500);
                    res.end(jsonContent);
                }
                res.send(data);
            });
        } else {
            const responseData = {
                message:"Il file per la lettura dei giocatori per squadra non esiste o non è stato trovato",
                error : "Errore apertura file"
            }
            const jsonContent = JSON.stringify(responseData);
            res.writeHead(500);
            res.end(jsonContent);
        }
    });
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname + "/public/pages/404.html"));
});

app.listen(app.get('port'), function() {
    console.log(`Server is running on http://${host}:${port}`);
  })