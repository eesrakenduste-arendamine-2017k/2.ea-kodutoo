window.onload = function(){
	leaderboard();
};

function scores(p1,p2){
	
	if (p1.score > p2.score){
		return -1;
	}
	
	if(p1.score < p2.score){
		return 1;
	}
	return 0;
}

function leaderboard(){
  var session = JSON.parse(localStorage.getItem("session"));
  var content = document.getElementsByClassName('leaderboardplayer')[0];

  session.sort(scores);

  for (i = 0; i < session.length; i++) {
    content.innerHTML += "<li>" + "Nimi: " + session[i].name + " | Skoor: " + session[i].score"</li>";
  }
}