window.onload = function(){
  topTen();
};


    //Function to compare scores
    function compareScores(p1, p2){

    if(p1.score > p2.score){
      return -1;
    }

    if(p1.score < p2.score){
      return 1;
    }

    return 0;

    }

    //Making top10
    function topTen(){
    var games = JSON.parse(localStorage.getItem("games"));
    var content = document.getElementsByClassName('top10_players')[0];

    games.sort(compareScores);
    console.log(games);


    for(i=0; i<10; i++){
      content.innerHTML += "<li>"+games[i].name+"   "+games[i].score+"</li>";
      //console.log(content);
      }


}
