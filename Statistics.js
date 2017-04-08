window.onload = function(){
  statistics();
};


function compareScores(p1, p2){

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
var content = document.getElementsByClassName('statistics_players')[0];

games.sort(compareScores);

for(i=0; i<games.length; i++){
  content.innerHTML += "<li>"+"Name: "+games[i].name+" | Score: "+games[i].score+" | Mistakes: "+games[i].mistakes+"</li>";
  }
}
