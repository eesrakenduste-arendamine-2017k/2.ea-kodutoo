window.onload = function() {
	Leaderboard();
};

function compareScores(p1, p2) {

	if (p1.score > p2.score) {
		return -1;
	}

	if (p1.score < p2.score) {
		return 1;
	}

	return 0;

}

function Leaderboard() {
	var session = JSON.parse(localStorage.getItem("session"));
	var content = document.getElementsByClassName('Leaderboard_players')[0];

	session.sort(compareScores);

	for (i = 0; i < session.length; i++) {
		content.innerHTML += "<li>" + "Name: " + session[i].name + " | Score: " + session[i].score + " | Mistakes: " + session[i].misclicks + "</li>";
	}
}