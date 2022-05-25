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

var player_div = document.getElementById("players4team");

/**
 * Funzione asincrona che interrogando le API, restituisce tutti i team attuali in NBA
 */
async function getAllTeams() {
	if(localStorage.getItem("teams") == null){
		var object = await fetch("https://www.balldontlie.io/api/v1/teams", {
			method: "GET"
		});
		var json = await object.json();
		localStorage.setItem("teams",JSON.stringify(json));
	} else {
		var json = JSON.parse(localStorage.getItem("teams"));
	}

	for (let i = 0; i <= Object.keys(json.data).at(-1); i++) {
		$owl.trigger('add.owl.carousel', ['<div class="card"> <div class="ms-2 me-2"><a value="'+ json.data[i].id +'" onclick="getPlayersTeam(this.getAttribute('+"'value'"+'))" href="#!"><img src="loghi/'+ json.data[i].name +'.png" class="card-img-top"></a><div class="card-body">'+ json.data[i].full_name +'</div> </div> </div>']).trigger("refresh.owl.carousel");	
	}
}

/**
 * Funzione che dato l'id di una squadra, inserisci nel tag id='players4team' i giocatori che giocano attualmente nella squadra
 */
function getPlayersTeam(team_id) {
	if(localStorage.getItem(team_id) == null) {
		httpGet("data/player4teams.csv", function(request) {
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
						
						let div1 = document.createElement("div");
						div1.setAttribute("class", "col-sm-4 pb-2");
						let container = document.createElement("div");
						container.setAttribute("class", "card-container");

						let front = document.createElement("div");
						front.setAttribute("class", "card border-secondary card-front text-center");
						front.setAttribute("id", player[1]+"f");
						let header = document.createElement("div");
						header.setAttribute("class", "card-header");
						let maglia = document.createElement("h5");
						maglia.innerText = player[2];
						header.appendChild(maglia);
						let body = document.createElement("div");
						body.setAttribute("class", "card-body");
						let title = document.createElement("h5");
						title.setAttribute("class", "card-title");
						title.innerText =  player[1];
						body.appendChild(title);
						let ruolo = document.createElement("p");
						ruolo.setAttribute("class", "card-text");
						ruolo.innerText =  player[3];
						body.appendChild(ruolo);
						let nascita = document.createElement("p");
						nascita.setAttribute("class", "card-text");
						nascita.innerText =  player[6];
						body.appendChild(nascita);
						let a = document.createElement("a");
						a.setAttribute("class", "btn btn-primary");
						a.setAttribute("href", "#!");
						a.innerText = "Full bio";
						a.addEventListener('click', () => {
							front.classList.add("card-front-rotate");
							document.getElementById(player[1]+"b").classList.remove("card-back");
							document.getElementById(player[1]+"b").classList.add("card-back-rotate");
							/*front.style.transform = "rotateY(180deg)";
							document.getElementById(player[1]+"b").style.transform = "rotateY(0deg)";*/
						});
						body.appendChild(a);

						front.appendChild(header);
						front.appendChild(body);

						let back = document.createElement("div");
						back.setAttribute("class", "card border-secondary card-back text-center");
						back.setAttribute("id", player[1]+"b");
						let header_back = document.createElement("div");
						header_back.setAttribute("class", "card-header");
						let maglia_back = document.createElement("h5");
						maglia_back.innerText = player[2];
						header_back.appendChild(maglia_back); 
						let body_back = document.createElement("div");
						body_back.setAttribute("class", "card-body");
						let a_back = document.createElement("a");
						a_back.setAttribute("class", "btn btn-primary");
						a_back.setAttribute("href", "#!"); 
						a_back.innerText = "Back";
						a_back.addEventListener('click', () => {
							back.classList.remove("card-back-rotate");
							back.classList.add("card-back");
							document.getElementById(player[1]+"f").classList.remove("card-front-rotate");
							/*back.style.transform = "rotateY(180deg)";
							document.getElementById(player[1]+"f").style.transform = "rotateY(0deg)";*/
						});
						body_back.appendChild(a_back);

						back.appendChild(header_back);
						back.appendChild(body_back);

						container.appendChild(front);
						container.appendChild(back);
						div1.appendChild(container);
						player_div.appendChild(div1);
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