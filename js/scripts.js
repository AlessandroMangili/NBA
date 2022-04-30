function getAllTeams() {
	var teams = await fetch("https://www.balldontlie.io/api/v1/teams", {
		method: "GET"
	});

	var jsonT = await teams.json();
	console.log(jsonT);
}

async function getAllPlayers() {
	var player = {
		id_team: "",
		team: "",
		abbreviation: "",
		id: "",
		firstname: "",
		lastname: "",
		role: ""
	}

	var players = [];

	let i = 1;

	do {
		var object = await fetch("https://www.balldontlie.io/api/v1/players?page="+i+"&per_page=100", {
			method: "GET"
		});
		var jsonP = await object.json();
		console.log(jsonP);

		for (let j = 0; j <= Object.keys(jsonP.data).at(-1); j++) {
			player.id_team = jsonP.data[j].team.id;
			player.team = jsonP.data[j].full_name;
			player.abbreviation = jsonP.data[j].abbreviation;
			player.id = jsonP.data[j].id;
			player.firstname = jsonP.data[j].first_name;
			player.lastname = jsonP.data[j].last_name;
			player.role = jsonP.data[j].position;

			players.push(player);
		}
		i++;
	} while(jsonP.meta.next_page != null);
	console.log(players);
}

getAllTeams();
getAllPlayers();

