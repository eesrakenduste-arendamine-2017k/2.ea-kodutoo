var TYPER = function(){

	//singleton
	if (TYPER.instance_) {
	return TYPER.instance_;
	}
	TYPER.instance_ = this;


	this.routes = TYPER.routes;
	//this.timer = TYPER.timer;

	// Muutujad
	this.WIDTH = 1350;
	this.HEIGHT = 700;

	//this.WIDTH = window.innerWidth; //Ei saa olla window.innerWidth, kuna siis läbeb kõik asjad kokku
	//this.HEIGHT = window.innerHeight;//Ei saa olla window.innerHeight, kuna siis läbeb kõik asjad kokku
	
	this.seconds = 5;
	this.mistakes = 0;

	this.canvas = null;
	this.ctx = null;

	this.words = []; // kõik sõnad
	this.word = null; // preagu arvamisel olev sõna
	this.word_min_length = 3;
	this.guessed_words = 0; // arvatud sõnade arv

	//mängija objekt, hoiame nime ja skoori
	this.player = {name: null, score: 0};

	this.init();
	
};

//MENÜÜ
TYPER.routes = {
	
	'home-view': {
		'render': function(){
		console.log('home');
		}
	},
	
	'game-view': {
		'render': function(){
		console.log('game');
		}
	},
	
	'scores-view': {
		'render': function(){
		console.log('score');
		}
	},
	
};

TYPER.prototype = {

	// Funktsioon, mille käivitame alguses
	init: function(){
		console.log('Mäng läks tööle');

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

		this.counter = null;
		//this.seconds = 5;

		// laeme sõnad
		this.loadWords();

		var startgame = document.getElementById("begingame");
		if(startgame){
			startgame.addEventListener("click",this.begingame.bind(this));
			//console.log("TEST");
		}
		window.addEventListener('keypress', this.keyPressed.bind(this));							

	},
	
	begingame: function (){
		this.seconds = 5;
		//this.player.score = 0;
		//console.log("This skoor: "+this.player.score);
		typerGame.player.score = 0;
		typerGame.mistakes = 0;
		//console.log("typerGame skoor: "+typerGame.player.score);
		location.hash = "#game-view";
		typerGame.start();
		typerGame.loadPlayerData();
	},
	

	loadPlayerData: function(){
		// küsime mängija nime ja muudame objektis nime
		var p_name = prompt("Sisesta mängija nimi");
		// Kui ei kirjutanud nime või jättis tühjaks
		
		if(p_name === null || p_name === ""){
			p_name = "Tundmatu";
		}
		// Mänigja objektis muudame nime
		this.player.name = p_name; // player =>>> {name:"Romil", score: 0}
		console.log(this.player.name);
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
				//typerGame.loadPlayerData();

				// kõik sõnad olemas, alustame mänguga
				//typerGame.start();
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
		
		//NULLI SIIN SKOOR ÄRA
		typerGame.player.score = 0;
		//this.palyer.score = 0;
		

		this.counter = window.setInterval(function(){
			typerGame.word.Draw();
			typerGame.seconds--;

			console.log("Aeg: "+typerGame.seconds);
			
			if(typerGame.seconds == 0){
				//Lisab info local storage-sse
				var game = [];
				var game2 = [];
				var game3 = [];
				
				var gameinfo = [
					typerGame.player.name
				];
				
				var gameinfo2 = [
					typerGame.player.score
				];
				
				var gameinfo3 = [
					typerGame.mistakes
				];
			
				console.log(gameinfo);
				console.log(gameinfo2);
				console.log(gameinfo3);
				
				var gamesFromStorage = null;
				if(localStorage.getItem("game")){
					gamesFromStorage = JSON.parse(localStorage.getItem("game"));
					if(gamesFromStorage){
						game = gamesFromStorage;
					}
				}
				game.push(gameinfo);
				localStorage.setItem("game", JSON.stringify(game));
				
				var gamesFromStorage2 = null;
				if(localStorage.getItem("game2")){
					gamesFromStorage2 = JSON.parse(localStorage.getItem("game2"));
					if(gamesFromStorage2){
						game2 = gamesFromStorage2;
					}
				}
				game2.push(gameinfo2);
				localStorage.setItem("game2", JSON.stringify(game2));
				
				var gamesFromStorage3 = null;
				if(localStorage.getItem("game3")){
					gamesFromStorage3 = JSON.parse(localStorage.getItem("game3"));
					if(gamesFromStorage3){
						game3 = gamesFromStorage3;
					}
				}
				game3.push(gameinfo3);
				localStorage.setItem("game3", JSON.stringify(game3));
				
			var playagain = confirm(typerGame.player.name + " skoor:  " + typerGame.player.score +"\nTahad uuesti mängida?");
				if (playagain){
					typerGame.guessed_words = 0;
					typerGame.generateWord();
					typerGame.player.score = 0;
					typerGame.loadPlayerData();
					typerGame.again();
					console.log("Uus skoor: "+typerGame.player.score);
				} else {
					window.clearInterval(typerGame.counter);
					typerGame.player.score = 0;
					//console.log("Uus skoor peaks olema: "+typerGame.player.score);
					data();
					statistics();
					location.hash = "#homw-view";
				}
			}
		},1000);
	},

	generateWord: function(){
		// kui pikk peab sõna tulema, + min pikkus + äraarvatud sõnade arvul jääk 5 jagamisel
		// iga viie sõna tagant suureneb sõna pikkus ühe võrra
		var generated_word_length =  this.word_min_length + parseInt(this.guessed_words/5);

		// Saan suvalise arvu vahemikus 0 - (massiivi pikkus -1)
		var random_index = (Math.random()*(this.words[generated_word_length].length-1)).toFixed();

		// random sõna, mille salvestame siia algseks
		var word = this.words[generated_word_length][random_index];
		//console.log("Word: "+word);

		// Word on defineeritud eraldi Word.js failis
		this.word = new Word(word, this.canvas, this.ctx);
	},

	keyPressed: function(event){
		//console.log("siin");
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
				this.player.score = this.guessed_words;
				console.log("Skoor: "+this.player.score);			
				
				//loosin uue sõna
				this.generateWord(); //KUI SEDA EI OLE SIIS EI LOOSI UUT SÕNA
			}

			//joonistan uuesti
			this.word.Draw();
			//console.log("Jõudis siia");
		} else {
			console.log("Valesti trükisid");
			this.mistakes = this.mistakes + 1;
			console.log("This.counter: "+this.mistakes);
		};
	}, // keypress end
	
	
	again: function () {
		this.player.score = 0;
		this.seconds = 5;
		console.log("Tühi skoor: "+this.player.score);
		this.mistakes = 0;
		typerGame.mistakes = 0;
		this.guessed_words = 0;
		this.generateWord();
		this.word.Draw();
	},
	
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

function nightmode(){
	var color = document.getElementById('color').style.color;
	//console.log("Fondi värv: "+color);
	var backgroundColor = document.body.style.backgroundColor;
	//console.log("Tagatausta värv: "+backgroundColor);

	if (color == "black" && backgroundColor == "white") {
		document.getElementById('color').style.color="white";
		document.body.style.backgroundColor="black";
		typerGame.ctx.fillStyle = "white";
		document.getElementById("tablePrint").style.borderColor = "white";
		document.getElementById("statistics").style.borderColor = "white";		
	} else {
		document.getElementById('color').style.color="black";
		document.body.style.backgroundColor="white";
		typerGame.ctx.fillStyle = "black";
		document.getElementById("tablePrint").style.borderColor = "black";
		document.getElementById("statistics").style.borderColor = "black";
	}
};

function data(){
	var playerdata = localStorage.getItem("game");
	var playerdata2 = localStorage.getItem("game2");
	
	var specialChars = '"!@#$^&%*()+=-[]\/{}|:<>?.'; //Tee see korda
	for (var i = 0; i < specialChars.length; i++) {
		playerdata = playerdata .replace(new RegExp("\\" + specialChars[i], 'gi'), '');
		playerdata2 = playerdata2 .replace(new RegExp("\\" + specialChars[i], 'gi'), '');
	}
	
	console.log("Massiiv playerdata: "+playerdata);
	console.log("Massiiv playerdata2: "+playerdata2);
	
	playerdata = playerdata.split(',');
	playerdata2 = playerdata2.split(',');
	
	
	//playerdata2.sort(function(a, b){return a - b});
	//playerdata2.reverse();
	//console.log("Test sort: "+playerdata2);
/*	
var biggest = -Infinity;
var biggest_index = -1; {
    for (i = 0; i < playerdata2.length; i++) {
        if (playerdata2[i] > biggest) {
            biggest = playerdata2[i];
            biggest_index = i;
        }
    }
    console.log("The biggest element is " + biggest);
}
*/

/*
var list = [];
for (var j = 0; j < playerdata.length; j++) 
    list.push({'nimi': playerdata[j], 'tulemus': playerdata2[j]})

list.sort(function(a, b) {
    return ((a.playerdata < b.playerdata) ? -1 : ((a.playerdata == b.playerdata) ? 0 : 1));
})

//3) separate them back out:
for (var k = 0; k < list.length; k++) {
    playerdata[k] = list[k].playerdata;
    playerdata2[k] = list[k].playerdata2;
}

console.log("Sorteerimie playerdata: "+playerdata);
console.log("Sorteerimie playerdata2: "+playerdata2);
*/
	
	var table = "<table>";
	table = table + "<tr><th>" + "Mänigja nimi" + "</th><th>" + "Tulemus" + "</th><tr>";
	for (var i=0; i< playerdata.length; i++) {
		table = table + "<tr><td>" + playerdata[i] + "</td><td>" + playerdata2[i] + "</td></tr>"; 
	}
	table = table + "</table>";

	document.getElementById('tablePrint').innerHTML = table;
	//return table;
};


function statistics() {
	
	var playerdata = localStorage.getItem("game");
	var playerdata3 = localStorage.getItem("game3");
	
	var specialChars = '"!@#$^&%*()+=-[]\/{}|:<>?.'; //Tee see korda
	for (var i = 0; i < specialChars.length; i++) {
		playerdata = playerdata .replace(new RegExp("\\" + specialChars[i], 'gi'), '');
		playerdata3 = playerdata3 .replace(new RegExp("\\" + specialChars[i], 'gi'), '');
	}
	
	console.log("Massiiv playerdata: "+playerdata);
	console.log("Massiiv playerdata3: "+playerdata3);
	
	
	var playerdata = playerdata.split(',');
	var playerdata3 = playerdata3.split(',');
	var table = "<table>";
	table = table + "<tr><th>" + "Mänigja nimi" + "</th><th>" + "Vead" + "</th><tr>";
	for (var i=0; i< playerdata.length; i++) {
		table = table + "<tr><td>"+ playerdata[i]+"</td><td>"+ playerdata3[i] +"</td></tr>"; 
	}
	table = table + "</table>";

	document.getElementById('statistics').innerHTML = table;
};

window.onload = function(){
	var typerGame = new TYPER();
	window.typerGame = typerGame;
};