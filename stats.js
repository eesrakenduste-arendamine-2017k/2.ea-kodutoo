//console.log(window.location.href);
if (window.location.href=="http://www.tlu.ee/~lauriv/ER/stats.html") {
  window.onload= function () {
    stats();
  };
}else {
  window.onload = function() {
    top10();
  };
}
function compareScores(p1, p2) {
  if (p1.score > p2.score) {
    return -1;
  }if (p1.score < p2.score) {
    return 1;
  }
  return 0;
}

function top10() {
  var session = JSON.parse(localStorage.getItem("session"));
  var content = document.getElementsByClassName('top10_players')[0];
  //console.log(content);

  session.sort(compareScores);

  for (i = 0; i < 10; i++) {
    content.innerHTML += "<li>" + session[i].name + " - " + session[i].score + " Õigeid sõnu: " + session[i].level + "</li>";
  }
}
function stats() {
  var session = JSON.parse(localStorage.getItem("session"));
  var content = document.getElementsByClassName('stats_players')[0];

  session.sort(compareScores);

  for (i = 0; i < session.length; i++) {
    content.innerHTML += "<li>" + "Nimi: " + session[i].name + " | Skoor: " + session[i].score + " | Vigu: " + session[i].mistakes + " | Õigeid sõnu: " + session[i].level + "</li>";
  }
}
