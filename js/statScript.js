/**
var set = {};
async function getAllPlayersByTeam() {
	let i = 1;
	do {
		var object = await fetch("https://www.balldontlie.io/api/v1/players?page="+i+"&per_page=100", {
			method: "GET"
		});
		var jsonP = await object.json();
		for (let j = 0; j <= Object.keys(jsonP.data).at(-1); j++) {
			if(set[jsonP.data[j].team.id] != undefined) {
				set[jsonP.data[j].team.id].players.push({
					id : jsonP.data[j].id,
					firstname : jsonP.data[j].first_name,
					lastname : jsonP.data[j].last_name,
					role : jsonP.data[j].position
				})				
			} else {
				set[jsonP.data[j].team.id] = {
					team: jsonP.data[j].team.full_name,
					abbreviation : jsonP.data[j].team.abbreviation,
					players : [{
						id : jsonP.data[j].id,
						firstname : jsonP.data[j].first_name,
						lastname : jsonP.data[j].last_name,
						role : jsonP.data[j].position
					}]
				}
			}
		}
		i++;
	} while(jsonP.meta.next_page != null);
	console.log(set);
}
**/

var input_player = document.getElementById("playerName");
var input_season = document.getElementById("season");
var btn = document.getElementById("searchPlayer");
var score = document.getElementById("score");

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
	var statsObj = await fetch("https://www.balldontlie.io/api/v1/season_averages?season="+season+"&player_ids[]="+player_id, {
		method: "GET"
	});

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
	season = season === "" ? new Date().getFullYear() - 1: season;

	playerIdByName(playerName)
	.then(data => 
		{
			if (data.length > 1) {
				alert("Presenza di più " + playerName + "! inserisci il nome completo");
			} else if (data.length < 1) {
				alert("Non ci sono giocatori con il seguente nome: " + playerName);
			} else {
				if(localStorage.getItem(season + " " + data[0].id) == null) {
					individualStats(season, data[0].id)
					.then(stats => 
						{
							localStorage.setItem(season + " " + data[0].id, JSON.stringify(stats));
							if (stats.length > 1) {
								alert("Inserisci nome e conogme");
							} else if (stats.length < 1) {
								alert("Non ci sono statitiche riguandanti il giocatore: "+ data[0].first_name + " " + data[0].last_name +" nella stagione " + season);
							} else {
								let div = document.createElement("div");
								div.setAttribute("id", data[0].id);
								div.addEventListener('dblclick', (e) => {
									score.removeChild(div);
								});
								let textnode = document.createTextNode("Nome : " + data[0].first_name + " " + data[0].last_name +" \nStagione: "+ season +" Media punti : " + stats[0].pts +" Media minuti giocati : " + stats[0].min);
								div.appendChild(textnode);
								document.getElementById('score').appendChild(div)
							}
						}
					)
				} else {
					var stats = JSON.parse(localStorage.getItem(season + " " + data[0].id));
					if (stats.length > 1) {
						alert("Inserisci nome e conogme");
					} else if (stats.length < 1) {
						alert("Non ci sono statitiche riguandanti il giocatore: "+ data[0].first_name + " " + data[0].last_name +" nella stagione " + season);
					} else {
						let div = document.createElement("div");
						div.setAttribute("id", data[0].id);
						div.addEventListener('dblclick', (e) => {
							score.removeChild(div);
						});
						let textnode = document.createTextNode("Nome : " + data[0].first_name + " " + data[0].last_name +" Stagione: "+ season +" Media punti : " + stats[0].pts +" Media minuti giocati : " + stats[0].min);
						div.appendChild(textnode);
						document.getElementById('score').appendChild(div)
					}
				}
			}
		}
	);
}