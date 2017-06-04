var bestNameSorted = [];
var bestScoresSorted = [];
var players = JSON.parse(localStorage.getItem("Scores"));
var a, b;

window.onload = function(){
	sortScores();
}

function sortScores(){
	for (var i=0;i<players.length;++i){
		for (var j=i+1;j<players.length;++j){
			if (players[i].score < players[j].score){
				a = players[i].name;
				players[i].name = players[j].name;
				players[j].name = a;
				
				b = players[i].score;
				players[i].score = players[j].score;
				players[j].score = b;
			}
		}
	}
	makeTop10();
}

function makeTop10(){
	for(var i=0;i<10;i++){
		document.getElementById("top"+(i+1)+"name").innerHTML = players[i].name;
		document.getElementById("top"+(i+1)+"score").innerHTML = players[i].score;
	}
	
}