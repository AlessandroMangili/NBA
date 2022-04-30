/*var set = {
	[key] : {
		team: "ciao",
		abbreviation: "",
		players : [{
			id : "",
			firstname : "",
			lastname : "",
			role : "",
		}]
	}
}*/
var set = {};

/**{ 
 * 		1 : 
 * 		{
 * 			team : "Lakers",
 * 			abbrevation : "LA",
 * 			players : 
 * 			[
 * 				[ 
 * 					id : "10",
 * 					firstname : "James",
 * 					lastname : "Lebron",
 * 					role : "R",
 * 				]
 * 				[
 *	 				id : "10",
 * 					firstname : "James",
 * 					lastname : "Lebron",
 * 					role : "R",
 * 				]
 * 			]
 * 		}
 * 		2 :
 * 		{ 
 * 			team : "Lakers",
 * 			abbrevation : "LA",
 * 			players : 
 * 			[
 * 				[ 
 * 					id : "10",
 * 					firstname : "James",
 * 					lastname : "Lebron",
 * 					role : "R",
 * 				]
 * 				[
 *	 				id : "10",
 * 					firstname : "James",
 * 					lastname : "Lebron",
 * 					role : "R",
 * 				]
 * 			]
 * 		}
 * }
 * 
 * 
 * 
 **/

async function getAllTeams() {
	var teams = await fetch("https://www.balldontlie.io/api/v1/teams", {
		method: "GET"
	});

	var jsonT = await teams.json();


	for (let i = 0; i <= Object.keys(jsonT.data).at(-1); i++) {
		document.getElementById('teams').innerHTML += "<div id='icon'><img width='75px' src='./Loghi/"+ jsonT.data[i].name +".png' alt='"+ jsonT.data[i].name +".png'></img></div> <p>"+ jsonT.data[i].full_name + "</p>";
	}
}

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

getAllPlayers();

