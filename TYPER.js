var score = 0;
var mistakes = 0;
var mistakesCount = 0;
var mistakesnr = 0;

var TYPER = function(){



	//singleton
    if (TYPER.instance_) {
        return TYPER.instance_;
    }
    TYPER.instance_ = this;

	// Muutujad
	this.WIDTH = window.innerWidth/1.1;
	this.HEIGHT = window.innerHeight/2;
	this.canvas = null;
	this.ctx = null;

    this.routes = TYPER.routes;
	this.top10 = [];

	this.words = []; // kõik sõnad
	this.word = null; // preagu arvamisel olev sõna
	this.word_min_length = 3;
	this.guessed_words = 0; // arvatud sõnade arv

	//mängija objekt, hoiame nime ja skoori
	this.player =0;

	this.init();

};

TYPER.routes = {
	'home-view': {
		'render': function(){
			console.log('Home');
			document.querySelector("#game-view").style.display = "none";
			document.querySelector("#statistics-view").style.display = "none";
			document.querySelector("#home-view").style.display = "block";
		}
	},

	'game-view':{
		'render': function(){
			console.log('Game');
			document.querySelector("#game-view").style.display = "block";
			document.querySelector(".message").style.display = "block";
			document.querySelector(".words-display").style.display = "none";
			document.getElementById("statistics-view").style.display = "none";
			document.getElementById("home-view").style.display = "none";

			window.setTimeout(function(){

				document.querySelector(".message").style.display = "none";
				document.querySelector(".words-display").style.display = "block";

				//Function to refresh the home page after the game ends
				//So that players can enter their name again
				function pageHashChanged(){
					if(location.hash === '#home-view' || location.hash === '#statistics-view'){
						location.reload();
					}
				}

				window.onhashchange = pageHashChanged;



			}, 5000);
		}
	},

	'statistics-view':{
		'render': function(){
			console.log('Statistics');
			document.querySelector("#statistics-view").style.display = "block";
			document.querySelector("#home-view").style.display = "none";
			document.querySelector("#game-view").style.display = "none";
		}
	}
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
	playerNameArray = JSON.parse(localStorage.playerName);
	playerNameArray.sort(compareScores);
	this.top10 = playerNameArray.sort(compareScores).slice(0, 10);
	//console.log(this.top10);
	var counter = 0;

	for(i=0; i<this.top10.length; i++){

		counter += 1;

		var list_top10 = document.createElement('li');
		list_top10.className = 'top10_players';

		var pname = document.createElement('span');
		pname.className = 'player_content';

		var linebreak = document.createElement('br');
		var linebrak2 = document.createElement('br');

		var pscore = document.createElement('span');
		pscore.className = 'score_content';

		var p_content = document.createTextNode(counter + ". " + this.top10[i].name + " ");
		var s_content = document.createTextNode(this.top10[i].score);

		pname.appendChild(p_content);
		pscore.appendChild(s_content);

		list_top10.appendChild(pname);
		list_top10.appendChild(pscore);

		var element_attach = document.querySelector(".top10_players");

		element_attach.appendChild(list_top10);
		element_attach.appendChild(linebreak);
		element_attach.appendChild(linebrak2);

	}

	//Creating a table for all players

	for(i=0; i<playerNameArray.length; i++){

		var table_row = document.createElement('tr');

		var Name = document.createElement('td');
		var Score = document.createElement('td');
		var Mistakes = document.createElement('td');

		var p_content = document.createTextNode(playerNameArray[i].name);
		var s_content = document.createTextNode(playerNameArray[i].score);
		var m_content = document.createTextNode(playerNameArray[i].mistakes);

		Name.appendChild(p_content);
		Score.appendChild(s_content);
		Mistakes.appendChild(m_content);

		table_row.appendChild(Name);
		table_row.appendChild(Score);
		table_row.appendChild(Mistakes);

		var connect_table = document.querySelector(".players_table");

		connect_table.appendChild(table_row);

	}
}

TYPER.prototype = {

	// Funktsioon, mille käivitame alguses
	init: function(){

		window.addEventListener('hashchange', this.routeChange.bind(this));

		if(!window.location.hash){
			window.location.hash = 'home-view';
		} else {
			this.routeChange();
		}

		// Lisame canvas elemendi ja contexti
		this.canvas = document.getElementsByTagName('canvas')[0];
		this.ctx = this.canvas.getContext('2d');

		// canvase laius ja kõrgus veebisirvija akna suuruseks (nii style, kui reso)
		this.canvas.style.width = this.WIDTH + 'px';
		this.canvas.style.height = this.HEIGHT + 'px';

		//resolutsioon
		// kui retina ekraan, siis võib ja peaks olema 2 korda suurem
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;

		// laeme sõnad
		this.loadWords();
	},

	loadPlayerData: function(){
		// küsime mängija nime ja muudame objektis nime
		var p_name = prompt("Sisesta mängija nimi");
		// Kui ei kirjutanud nime või jättis tühjaks
		if(p_name === null || p_name === ""){
			p_name = "Tundmatu";
		}

        this.player = {name: p_name, score: 0, mistakes:0, gameId: parseInt(1000+Math.random()*999999)};
		// Mänigja objektis muudame nime

        this.playerNameArray = JSON.parse(localStorage.getItem('playerName'));

        if(!this.playerNameArray || this.playerNameArray.length===0){
            this.playerNameArray=[];
        }

        this.playerNameArray.push(this.player);
        console.log("lisatud");


        localStorage.setItem("playerName",  JSON.stringify(this.playerNameArray));
        //localStorage["palyerName"]+= this.player.name;

        console.log(this.player);
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
		this.drawAll();

		// Kuulame klahvivajutusi
		window.addEventListener('keypress', this.keyPressed.bind(this));

	},
	drawAll: function(){

        requestAnimFrame(window.typerGame.drawAll.bind(window.typerGame));

        console.log('joonistab');
        //joonista sõna
		this.word.Draw();
    },

    generateWord: function(){

        // kui pikk peab sõna tulema, + min pikkus + äraarvatud sõnade arvul jääk 5 jagamisel
        // iga viie sõna tagant suureneb sõna pikkus ühe võrra
        var generated_word_length =  this.word_min_length + parseInt(this.guessed_words/5);

    	// Saan suvalise arvu vahemikus 0 - (massiivi pikkus -1)
    	var random_index = (Math.random()*(this.words[generated_word_length].length-1)).toFixed();

        // random sõna, mille salvestame siia algseks
    	var word = this.words[generated_word_length][random_index];

    	// Word on defineeritud eraldi Word.js failis
        this.word = new Word(word, this.canvas, this.ctx);
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
            /// 404 - ei olnud
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

    savescore: function() {

        //this.playerNameArray = JSON.parse(localStorage.getItem('playerName'));
        //gamesFromStorage = JSON.parse(localStorage.getItem("games"));

        this.playerNameArray.forEach(function (player, key) {
            //gamesFromStorage.forEach(function(game, key){

            console.log(player);
            console.log(typerGame.player);

            if (player.gameId == typerGame.player.gameId) {

                player.score = typerGame.player.score;
				player.mistakes = typerGame.player.mistakes;

                console.log("updated");
                console.log(player);

            }

        });

        localStorage.setItem("playerName", JSON.stringify(this.playerNameArray));
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
                this.player.score = this.guessed_words-mistakes;
				g_words = this.guessed_words;
				score=this.player.score;

				this.player.mistakes = mistakes;

				this.savescore();

				//loosin uue sõna
				this.generateWord();
				console.log("skoor: "+this.player.score);
			}

			//joonistan uuesti
			this.word.Draw();
		}else{
            mistakes+=1;
            mistakesnr+=1;
			document.body.style.background = "red";
			window.setTimeout(function(){
				document.body.style.background = "white";
			}, 50);
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
	statistics();
	var typerGame = new TYPER();
	window.typerGame = typerGame;
};
