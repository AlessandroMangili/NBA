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

async function getAllPlayers() {
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

async function stats() {
	var obj = await fetch("https://www.balldontlie.io/api/v1/season_averages?season=2000&player_ids[]=1043", {
		method: "GET"
	});

	var statistiche = await obj.json();
	console.log(statistiche);
}

stats();

