var set = {};

async function getAllTeams() {
	var teams = await fetch("https://www.balldontlie.io/api/v1/teams", {
		method: "GET"
	});

	var jsonT = await teams.json();


	for (let i = 0; i <= Object.keys(jsonT.data).at(-1); i++) {
		document.getElementById('teams').innerHTML += "<div id='icon'><img width='75px' src='./Loghi/"+ jsonT.data[i].name +".png' alt='"+ jsonT.data[i].name +".png'></img></div> <p>"+ jsonT.data[i].full_name + "</p>";
	}
}

//getAllPlayers();

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

//playerIdByName("giannis an").then(data => console.log(data));
// Funzione che dato il nome di un giocatore, ritorna il suo id se questo è presente
async function playerIdByName(playerName) {
	var playerObj = await fetch("https://www.balldontlie.io/api/v1/players?search="+playerName, {
		method: "GET"
	});
	
	var player = await playerObj.json();
	if (player.data.length > 1) {
		alert("Presenza di più " + playerName + "! inserisci il nome completo");
	} else if (player.data.length < 1) {
		alert("Non ci sono giocatori con il seguente nome: " + playerName);
	} else {
		return player.data[0].id;
	}
}

//individualStats(2002, 1043);
playerIdByName("kobe bryant")
	.then(
		data => individualStats(2002, data)
		.then(
			stats => console.log(stats) + console.log(stats.data[0].pts)
		)
	);
// Funzione che data la stagione e l'id di un giocatore, ritorna le statistiche per quella stagione se il giocatore esiste e se ha giocato in quella stagione
async function individualStats(season, player_id) {
	if (season != null) {
		var statsObj = await fetch("https://www.balldontlie.io/api/v1/season_averages?season="+season+"&player_ids[]="+player_id, {
			method: "GET"
		});
	} else {
		var statsObj = await fetch("https://www.balldontlie.io/api/v1/season_averages?player_ids[]="+player_id, {
			method: "GET"
		});	
	}
	var stats = await statsObj.json();
	if (stats.data.length > 1) {
		alert("Inserisci nome e conogme");
	} else if (stats.data.length < 1) {
		alert("Non ci sono statitiche riguandanti il giocatore selezionato nella stagione " + season);
	} else {
		return stats;
	}
}

