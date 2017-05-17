window.onload = function(){
  statistics();
};

	function compareS(p1, p2){
	if(p1.score > p2.score){
	  return -1;
}

if(p1.score < p2.score){
  return 1;
}

return 0;

}

function statistics(){
	var games = JSON.parse(localStorage.getItem("games"));
	var content = document.getElementsByClassName('statisticsResult')[0];

	games.sort(compareS);

	for(i=0; i<games.length; i++){
		if (games[i].score < 1 && games[i].mistakes >= 0){
			content.innerHTML += "<li>"+"Nimi: "+games[i].name+" — Punkte: "+games[i].score+" — Vigu: "+games[i].mistakes+"— Täpsus: 0%"+"</li>";
	}else{
		content.innerHTML += "<li>"+"Nimi: "+games[i].name+" — Punkte: "+games[i].score+" — Vigu: "+games[i].mistakes+"— Täpsus: "+Math.round(games[i].score/(games[i].score+games[i].mistakes)*100*100)/100+"%"+"</li>";	
	}
	}
}