var $owl = $(".owl-carousel").owlCarousel({
	autoplay: true,
	autoplayhoverpause: true,
	autoplaytime: 100,
	loop: true,
	responsive: {
		0: {
			items: 2,
			dots: false
		},
		470 : {
			items: 3,
			dots: false
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

var player_div = document.getElementById("players4team")

/**
 * Funzione asincrona che interrogando le API, restituisce tutti i team attuali in NBA
 */
async function getAllTeams() {
	if(localStorage.getItem("teams") == null){
		//alert("Take data from API");
		var object = await fetch("https://www.balldontlie.io/api/v1/teams", {
			method: "GET"
		});
		var json = await object.json();
		localStorage.setItem("teams",JSON.stringify(json));
	} else {
		var json = JSON.parse(localStorage.getItem("teams"));
	}

	for (let i = 0; i <= Object.keys(json.data).at(-1); i++) {
		$owl.trigger('add.owl.carousel', ['<div class="card"> <div class="ms-2 me-2"><a value="'+ json.data[i].id +'" onclick="getPlayersTeam(this.getAttribute('+"'value'"+'))" href="#!"><img src="./Loghi/'+ json.data[i].name +'.png" class="card-img-top"></a><div class="card-body">'+ json.data[i].full_name +'</div> </div> </div>']).trigger("refresh.owl.carousel");	
	}
}

/**
 * Funzione che dato l'id di una squadra, inserisci nel tag id='players4team' i giocatori che giocano attualmente nella squadra
 */
function getPlayersTeam(team_id) {
	if(localStorage.getItem(team_id) == null) {
		httpGet("./Players_for_teams/player4teams.csv", function(request) {
			if(request.status == 200) {
				var csv = request.responseText
				var players = csv.split('\n');
				
				/**
				 * Rimuovere tutti i figli per quando viene selezionata un'altra squadra 
				 **/
				while (player_div.lastElementChild) {
	    			player_div.removeChild(player_div.lastElementChild);
	  			}

	  			for(let i = 0; i < players.length; i++) {
	  				let player = players[i].split(';');
	  				if (player[0] == team_id) {
						let div = document.createElement("div");
						div.setAttribute("id", player[1]);
						let textnode = document.createTextNode("Nome: " + player[1] + " Numero maglia: "+ player[2] +" Ruolo: " + player[3] +" Data di nascita : " + player[4]);
						div.appendChild(textnode);
						player_div.appendChild(div);
	  				}
	  			}
	  			localStorage.setItem(team_id, player_div.outerHTML);
			} else {
				alert("La lettura del file non è avvenuta correttamente");
			}
		});
	} else {
		/**
		 * Rimuovere tutti i figli per quando viene selezionata un'altra squadra 
		 **/
		while (player_div.lastElementChild) {
			player_div.removeChild(player_div.lastElementChild);
		}

		player_div.innerHTML = localStorage.getItem(team_id);
	}
}

/**
 * Funzione che dato l'url, restituisce il file letto
 */
function httpGet(url, callback) {
	const request = new XMLHttpRequest();

	request.open('get', url, true);
	request.onload = function () {
		callback(request);
	};
	request.send();
}

