var player = [];
var games = [];
var game = {
  id: parseInt(1000000+Math.random()*999999),
  name: "Tundmatu",
  score: 0,
  mistakes: 0,
  guessedWords: 0
};
var gamesFromStorage = null;

var TYPER = function(){

	//singleton
    if (TYPER.instance_) {
      return TYPER.instance_;
    }
    TYPER.instance_ = this;

    this.routes = TYPER.routes;

	// Muutujad
	this.WIDTH = window.innerWidth;
	this.HEIGHT = window.innerHeight;
	this.canvas = null;
	this.ctx = null;

	this.words = []; // kõik sõnad
	this.word = null; // preagu arvamisel olev sõna
	this.word_min_length = 3;
	this.guessed_words = 0; // arvatud sõnade arv
  this.mistakes = 0;

	//mängija objekt, hoiame nime ja skoori
	this.player = {name: null, score: 0, mistakes: 0, guessedWords: 0};

	this.init();
};

TYPER.routes = {
  'home-view': {
    'render': function(){
      // käivitame siis kui lehte laeme
      console.log('>>>>avaleht');
    }
  },
  'game-view': {
    'render': function(){
      // käivitame siis kui lehte laeme
      console.log('>>>>game');
    }
  }
};

TYPER.prototype = {

	// Funktsioon, mille käivitame alguses
	init: function(){

    //kuulan aadressirea vahetust, ehk kui aadressireale tuleb #lehe nimi
    window.addEventListener('hashchange', this.routeChange.bind(this));

    // kui aadressireal ei ole hashi siis lisan juurde, et avaleht
    if(!window.location.hash){
      window.location.hash = 'home-view';
      // routechange siin ei ole vaja sest käsitsi muutmine käivitab routechange event'i ikka
    }else{
      //esimesel käivitamisel vaatame urli üle ja uuendame menüüd
      this.routeChange();
    }

		// Lisame canvas elemendi ja contexti
		this.canvas = document.getElementsByTagName('canvas')[0];
		this.ctx = this.canvas.getContext('2d');

		// canvase laius ja kõrgus veebisirvija akna suuruseks (nii style, kui reso)
		this.canvas.style.width = this.WIDTH + 'px';
		this.canvas.style.height = ((this.HEIGHT)-60) + 'px';

		//resolutsioon
		// kui retina ekraan, siis võib ja peaks olema 2 korda suurem
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;

		// laeme sõnad
		this.loadWords();
	},

  routeChange: function(event){

    //kirjutan muuutujasse lehe nime, võtan maha #
    this.currentRoute = location.hash.slice(1);
    console.log(this.currentRoute);

    //kas meil on selline leht olemas?
    if(this.routes[this.currentRoute]){

      //muudan menüü lingi aktiivseks
      this.updateMenu();

      this.routes[this.currentRoute].render();

    }else{
      // 404 - ei olnud
    }


  },

  updateMenu: function() {
    //http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
    //1) võtan maha aktiivse menüülingi kui on
    document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');

    //2) lisan uuele juurde
    //console.log(location.hash);
    document.querySelector('.'+this.currentRoute).className += ' active-menu';
  },


	loadPlayerData: function(){

		// küsime mängija nime ja muudame objektis nime
		var p_name = prompt("Sisesta mängija nimi");

		// Kui ei kirjutanud nime või jättis tühjaks
		if(p_name === null || p_name === ""){
			p_name = "Tundmatu";

		}

		// Mänigja objektis muudame nime
		this.player.name = p_name; // player =>>> {name:"Tundmatu", score: 0}

    player = this.player;
    game.name = p_name;

	},

	loadWords: function(){

		console.log('loading...');

		// AJAX http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_first
		var xmlhttp = new XMLHttpRequest();

			// määran mis juhtub, kui saab vastuse
		xmlhttp.onreadystatechange = function(){

			//console.log(xmlhttp.readyState); //võib teoorias kõiki staatuseid eraldi käsitleda

			// Sai faili tervenisti kätte
			if(xmlhttp.readyState == 4 && xmlhttp.status == 200){

				console.log('successfully loaded');

				// serveri vastuse sisu
				var response = xmlhttp.responseText;
				//console.log(response);

				// tekitame massiivi, faili sisu aluseks, uue sõna algust märgib reavahetuse \n
				var words_from_file = response.split('\n');
				//console.log(words_from_file);

				// Kuna this viitab siin xmlhttp päringule siis tuleb läheneda läbi avaliku muutuja
				// ehk this.words asemel tuleb kasutada typerGame.words

				//asendan massiivi
				typerGame.words = structureArrayByWordLength(words_from_file);
				console.log(typerGame.words);

				// küsime mängija andmed
				typerGame.loadPlayerData();

				// kõik sõnad olemas, alustame mänguga
				typerGame.start();
			}
		};

		xmlhttp.open('GET','./lemmad2013.txt',true);
		xmlhttp.send();
	},

	start: function(){

		// Tekitame sõna objekti Word
		this.generateWord();
		//console.log(this.word);

        //joonista sõna
		this.word.Draw();

		// Kuulame klahvivajutusi
		window.addEventListener('keypress', this.keyPressed.bind(this));

	},

    generateWord: function(){

        // kui pikk peab sõna tulema, + min pikkus + äraarvatud sõnade arvul jääk 5 jagamisel
        // iga viie sõna tagant suureneb sõna pikkus ühe võrra
        var generated_word_length =  this.word_min_length + parseInt(this.guessed_words/8);

    	// Saan suvalise arvu vahemikus 0 - (massiivi pikkus -1)
    	var random_index = (Math.random()*(this.words[generated_word_length].length-1)).toFixed();

        // random sõna, mille salvestame siia algseks
    	var word = this.words[generated_word_length][random_index];

    	// Word on defineeritud eraldi Word.js failis
        this.word = new Word(word, this.canvas, this.ctx);
    },

	keyPressed: function(event){

		//console.log(event);
		// event.which annab koodi ja fromcharcode tagastab tähe
		var letter = String.fromCharCode(event.which);
		//console.log(letter);

		// Võrdlen kas meie kirjutatud täht on sama mis järele jäänud sõna esimene
		//console.log(this.word);
		if(letter === this.word.left.charAt(0)){

			// Võtame ühe tähe maha
			this.word.removeFirstLetter();

			// kas sõna sai otsa, kui jah - loosite uue sõna

			if(this.word.left.length === 0){

				this.guessed_words += 1;

          //update player score
          this.player.guessedWords = this.guessed_words;
          this.player.score += this.word.word.length;

				//loosin uue sõna
				this.generateWord();
			}

			//joonistan uuesti
			this.word.Draw();
		}
    else {
      this.mistakes += 1;
      this.player.mistakes = this.mistakes;
      this.player.score -= 1;
    }

	} // keypress end

};


/* HELPERS */
function structureArrayByWordLength(words){
    // TEEN massiivi ümber, et oleksid jaotatud pikkuse järgi
    // NT this.words[3] on kõik kolmetähelised

    // defineerin ajutise massiivi, kus kõik on õiges jrk
    var temp_array = [];

    // Käime läbi kõik sõnad
    for(var i = 0; i < words.length; i++){

        var word_length = words[i].length;

        // Kui pole veel seda array'd olemas, tegu esimese just selle pikkusega sõnaga
        if(temp_array[word_length] === undefined){
            // Teen uue
            temp_array[word_length] = [];
        }

        // Lisan sõna juurde
        temp_array[word_length].push(words[i]);
    }

    return temp_array;
}


window.onload = function(){
	var typerGame = new TYPER();
	window.typerGame = typerGame;

  mood.addEventListener("click", function() {changeBground();} );

  if(localStorage.getItem("games")){
    gamesFromStorage = JSON.parse(localStorage.getItem("games"));

    if(gamesFromStorage){
      games = gamesFromStorage;
    }

  }

  games.push(game);
  localStorage.setItem("games", JSON.stringify(games));

  var playerContainer = document.getElementById('statistics');
  var topGamesContainer = document.getElementById('topGames');
  playerContainer.innerHTML = getStatistics();

  if(games.length > 0) {
    getTopGames();
  }


  window.setInterval(function(){
    playerContainer.innerHTML = getStatistics();
    savescore(game.id, player.name, player.score, player.mistakes, player.guessedWords);
  }, 1000);

};

changeBground = function() {

  if (mood.style.backgroundColor == "rgb(51, 51, 51)") {
    document.body.style.backgroundColor = "#f2f2f2";
    canvas.style.backgroundColor = "#f2f2f2";
    mood.style.backgroundColor = "rgb(68, 68, 68)";
    main.style.color = "black";
  }
  else
  {
    document.body.style.backgroundColor = "rgb(51, 51, 51)";
    canvas.style.backgroundColor = "rgb(51, 51, 51)";
    mood.style.backgroundColor = "rgb(51, 51, 51)";
    main.style.color = "rgb(204, 204, 204)";
  }
};

savescore = function(gameId, name, newScore, newMistakes, newGuessedWords){

  games.forEach(function(game){

    if(gameId == game.id){
      game.name = name;
      game.score = newScore;
      game.mistakes = newMistakes;
      game.guessedWords = newGuessedWords;
      console.log('score uptated');
    }

  });
  localStorage.setItem("games", JSON.stringify(games.sort(compare)));
};

getStatistics = function() {

  var name = player.name;
  var score = player.score;
  var mistake = player.mistakes;
  var wordCount = player.guessedWords;

  return 'Kaustaja: <b>' + name + '</b><br>' + ' Skoor: <b>' + score + '</b><br>' + 'Vigu: <b>' + mistake + '</b><br>' + 'Kirjutatud sõnu kokku: <b>' + wordCount + '</b>';
};

compare = function(a,b) {
  if (a.score < b.score)
    return 1;
  if (a.score > b.score)
    return -1;
  return 0;
};

getTopGames = function() {

  if(games.length>1) {

    var heading = document.createElement("h3");
    var headingText = document.createTextNode("Senised kõrgeima skooriga mängud siin brauseris");
    heading.appendChild(headingText);
    document.getElementById("topGames").appendChild(heading);

    var captions = document.createElement("div");
    captions.className = 'captions';

    var playerNameSpan = document.createElement("h4");
    playerNameSpan.className = 'playerName';
    var playerName = document.createTextNode('Mängija nimi');
    playerNameSpan.appendChild(playerName);
    captions.appendChild(playerNameSpan);

    var playerScoreSpan = document.createElement("h4");
    playerScoreSpan.className = 'playerScore';
    var playerScore = document.createTextNode('Skoor');
    playerScoreSpan.appendChild(playerScore);
    captions.appendChild(playerScoreSpan);

    var playerMistakesSpan = document.createElement("h4");
    playerMistakesSpan.className = 'playerMistakes';
    var playerMistakes = document.createTextNode('Vigade arv');
    playerMistakesSpan.appendChild(playerMistakes);
    captions.appendChild(playerMistakesSpan);

    var playerGuessedWordsSpan = document.createElement("h4");
    playerGuessedWordsSpan.className = 'playerGuessedWords';
    var playerGuessedWords = document.createTextNode('Trükitud sõnade arv');
    playerGuessedWordsSpan.appendChild(playerGuessedWords);
    captions.appendChild(playerGuessedWordsSpan);

    document.getElementById("topGames").appendChild(captions);

  }

  i = 0;
  j = 10;

  if(games.length<10) {
    j = games.length - 1;
  }

  while ( i<j ) {

    var oneTopPlayer = document.createElement("div");
    oneTopPlayer.className = 'oneTopPlayer';

    var topNameSpan = document.createElement("span");
    topNameSpan.className = 'topName';
    var topName = document.createTextNode(games[i].name);
    topNameSpan.appendChild(topName);
    oneTopPlayer.appendChild(topNameSpan);

    var topScoreSpan = document.createElement("span");
    topScoreSpan.className = 'topScore';
    var topScore = document.createTextNode(games[i].score);
    topScoreSpan.appendChild(topScore);
    oneTopPlayer.appendChild(topScoreSpan);

    var topMistakesSpan = document.createElement("span");
    topMistakesSpan.className = 'topMistakes';
    var topMistakes = document.createTextNode(games[i].mistakes);
    topMistakesSpan.appendChild(topMistakes);
    oneTopPlayer.appendChild(topMistakesSpan);

    var topGuessedWordsSpan = document.createElement("span");
    topGuessedWordsSpan.className = 'topGuessedWords';
    var topGuessedWords = document.createTextNode(games[i].guessedWords);
    topGuessedWordsSpan.appendChild(topGuessedWords);
    oneTopPlayer.appendChild(topGuessedWordsSpan);

    document.getElementById("topGames").appendChild(oneTopPlayer);

    i++;
  }
};
