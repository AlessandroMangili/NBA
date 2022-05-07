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
		$owl.trigger('add.owl.carousel', ['<div class="card"> <div class="ms-2 me-2"><a value="'+ json.data[i].name +'" onclick="getPlayersTeam(this.getAttribute('+"'value'"+'))" href="#!"><img src="./Loghi/'+ json.data[i].name +'.png" class="card-img-top"></a><div class="card-body">'+ json.data[i].full_name +'</div> </div> </div>']).trigger("refresh.owl.carousel");	
	}
}

function getPlayersTeam(team_name) {
	alert(team_name);
}



