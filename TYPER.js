//Extra variables
var timer = document.getElementById("time_left");
var score = document.querySelector("#score");
var g_words = 0;
var mistakes = 0;
var player_array = JSON.parse(localStorage.getItem('PlayerData')) || [];
this.top10 = [10];
var top10_counter = 0;


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
	
	this.pages = TYPER.pages;
	
	this.top10 = [];

	this.words = []; // kõik sõnad
	this.word = null; // preagu arvamisel olev sõna
	this.word_min_length = 3;
	this.guessed_words = 0; // arvatud sõnade arv

	//mängija objekt, hoiame nime ja skoori
	this.player = {name: null, score: 0, mistakes: 0};
	
	this.init();
};


TYPER.pages = {
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
			document.querySelector(".loading").style.display = "none";
			document.querySelector(".message").style.display = "block";
			document.querySelector(".words-display").style.display = "none";
			document.querySelector("#score").style.display = "none";
			document.getElementById("statistics-view").style.display = "none";
			document.getElementById("home-view").style.display = "none";
			
			window.setTimeout(function(){
				
				document.querySelector(".loading").style.display = "none";
				document.querySelector(".message").style.display = "none";
				document.querySelector(".words-display").style.display = "block";
				document.querySelector("#score").style.display = "block";
				
				//Function to refresh the home page after the game ends
				//So that players can enter their name again
				function pageHashChanged(){
					if(location.hash === '#home-view'){
						location.reload();
					}
				}
				
				window.onhashchange = pageHashChanged;
				
				function Timer(){
					timer.innerHTML--;
					if(timer.innerHTML < 0){
						timer.innerHTML = 0;
					}
					
					if(timer.innerHTML <= 0){
						if(timer.innerHTML <= 0 && g_words !== 0){
							
							var n_player = new Leaderboard(player, g_words, mistakes);
							player_array.push(n_player);
							localStorage.setItem('PlayerData', JSON.stringify(player_array));
							
						}
						
						alert("Game Over! Your final score is: " + g_words);
						timer.innerHTML = 10;
						window.location.hash = 'home-view';
						setTimeout(function(){
						}, 1000);
						
					} else {
						setTimeout(Timer, 1000);
					}
				}
				
				setTimeout(Timer, 1000);
				
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

//Creating the top 10 player list
if(localStorage.PlayerData){
			
	this.top10 = JSON.parse(localStorage.PlayerData);
	this.top10.sort(compareScores);
	//console.log(this.top10);
	
	for(i=0; i<this.top10.length; i++){
		
		this.top10 = JSON.parse(localStorage.PlayerData);
		this.top10.sort(compareScores).slice(0, 10);
		
		var list_top10 = document.createElement('li');
		var playername = document.createElement('span');
		var linebreak = document.createElement('br');
		var playerscore = document.createElement('span');
		
		var p_content = document.createTextNode(this.top10[i].name + " ");
		var s_content = document.createTextNode(this.top10[i].score);
		
		playername.appendChild(p_content);
		playerscore.appendChild(s_content);
		
		list_top10.appendChild(playername);
		list_top10.appendChild(playerscore);
		
		var element_attach = document.getElementById("home-view");
		
		element_attach.appendChild(list_top10);
		element_attach.appendChild(linebreak);
		
		if(top10_counter == 10){
			
		}
	}
	
	for(i=0; i<player_array.length; i++){
		
		
		
	}
	
	
		
}

TYPER.prototype = {

	// Funktsioon, mille käivitame alguses
	init: function(){
		
		window.addEventListener('hashchange', this.ChangePage.bind(this));
		
		if(!window.location.hash){
			window.location.hash = 'home-view';
		} else {
			this.ChangePage();
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
		var p_name = prompt("Enter your player name");

		// Kui ei kirjutanud nime või jättis tühjaks
		if(p_name === null || p_name === ""){
			p_name = "Unknown";
		
		}

		// Mänigja objektis muudame nime
		this.player.name = p_name; // player =>>> {name:"Romil", score: 0}
		player = this.player.name;
        console.log(this.player);
	}, 

	loadWords: function(){

        console.log('Loading...');

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
                // ehk this.words asemel tuleb kasutada TYPERGame.words
                
				//asendan massiivi
				TYPERGame.words = structureArrayByWordLength(words_from_file);
				//console.log(TYPERGame.words);
				
				// küsime mängija andmed
                TYPERGame.loadPlayerData();

				// kõik sõnad olemas, alustame mänguga
				TYPERGame.start();
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
        var generated_word_length =  this.word_min_length + parseInt(this.guessed_words/5);

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
				
				timer.innerHTML = parseInt(timer.innerHTML) + 2;

                //update player score
                this.player.score = this.guessed_words;
				g_words = this.guessed_words;
				document.getElementById("score").innerHTML = "Score: " + g_words;

				//loosin uue sõna
				this.generateWord();
			}

			//joonistan uuesti
			this.word.Draw();
			
		} else {
			
			mistakes++;
			document.body.style.background = "red";
			window.setTimeout(function(){
				document.body.style.background = "white";
			}, 50);
			
			timer.innerHTML = parseInt(timer.innerHTML) - 2;
			
			if(timer.innerHTML < 0){
				timer.innerHTML = 0;
			}
			
		}

	}, // keypress end
	
	ChangePage: function(event){
		
		this.currentPage = location.hash.slice(1);
		console.log(this.currentPage);
		
		if(this.pages[this.currentPage]){
			
			this.UpdateNavigation();
			this.pages[this.currentPage].render();
			
		} else {
			
			console.log("An error occured");
			
		}
	},
	
	UpdateNavigation: function(){
		
		document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');
		document.querySelector('.' + this.currentPage).className += ' active-menu';
		
	}

};

var Leaderboard = function(name, score, mistakes){
	
	this.name = name;
	this.score = score;
	this.mistakes = mistakes;
	
	//console.log(this);
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
	var TYPERGame = new TYPER();
	window.TYPERGame = TYPERGame;
};
