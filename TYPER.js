var time;
var TYPER = function(){

	//singleton
    if (TYPER.instance_) {
        return TYPER.instance_;
    }
    TYPER.instance_ = this;

	// Muutujad
	this.WIDTH = window.innerWidth;
	this.HEIGHT = window.innerHeight;
	this.canvas = null;
	this.ctx = null;

	this.words = []; // koik sonad
	this.word = null; // preagu arvamisel olev sona
	this.word_min_length = 3;
	this.guessed_words = 0; // arvatud sonade arv

	//mangija objekt, hoiame nime ja skoori
	this.player = {name: null, score: 0};

	this.init();
};

TYPER.prototype = {

	// Funktsioon, mille kaivitame alguses
	init: function(){

		// Lisame canvas elemendi ja contexti
		this.canvas = document.getElementsByTagName('canvas')[0];
		this.ctx = this.canvas.getContext('2d');

		// canvase laius ja korgus veebisirvija akna suuruseks (nii style, kui reso)
		this.canvas.style.width = this.WIDTH + 'px';
		this.canvas.style.height = this.HEIGHT + 'px';

		//resolutsioon
		// kui retina ekraan, siis voib ja peaks olema 2 korda suurem
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;

		// laeme sonad
		this.loadWords();
	},

	loadPlayerData: function(){

		// kusime mangija nime ja muudame objektis nime
		var p_name = prompt("Please enter your name: ");

		// Kui ei kirjutanud nime voi jattis tuhjaks
		if(p_name === null || p_name === ""){
			p_name = "Unknown";

		}

		// Manigja objektis muudame nime
		this.player.name = p_name; // player =>>> {name:"Romil", score: 0}
        console.log(this.player);
		 document.getElementById("playerName").innerHTML = this.player.name;
	},

	loadWords: function(){

        console.log('loading...');

		// AJAX http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_first
		var xmlhttp = new XMLHttpRequest();

		// maaran mis juhtub, kui saab vastuse
		xmlhttp.onreadystatechange = function(){

			//console.log(xmlhttp.readyState); //voib teoorias koiki staatuseid eraldi kasitleda

			// Sai faili tervenisti katte
			if(xmlhttp.readyState == 4 && xmlhttp.status == 200){

                console.log('successfully loaded');

				// serveri vastuse sisu
				var response = xmlhttp.responseText;
				//console.log(response);

				// tekitame massiivi, faili sisu aluseks, uue sona algust margib reavahetuse \n
				var words_from_file = response.split('\n');
				//console.log(words_from_file);

                // Kuna this viitab siin xmlhttp paringule siis tuleb laheneda labi avaliku muutuja
                // ehk this.words asemel tuleb kasutada typerGame.words

				//asendan massiivi
				typerGame.words = structureArrayByWordLength(words_from_file);
				console.log(typerGame.words);

				// kusime mangija andmed
                typerGame.loadPlayerData();

				// koik sonad olemas, alustame manguga
				typerGame.start();
			}
		};

		xmlhttp.open('GET','./lemmad2013.txt',true);
		xmlhttp.send();
	},

	start: function(){
		
		time = 30;
		showTime = document.querySelector("#time");
		timer(time, showTime);

		// Tekitame sona objekti Word
		this.generateWord();
		//console.log(this.word);

        this.word.Draw();

		// Kuulame klahvivajutusi
		window.addEventListener('keypress', this.keyPressed.bind(this));

	},

generateWord: function(){

        // kui pikk peab sona tulema, + min pikkus + araarvatud sonade arvul jaak 5 jagamisel
        // iga viie sona tagant suureneb sona pikkus uhe vorra
        var generated_word_length =  this.word_min_length + parseInt(this.guessed_words/5);

    	// Saan suvalise arvu vahemikus 0 - (massiivi pikkus -1)
    	var random_index = (Math.random()*(this.words[generated_word_length].length-1)).toFixed();

        // random sona, mille salvestame siia algseks
    	var word = this.words[generated_word_length][random_index];

    	// Word on defineeritud eraldi Word.js failis
        this.word = new Word(word, this.canvas, this.ctx);
    },

	keyPressed: function(event){

		//console.log(event);
		// event.which annab koodi ja fromcharcode tagastab tahe
		var letter = String.fromCharCode(event.which);
		//console.log(letter);

		// Vordlen kas meie kirjutatud taht on sama mis jarele jaanud sona esimene
		//console.log(this.word);
		if(letter === this.word.left.charAt(0)){

			// Votame uhe tahe maha
			this.word.removeFirstLetter();

			// kas sona sai otsa, kui jah - loosite uue sona

			if(this.word.left.length === 0){

				this.guessed_words += 1;
				
                //update player score
                this.player.score = this.guessed_words;
				document.getElementById('score').innerHTML = this.guessed_words;
				

				//loosin uue sona
				this.generateWord();
			}

			//joonistan uuesti
			this.word.Draw();
		}

	} // keypress end

};


/* HELPERS */
function structureArrayByWordLength(words){
    // TEEN massiivi umber, et oleksid jaotatud pikkuse jargi
    // NT this.words[3] on koik kolmetahelised

    // defining temp array

    var temp_array = []

    // Kaime labi koik sonad
    for(var i = 0; i < words.length; i++){

        var word_length = words[i].length;

        // Kui pole veel seda array'd olemas, tegu esimese just selle pikkusega sonaga
        if(temp_array[word_length] === undefined){
            // Teen uue
            temp_array[word_length] = [];
        }

        // Lisan sona juurde
        temp_array[word_length].push(words[i]);
    }

    return temp_array;
}

var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.onload = function(){
	var typerGame = new TYPER();
	window.typerGame = typerGame;
};

var r;

function timer(time, showTime) {
  var timer = time,
    seconds;
    r = setInterval(function() {
    //minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    //minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? + seconds : seconds;

    showTime.textContent = seconds;

    if (--timer < 0) {
      var session = [];

      var game = {
        id: parseInt(1000 + Math.random() * 999),
        name: typerGame.player.name,
        score: typerGame.player.score,
      };
      var gamesFromStorage = null;

      if (localStorage.getItem("session")) {
        gamesFromStorage = JSON.parse(localStorage.getItem("session"));

        if (gamesFromStorage) {
          session = gamesFromStorage;
        }

      }

      session.push(game);

      localStorage.setItem("session", JSON.stringify(session));


      var replay = confirm("Time is out. Your score: " + typerGame.player.score + " Play again?");
      if (replay === true) {
        clearInterval(r);
        timer = time;
        location.reload(typerGame.start);
      } else {
        window.location.href = "1page.html";
      }

    }
    console.log("timer");
  }, 1000);
}