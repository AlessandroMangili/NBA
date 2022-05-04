var $owl = $(".owl-carousel").owlCarousel({
	autoplay: true,
	autoplayhoverpause: true,
	autoplaytime: 100,
	items: 4,
	loop: true,
	responsive: {
		0: {
			items: 2,
			dots: true
		},
		470 : {
			items: 3,
			dots: true
		},
		800 : {
			items: 5,
			dots: true
		},
		1100 : {
			items: 6,
			dots: true
		}
	}
});

async function getAllTeams() {
	var teams = await fetch("https://www.balldontlie.io/api/v1/teams", {
		method: "GET"
	});

	var jsonT = await teams.json();
	for (let i = 0; i <= Object.keys(jsonT.data).at(-1); i++) {
		//$("#owl-carousel").append('');
		$("#owl-carousel").append('<div class="item">New slide</div>');
		$owl.trigger('add.owl.carousel', ['<div class="card"> <div class="ms-2 me-2"><img src="./Loghi/'+ jsonT.data[i].name +'.png" class="card-img-top"> <div class="card-body">'+ jsonT.data[i].full_name +'</div> </div> </div>']).trigger("refresh.owl.carousel");	
	}
}

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

//playerIdByName("giannis an").then(data => console.log(data));
// Funzione che dato il nome di un giocatore, ritorna il suo id se questo è presente
async function playerIdByName(playerName) {
	var playerObj = await fetch("https://www.balldontlie.io/api/v1/players?search="+playerName, {
		method: "GET"
	});
	
	var player = await playerObj.json();
	return player.data;
}

/*playerIdByName(playerName)
	.then(
		data => individualStats(2002, data)
		.then(
			stats => console.log(stats) + console.log(stats.data[0].pts)
		)
	);
*/
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
	return stats.data;

}

function stats(season, playerName) {
	playerIdByName(playerName)
	.then(data => 
		{
			console.log(data);
			if (data.length > 1) {
				alert("Presenza di più " + playerName + "! inserisci il nome completo");
			} else if (data.length < 1) {
				alert("Non ci sono giocatori con il seguente nome: " + playerName);
			} else {
				individualStats(season, data[0].id)
				.then(stats => 
					{
						season = (season == null) ? "2021" : season;
						if (stats.length > 1) {
							alert("Inserisci nome e conogme");
						} else if (stats.length < 1) {
							alert("Non ci sono statitiche riguandanti il giocatore "+ playerName +" nella stagione " + season);
						} else {
							console.log(stats)
							console.log(stats[0].pts)
							document.getElementById('score').innerHTML = "<p>Nome : " + data[0].first_name + " " + data[0].last_name +"</p><p>Squadra : " + data[0].team.full_name +"</p><p>Stagione: "+ season +" </p><p>Media punti : " + stats[0].pts +"</p><p> Media minuti giocati : " + stats[0].min;
						}
					}
				)
			}
		}
	);
}

