async function getPlayerByTeam() {
	var response = await fetch("https://www.balldontlie.io/api/v1/teams", {
		method: "GET"
	});

	var jsonObj = await response.json();
	console.log(jsonObj);	
}


getPlayerByTeam();

