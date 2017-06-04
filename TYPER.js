


  // Run your javascript code here


var dark = 0;
var score = 0;
var mistakes = 0;
var guessedWords = 0;
var count = 0;
var i = 30;
var timeCount = 30;
var counter=setInterval(timer, 1000);

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

	this.words = []; // kõik sõnad
	this.word = null; // preagu arvamisel olev sõna
	this.word_min_length = 4;
	this.guessed_words = 0; // arvatud sõnade arv

	//mängija objekt, hoiame nime ja skoori

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

		// küsime mängija nime ja muudame objektis nime
		var p_name = prompt("Sisesta mängija nimi");

		// Kui ei kirjutanud nime või jättis tühjaks
		if(p_name === null || p_name === ""){
			p_name = "Tundmatu";
		
		}
		this.player = {name: p_name, score: 0, gameId: parseInt(1000+Math.random()*999999)};
		this.playerArray = JSON.parse(localStorage.getItem('player'));

        if(!this.playerArray || this.playerArray.length===0){
            this.playerArray=[];
        }

        this.playerArray.push(this.player);
        console.log("Player added");


        localStorage.setItem("player",  JSON.stringify(this.playerArray));
        //localStorage["palyerName"]+= this.player.name;

		// Mänigja objektis muudame nime
		
		this.player.name = p_name; // player =>>> {name:"Romil", score: 0}
        console.log(this.player);
	}, 
	

	loadWords: function(){

        console.log('Loading data...');

		// AJAX http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_first
		var xmlhttp = new XMLHttpRequest();

		// määran mis juhtub, kui saab vastuse
		xmlhttp.onreadystatechange = function(){


			// Sai faili tervenisti kätte
			if(xmlhttp.readyState == 4 && xmlhttp.status == 200){

                console.log('Successfully loaded');

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

		this.ctx.fillStyle="MediumSpringGreen";
		// Tekitame sõna objekti Word
		this.generateWord();
		//console.log(this.word);
		this.word.Draw();
		
    

		// Kuulame klahvivajutusi
		window.addEventListener('keypress', this.keyPressed.bind(this));
		
		// Anname teate
		clockAlert();
		timer();
		

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
	
	savescore: function() {

        //this.playerNameArray = JSON.parse(localStorage.getItem('playerName'));
        //gamesFromStorage = JSON.parse(localStorage.getItem("games"));

        this.playerArray.forEach(function (player, key) {
            //gamesFromStorage.forEach(function(game, key){

            console.log(player);
            console.log(typerGame.player);

            if (player.gameId == typerGame.player.gameId) {

                player.score = typerGame.player.score;
				
				//player.score = 1;
				
                console.log("Updated");
                console.log(player);

            }

        });

        localStorage.setItem("player", JSON.stringify(this.playerArray));
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
				guessedWords=this.guessed_words;

                //update player score
				
				console.log("Score: "+this.guessed_words);
                this.player.score = this.guessed_words;
				
				
				this.savescore();

				//loosin uue sõna
				this.generateWord();
				
			}

			//joonistan uuesti
			this.word.Draw();
		}else{
			mistakes+=1;
			this.word.Draw();
			document.body.style.background = "Tomato";
			window.setTimeout(function(){
				document.body.style.background = "white";
				
			}, 150);
	
		
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




function playerName(){
    console.log("player");

    var playerData = JSON.parse(localStorage.getItem("player"));


    playerData.sort(function(a, b) {
        return b.score - a.score;
    });

    playerData.forEach(function (player, key) {
        //gamesFromStorage.forEach(function(game, key){
        if(count>=10){
            return;
        }
        document.getElementById("player").innerHTML +="<br>"+(count+1)+" ) "+ player.name+"<a style='right: 50px; color: green;padding-top: 0px'>"+"   "+player.score+"</a>";
        count+=1;
    });
	}
	
function myFunction() {
    var x = document.getElementById('panel');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}




function darkMode(){
	if(dark==0){
		document.getElementById("kanvas").style.backgroundColor = "black";	
		console.log(kanvas);	
		dark=1;
	}
	else if(dark==1){
		document.getElementById("kanvas").style.backgroundColor = "white";	
		console.log(kanvas);
		dark=0;
	}
}

function clockAlert() {
		setTimeout(function(){ alert("Game Over. You typed in "+guessedWords+ " words and made "+mistakes+" mistakes."); }, 30000);
		
}


function timer()
{
  timeCount=timeCount-1;
  if (timeCount <= 0)
  {
     clearInterval(counter);
     //counter ended, do something here
	
	
     return;
	 
	 
	 
	 
  }

	document.getElementById("timer").innerHTML=timeCount + " sekundit on jäänud";
  //Do code for showing the number of seconds here
  
}