window.onload = function(){
  topTen();
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

    function topTen(){
    var games = JSON.parse(localStorage.getItem("games"));
    var content = document.getElementsByClassName('top10Scores')[0];
    games.sort(compareS);
	
    for(i=0; i<10; i++){
      content.innerHTML += "<li>"+games[i].name+" — "+games[i].score+" punkti"+"</li>";
      }


}
