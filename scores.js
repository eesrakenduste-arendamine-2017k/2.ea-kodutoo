window.onload = function() {
  highScores();
};

function orderScores(p1, p2) {
    if (p1.score > p2.score) {
        return -1;
    }
    if (p1.score < p2.score) {
        return 1;
    }
    return 0;
}

function highScores() {
    var session = JSON.parse(localStorage.getItem("session"));
    var content = document.getElementsByClassName('topScore')[0];

    session.sort(orderScores);

    for (i = 0; i < session.length; i++) {
        content.innerHTML += "Score: " + session[i].score + "<br> Typos: " + session[i].typos + "<br> Name: " + session[i].name + "<br><br>";
    }
}