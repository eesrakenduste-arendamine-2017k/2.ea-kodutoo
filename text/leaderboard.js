window.onload = function() {
  leaderboard();
};


function scores(a, b) {
  if (a.score > b.score) {
	return -1;
	}
  if (a.score < b.score) {
	return 1;
  }
	return 0;
}

function leaderboard() {
  var session = JSON.parse(localStorage.getItem("session"));
  var content = document.getElementsByClassName('LeaderboardPlayers')[0];

  session.sort(scores);

  for (i = 0; i < session.length; i++) {
    content.innerHTML += "<li>" + "Name: " + session[i].name + " | Score: " + "<font class=red>" + session[i].score + "</font>" + "</li>";
  }
}