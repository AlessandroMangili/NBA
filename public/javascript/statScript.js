/**
* Parte dedicata alle funzioni per il file IndividualStats-table
*/
var input_player = document.getElementById("playerName");
var input_season = document.getElementById("season");
var btn = document.getElementById("searchPlayer");
var score = document.getElementById("div_score");
var table = document.getElementById("table_score");
var body = document.getElementById("body_score");
var error = document.getElementById("errors");

btn.addEventListener('click', (e) => {
	e.preventDefault();
	stats(input_season.value, input_player.value);
});


/*
funzione che dato il nome di un giocatore, ritorna il suo id se questo è presente
*/
async function playerIdByName(playerName) {
	var playerObj = await fetch("https://www.balldontlie.io/api/v1/players?search="+playerName, {
		method: "GET"
	});
	
	var player = await playerObj.json();
	return player.data;
}

/*
funzione che data la stagione, non nulla o vuota, e l'id di un giocatore, ritorna le statistiche per quella stagione se
il giocatore esiste e se ha giocato in quella stagione
*/
async function individualStats(season, player_id) {
	if(season != " " && season != null) {
		var statsObj = await fetch("https://www.balldontlie.io/api/v1/season_averages?season="+season+"&player_ids[]="+player_id, {
			method: "GET"
		});
	} else {
		var statsObj = await fetch("https://www.balldontlie.io/api/v1/season_averages?player_ids[]="+player_id, {
			method: "GET"
		});
	}

	var stats = await statsObj.json();
	return stats.data;
}

/*
funizione sincrona che data la stagione e il nome del giocatore, richiama a sua volta prima la funzione asincrona
per ottenere l'id tramite il nome del giocatore, se questo esiste, e una volta ottnuto, verrà richiamata la funzione asincrona per ottenere 
le statistiche della stagione passata come parametro, se null allora sarà la stagione corrente, per il determinato giocatore, sempre che quel 
giocatore abbia giocato in quella stagione.
*/
function stats(season, playerName) {
	if (playerName == "") {
		error.innerText = "Devi inserire il nome di un giocatore";
		return;
	}
	
	season = season === "" ? new Date().getFullYear() - 1: season;

	playerIdByName(playerName)
	.then(data => 
		{
			if (data.length > 1) {
				error.innerText = "Presenza di più " + playerName + "! inserisci il nome completo";
			} else if (data.length < 1) {
				error.innerText = "Non ci sono giocatori con il seguente nome: " + playerName;
			} else {
				if(localStorage.getItem(season + " " + data[0].id) == null) {
					individualStats(season, data[0].id)
					.then(stats => 
						{
							localStorage.setItem(season + " " + data[0].id, JSON.stringify(stats));
							if (stats.length < 1) {
								error.innerText = "Non ci sono statitiche riguandanti il giocatore: "+ data[0].first_name + " " + data[0].last_name +" nella stagione " + season;
							} else {
								input_player.value = "";
								input_season.value = "";
								error.innerText = "";

								var row = body.insertRow(-1); //Inserisce la riga nel tbody all'ultima posizione

								let t_name = row.insertCell(0);
								let t_season = row.insertCell(1);
								let stats_pts = row.insertCell(2);
								let stats_min = row.insertCell(3);
								t_name.innerText = data[0].first_name + " " + data[0].last_name;
								t_season.innerText = season;
								stats_pts.innerText = stats[0].pts;
								stats_min.innerText = stats[0].min;

								row.addEventListener('dblclick', (e) => {
									row.parentNode.removeChild(row);
								});
							}
						}
					)
				} else {
					var stats = JSON.parse(localStorage.getItem(season + " " + data[0].id));
					if (stats.length < 1) {
						error.innerText = "Non ci sono statitiche riguandanti il giocatore: "+ data[0].first_name + " " + data[0].last_name +" nella stagione " + season;
					} else {
						input_player.value = "";
						input_season.value = "";
						error.innerText = "";

						var row = body.insertRow(-1); //Inserisce la riga nel tbody all'ultima posizione

						let t_name = row.insertCell(0);
						let t_season = row.insertCell(1);
						let stats_pts = row.insertCell(2);
						let stats_min = row.insertCell(3);
						t_name.innerText = data[0].first_name + " " + data[0].last_name;
						t_season.innerText = season;
						stats_pts.innerText = stats[0].pts;
						stats_min.innerText = stats[0].min;

						row.addEventListener('dblclick', (e) => {
							row.parentNode.removeChild(row);
						});
					}
				}
			}
		}
	);
}

/**
* Parte dedicata alle funzioni per il file IndividualStats-chart
*/
function createChart() {
	const ctx = document.getElementById('myChart').getContext('2d');
	const myChart = new Chart(ctx, {
	    type: 'line',
	    data: {
	        labels: [],
	        datasets: [{
	            label: '',
	            data: [],
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.2)'
	            ],
	            borderColor: [
	                'rgba(255, 99, 132, 1)'
	            ],
	            borderWidth: 2,
				showLine: true,
				spanGaps: true
	        }]
	    },
	    options: {
	        scales: {
	            y: {
	                beginAtZero: true
	            }
	        }
	    }
	});
	
	myChart.data.labels.push("Lebron");
	myChart.data.datasets[0].data.push(36);
	myChart.data.labels.push("Lebron");
	myChart.data.datasets[0].data.push(20);
	myChart.data.labels.push("Lebron");
	myChart.data.datasets[0].data.push(25);
	myChart.data.labels.push("Lebron");
	myChart.data.datasets[0].data.push(10);
	myChart.update();
}