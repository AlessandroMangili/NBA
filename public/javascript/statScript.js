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
var btnc = document.getElementById("searchPlayerC");
var select = document.getElementById("dati");
var chart = document.getElementById("myChart");

if(window.location.href.split("/").pop() == "table") {
	if(sessionStorage.length != 0) {
		Object.keys(sessionStorage).forEach(data => {
			
			let row = body.insertRow(-1); //Inserisce la riga nel tbody all'ultima posizione

			let t_name = row.insertCell(0);
			let t_season = row.insertCell(1);
			let stats_pts = row.insertCell(2);
			let stats_min = row.insertCell(3);
			let split = sessionStorage.getItem(data).split(" ");
			t_name.innerText = split[0] + " " + split[1];
			t_season.innerText = split[2];
			stats_pts.innerText = split[3];
			stats_min.innerText = split[4];

			row.addEventListener('dblclick', (e) => {
				row.parentNode.removeChild(row);
				sessionStorage.removeItem(split[0] + " " + split[1] + " " + split[2]);
				if(body.rows.length == 0) score.style.display = "none";
			});
		});
	} else score.style.display = "none";

	btn.addEventListener('click', (e) => {
		e.preventDefault();
		stats(input_season.value, input_player.value);
	});
} else {
	var myChart = null;
	drawChart();
	
	btnc.addEventListener('click', (e) => {
		e.preventDefault();
		createChart(start_season.value, end_season.value, playerName.value, select.value);
	});
}


/*
funzione che dato il nome di un giocatore, ritorna il suo id se questo è presente
*/
async function playerIdByName(playerName) {
	var playerObj = await fetch("https://www.balldontlie.io/api/v1/players?search="+playerName, {
		method: "GET"
	});
	
	let player = await playerObj.json();
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

	let stats = await statsObj.json();
	return stats.data;
}

/*
funizione sincrona che data la stagione e il nome del giocatore, richiama a sua volta prima la funzione asincrona
per ottenere l'id tramite il nome del giocatore, se questo esiste, e una volta ottenuto, verrà richiamata la funzione asincrona per ottenere 
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
								if(!sessionStorage.getItem(data[0].first_name + " " + data[0].last_name + " " + season)) {
									input_player.value = "";
									input_season.value = "";
									error.innerText = "";
									if(score.style.display === "none") score.style.display = "block";

									let row = body.insertRow(-1); //Inserisce la riga nel tbody all'ultima posizione

									let t_name = row.insertCell(0);
									let t_season = row.insertCell(1);
									let stats_pts = row.insertCell(2);
									let stats_min = row.insertCell(3);
									t_name.innerText = data[0].first_name + " " + data[0].last_name;
									t_season.innerText = season;
									stats_pts.innerText = stats[0].pts;
									stats_min.innerText = stats[0].min;
									sessionStorage.setItem(data[0].first_name + " " + data[0].last_name + " " + season, data[0].first_name + " " + data[0].last_name + " " + season + " " + stats[0].pts + " " + stats[0].min);

									row.addEventListener('dblclick', (e) => {
										row.parentNode.removeChild(row);
										sessionStorage.removeItem(data[0].first_name + " " + data[0].last_name + " " + season);
										if(body.rows.length == 0) score.style.display = "none";
									});
								} else error.innerText = "Il giocatore " + data[0].first_name + " " + data[0].last_name + " nella stagione " + season + " è già presente nella tabella";
							}
						}
					)
				} else {
					var stats = JSON.parse(localStorage.getItem(season + " " + data[0].id));
					if (stats.length < 1) {
						error.innerText = "Non ci sono statitiche riguandanti il giocatore: "+ data[0].first_name + " " + data[0].last_name +" nella stagione " + season;
					} else {
						if(!sessionStorage.getItem(data[0].first_name + " " + data[0].last_name + " " + season)) {
							input_player.value = "";
							input_season.value = "";
							error.innerText = "";
							if(score.style.display === "none") score.style.display = "block";

							let row = body.insertRow(-1); //Inserisce la riga nel tbody all'ultima posizione

							let t_name = row.insertCell(0);
							let t_season = row.insertCell(1);
							let stats_pts = row.insertCell(2);
							let stats_min = row.insertCell(3);
							t_name.innerText = data[0].first_name + " " + data[0].last_name;
							t_season.innerText = season;
							stats_pts.innerText = stats[0].pts;
							stats_min.innerText = stats[0].min;
							sessionStorage.setItem(data[0].first_name + " " + data[0].last_name + " " + season, data[0].first_name + " " + data[0].last_name + " " + season + " " + stats[0].pts + " " + stats[0].min);

							row.addEventListener('dblclick', (e) => {
								row.parentNode.removeChild(row);
								sessionStorage.removeItem(data[0].first_name + " " + data[0].last_name + " " + season);
								if(body.rows.length == 0) score.style.display = "none";
							});
						} else error.innerText = "Il giocatore " + data[0].first_name + " " + data[0].last_name + " nella stagione " + season + " è già presente nella tabella";
					}
				}
			}
		}
	);
}

/**
* Parte dedicata alle funzioni per il file IndividualStats-chart
*/
var start_season = document.getElementById("start_season");
var end_season = document.getElementById("end_season");

function createChart(s_season, e_season, player, option) {
	if (player == "") {
		error.innerText = "Devi inserire il nome di un giocatore";
		return;
	}

	if(s_season >= e_season) {
		error.innerText = "La data di inizio non può essere maggiore o uguale della data di fine";
		return;
	}

	if(s_season == "" || e_season == "") {
		error.innerText = "Le date non possono essere vuote";
		return;
	}

	if(e_season - s_season >= 20) {
		error.innerText = "Il range di date è troppo ampio";
		return;
	}
	
	myChart.clear();
	myChart.data.labels = [];
	myChart.data.datasets[0].data = [];
	myChart.update();

	playerIdByName(player)
	.then(data => 
		{
			if (data.length > 1) {
				error.innerText = "Presenza di più " + player + "! inserisci il nome completo";
			} else if (data.length < 1) {
				error.innerText = "Non ci sono giocatori con il seguente nome: " + player;
			} else {
				for(let i = s_season; i <= e_season; i++) {
					var map = new Map();
					individualStats(i, data[0].id)
					.then(stats => {
						if(stats.length < 1) {
							switch(option) {
								case "Punti":
									map.set(i, 0);
									break;
								case "Minuti":
									map.set(i, 0);
									break;
								case "Assist":
									map.set(i, 0);
									break;
								case "Rimbalzi":
									map.set(i, 0);
									break;
								case "Palle rubate":
									map.set(i, 0);
									break;
							}
						} else {
							switch(option) {
								case "Punti":
									map.set(i, stats[0].pts);
									break;
								case "Minuti":
									map.set(i, stats[0].min.replace(":", "."));
									break;
								case "Assist":
									map.set(i, stats[0].ast);
									break;
								case "Rimbalzi":
									map.set(i, stats[0].reb);
									break;
								case "Palle rubate":
									map.set(i, stats[0].stl);
									break;
							}
						}
						//Dato che sono in ordine sparso per la funzione async, vengono riordinati
						if(map.size == (e_season - s_season) + 1) {
							st = new Map([...map].sort((a, b) => String(a[0]).localeCompare(b[0])))
							//console.log(st);
							st.forEach((v,k) => {
								myChart.data.labels.push(k);
								myChart.data.datasets[0].data.push(v);
							});
							myChart.update();
						}
					}).catch(error => {
						console.error("Errore " + error);
					})
				}
				
				myChart.options.plugins.title.text = data[0].first_name + " " + data[0].last_name;
				myChart.data.datasets[0].label = option;
				myChart.update();

				error.innerText = "";			
			}
		}
	);
}

function drawChart() {
	const ctx = document.getElementById('myChart').getContext('2d');
	myChart = new Chart(ctx, {
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
			maintainAspectRatio: false,
	        scales: {
	            y: {
	                beginAtZero: true
	            }
	        },
			plugins: {
				title: {
					display: true,
					text: ''
				}
			}
	    }
	});
}