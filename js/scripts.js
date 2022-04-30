async function getAllTeams() {
	var teams = await fetch("https://www.balldontlie.io/api/v1/teams", {
		method: "GET"
	});

	var jsonT = await teams.json();

	for (let i = 0; i <= Object.keys(jsonT.data).at(-1); i++) {
		document.getElementById('teams').innerHTML += "<div id='icon'><img width='75px' src='./Loghi/"+ jsonT.data[i].name +".png' alt='"+ jsonT.data[i].name +".png'></img>"+ jsonT.data[i].full_name + "</div>";
	}
}

async function getAllPlayers() {
	var players = [];

	let i = 1;

	do {
		var object = await fetch("https://www.balldontlie.io/api/v1/players?page="+i+"&per_page=100", {
			method: "GET"
		});
		var jsonP = await object.json();

		for (let j = 0; j <= Object.keys(jsonP.data).at(-1); j++) {
			let player = new Object();
			player.id_team = jsonP.data[j].team.id;
			player.team = jsonP.data[j].team.full_name;
			player.abbreviation = jsonP.data[j].team.abbreviation;
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

getAllPlayers();

