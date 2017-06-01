window.onload = function() {
	top10();
};

//Function to compare scores
function compareScores(p1, p2) {

	if (p1.score > p2.score) {
		return -1;
	}

	if (p1.score < p2.score) {
		return 1;
	}

	return 0;

}

function top10() {
	var session = JSON.parse(localStorage.getItem("session"));
	var content = document.getElementsByClassName('top10_players')[0];
	//console.log(content);
	//document.getElementsByClassName('top10_players')[0].style.color = "red";
	session.sort(compareScores);
	//console.log(session);


	for (i = 0; i < 10; i++) {
		content.innerHTML += "<li>" + session[i].name + " - " + session[i].score + "</li>";
		//console.log(content);
	}
}