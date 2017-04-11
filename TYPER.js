

//var p_name = nimi;
var TYPER = function(){

	//singleton
    if (TYPER.instance_) {
        return TYPER.instance_;
    }
    TYPER.instance_ = this;

	// Muutujad
	this.WIDTH = window.innerWidth-10;
	this.HEIGHT = 200;
	this.canvas = null;
	this.ctx = null;
	var interval;
	var sk;
	var names;
	var typo = 0;
	var wordscount;
	var score;
	var user_id = 0;
	var usersScore = [];
	this.words = []; // kõik sõnad
	this.word = null; // preagu arvamisel olev sõna
	this.word_min_length = 3;
	this.guessed_words = 0;	// arvatud sõnade arv
	//var p_name = document.getElementById("userName").value;
	//mängija objekt, hoiame nime ja skoori
	this.player = {user_id : 0, name: null, score: 0, typo: 0, wordscount: 0};
	this.init();
};

TYPER.prototype = {

	// Funktsioon, mille käivitame alguses
	init: function(){

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

		var name = document.getElementById("userN").innerHTML;
		this.player.name = name; // player =>>> {name:"Romil", score: 0}
        console.log("kasutaja: ",this.player);
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
		delayedAlert();
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
		sk = this.player;
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
			console.log("ennem",this.guessed_words);
			this.guessed_words += 1;
			console.log("plus",this.guessed_words);
			// kas sõna sai otsa, kui jah - loosite uue sõna

			if(this.word.left.length === 0){

				document.body.style.backgroundColor = "#65C200";
				setTimeout(function(){document.body.style.backgroundColor = "black"}, 100);
				this.guessed_words += 2;
				this.player.wordscount++; 
				wordscount = this.player.wordscount;
                //update player score
				console.log("punktid nüüd", this.player.score);
                this.player.score += this.guessed_words;
				console.log("punktid lisatud: ",this.player.score);
				sk = this.player;
				names = this.player.name;
				score = this.player.score;
				console.log("Punktid hetkel: ",this.player);
				//loosin uue sõna
				this.guessed_words = 0;
				this.generateWord();
			}

			//joonistan uuesti
			this.word.Draw();
		}else{
			this.player.typo -= 1;
			typo = this.player.typo;
			console.log("ennem",this.guessed_words);
			this.guessed_words -= 1;
			console.log("miinus",this.guessed_words);
			document.body.style.backgroundColor = "#F50013";
			setTimeout(function(){document.body.style.backgroundColor = "black"}, 100);
		}
	} // keypress end

};
var timeoutID;

function delayedAlert() {
	console.log("Start timer")
  	timeoutID = window.setTimeout(saveUserFn, 6000);
	timerFN();
}
var usersScore = [];
var user_id = 0;
var typo = 0;
var wordscount = 0;
var names = "nimetu";
var score = 0;
function saveUserFn(){ 
		var new_user = new user (user_id, names, score, typo, wordscount);
		user_id++;
		usersScore.push(new_user);
		console.log("Saved: ",JSON.stringify(usersScore));
		localStorage.setItem('playerscore', JSON.stringify(usersScore));

		var again = confirm("Mäng läbi!\nPunktid: " + score +"\nSõnu kirjutati: "+wordscount+"\nVigu: "+(-typo)+"\nUus mäng?");
		if(again){
			restartGame();
		}else{
			//clearTimeout(interval);
			loadTop();
			location.href="#home-view";
		}
		
        /*console.log("Saved: ",sk);
		usersScore.push(sk);
		console.log("Saved*****: ",JSON.stringify(usersScore));
        localStorage.setItem('playerscore', JSON.stringify(usersScore));
		//window.location="#top-view";
		location.href="#home-view";*/
}

var user = function(new_id, new_userName, new_score, new_typo, new_wordscount){
        this.id = new_id;
        this.name = new_userName;
        this.score = new_score;
		this.typo = new_typo;
		this.wordscount = new_wordscount;
        console.log('created new user');
        console.log(this);
    };

	function timerFN(){
		var sec=5;            
		var interval = setInterval(function () {
            document.getElementById('sec').innerHTML = sec;
            if(sec===0){
				clearInterval(interval);
				sec=5;
            }else{
				sec -= 1; 
            	console.log(sec); 
			}
         }, 1000);
    }
function restartGame(){
	sendusername();
	typerGame.loadPlayerData();
	var usersScore = [];
	var user_id = 0;
	typerGame.generateWord();
	typerGame.word.Draw();
	delayedAlert();
	typerGame.guessed_words = 0;
	typerGame.player.score = 0;
	typerGame.player.typo = 0;
	typo = 0;
	typerGame.player.wordscount = 0;
	
}
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

function sendusername(){
	var userName = document.querySelector('.userName');
    var name = userName.value;
    console.log("NIMI: ",name);
 	document.getElementById('userN').innerHTML = name;
}

function loadTop(){

	if(!window.location.hash){ window.location.hash = 'home-view';}
	var len = usersScore.length;
	for (var i = len-1; i>=0; i--){
		for(var j = 1; j<=i; j++){
		if(usersScore[j-1].score<usersScore[j].score){
			var temp = usersScore[j-1];
			usersScore[j-1] = usersScore[j];
			usersScore[j] = temp;
			}
		}
		console.log(usersScore);
	}
	if(len>10){
		var newLen = 10; 
	}else{
		var newLen = usersScore.length;
	}
	for (i = 0; i<newLen; i++){
		var scorea = usersScore[i].name+" "+usersScore[i].score;
		console.log(scorea);
		var s = i+1;
		var m = "top"+s;
		console.log(m);
		document.getElementById(m).innerHTML = scorea;
		s=0;
	}
	console.log(JSON.stringify(usersScore));
}

function startNewGame (){

	if(window.typerGame==undefined){
		console.log("Start Game"); 
		sendusername();
		window.typerGame = typerGame;
    	var typerGame = new TYPER();
    	window.typerGame = typerGame;
		var usersScore = [];
		var user_id = 0;
		console.log("nimi: ", names);
		
	}else{
		console.log("Start Game");
		restartGame();
	}
}