
var PageView = function() {
	
	if(PageView.instance) {
		return PageView.instance;
	}
	PageView.instance = this;
	
	this.routes = PageView.routes;
	this.currentRoute = null;
	this.init();
};


PageView.routes = {
	
	"home-view": {
		"render": function() {
			
		}
	},
	
	"game-view": {
		"render": function() {
			console.log("midagi");
			var typerGame = new TYPER();
			window.typerGame = typerGame;
		}
	}
};


PageView.prototype = {
	
	init: function() {
		
		window.addEventListener("hashchange", this.routeChange.bind(this));
		
		console.log(window.location.hash);
		
		if(!window.location.hash) {
			window.location.hash = "home-view";
		} else {
			this.routeChange();
		}
	},
	
	routeChange: function(event) {
		
		this.currentRoute = location.hash.slice(1);
		
		if(this.routes[this.currentRoute]) {
			this.routes[this.currentRoute].render();
		}else {
			console.log("404");
		}
		
	}
	
};























var TYPER = function(){

    if (TYPER.instance_) {
        return TYPER.instance_;
    }
    TYPER.instance_ = this;

	this.WIDTH = window.innerWidth / 1.30;
	this.HEIGHT = window.innerHeight /1.15;
	this.canvas = null;
	this.ctx = null;
	this.words = []; // kõik sõnad
	this.word = null; // preagu arvamisel olev sõna
	this.word_min_length = 3;
	this.guessed_words = 0;
	this.player = {name: null, score: 0, guessedWords: 0, time: 1000, lives: 5};
	this.time = 1000;
	this.livesLeft = 5;
	this.countDown = null;
	this.playerScore = 0;
	this.stop = 0;
	this.init();
};

TYPER.prototype = {

	init: function(){
		this.canvas = document.getElementsByTagName('canvas')[0];
		this.ctx = this.canvas.getContext('2d');
		this.canvas.style.width = this.WIDTH + 'px';
		this.canvas.style.height = this.HEIGHT + 'px';
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.loadPlayerData();
		this.setTimer();
	}, 

	loadPlayerData: function(){
		var playerNameContainer = document.getElementById("playerName");
		var playerScoreContainer = document.getElementById("playerScore");
		var guessedWordsContainer = document.getElementById("guessedWords");
		var livesLeftContainer = document.getElementById("livesLeft");
		var timeRemainingContainer = document.getElementById("timeRemaining");
		var startButton = document.getElementById("startGame");
		
		var p_name = prompt("Sisesta mängija nimi");
		if(p_name === null || p_name === ""){
			p_name = "Tundmatu";
		}
		this.player.name = p_name;
		
		startButton.style.display = "inline";
		
		playerNameContainer.innerHTML = "Nimi: " + this.player.name;
		playerScoreContainer.innerHTML = "Skoor: " + this.playerScore;
		guessedWordsContainer.innerHTML = "Arvatud sõnu: " + this.guessed_words;
		livesLeftContainer.innerHTML = "Elusid alles: " + this.livesLeft;
		timeRemainingContainer.innerHTML = "Aeg: " + this.time;
	}, 

	
	loadWords: function(){
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function(){
			if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
				var response = xmlhttp.responseText;
				var words_from_file = response.split('\n');
				typerGame.words = structureArrayByWordLength(words_from_file);
				typerGame.start();
			}
		};
		xmlhttp.open('GET','./lemmad2013.txt',true);
		xmlhttp.send();
	}, 

	
	start: function(){
		var startButton = document.getElementById("startGame");
		startButton.style.display = "none";
		
		this.generateWord();
		this.word.Draw();
		window.addEventListener('keypress', this.keyPressed.bind(this));
	},
	
	
	
	
    generateWord: function(){
        var generated_word_length =  this.word_min_length + parseInt(this.guessed_words/5);
    	var random_index = (Math.random()*(this.words[generated_word_length].length-1)).toFixed();
    	var word = this.words[generated_word_length][random_index];
        this.word = new Word(word, this.canvas, this.ctx);
    },
    
	
	keyPressed: function(event){
		var letter = String.fromCharCode(event.which);
		var justForTest = document.getElementById("justForTest");
		var justForTest2 = document.getElementById("justForTest2");
		var playerScoreContainer = document.getElementById("playerScore");
		var guessedWordsContainer = document.getElementById("guessedWords");
		var livesLeftContainer = document.getElementById("livesLeft");
		
		if(this.word.left !== null) {
			if(letter === this.word.left.charAt(0)){
				justForTest.innerHTML = "oige taht";
				livesLeftContainer.innerHTML = "Elusid alles: " + this.livesLeft;
				this.word.removeFirstLetter();
				this.playerScore += 5;
				playerScoreContainer.innerHTML = "Skoor: " + this.playerScore;
				
				if(this.word.left.length === 0){
					this.time = 1000;
					this.guessed_words += 1;
					this.playerScore += 100;
					playerScoreContainer.innerHTML = "Skoor: " + this.playerScore;
					guessedWordsContainer.innerHTML = "Arvatud sõnu: " + this.guessed_words;
					this.generateWord();
				}
				this.word.Draw();
				
			} else {
				justForTest.innerHTML = "vale taht";
				this.playerScore -= 300;
				playerScoreContainer.innerHTML = "Skoor: " + this.playerScore;
				
				if(this.time > 0) {
					justForTest2.innerHTML = "ok";
				} else {
					justForTest2.innerHTML = "aeg";
					this.stopGame();
				}
				
				if(this.livesLeft < 2) {
					this.livesLeft -= 1;
					livesLeftContainer.innerHTML = "Elusid alles: " + this.livesLeft;
					this.stopGame();
				} else {
					this.livesLeft -= 1;
					livesLeftContainer.innerHTML = "Elusid alles: " + this.livesLeft;
				}
			}
		}	
	},
	
	
	setTimer: function() {
		
		var startTimer = document.getElementById("startGame");
		startTimer.addEventListener("click", function(){
			typerGame.loadWords();
			typerGame.countTime();
		});
	},
	
	
	countTime: function() {
		
		var timeRemainingContainer = document.getElementById("timeRemaining");
		
		this.countDown = setInterval(function(){
			timeRemainingContainer.innerHTML = "Aeg: " + typerGame.time;
			typerGame.time -= 10;
			
			if(typerGame.time === 0) {
				typerGame.stopGame();
			}
		}, 100);
	},
	
	
	stopGame: function() {
		
		this.word.clearCanvas();
		
		clearInterval(this.countDown);
		
		// et teeks ainult yhe korra
		if(this.stop === 0) {
			this.player.score = this.playerScore;
			this.player.guessedWords = this.guessed_words;
			this.player.lives = this.livesLeft;
			this.player.time = this.time;
			this.stop++;
		}
		
		var playerScoreContainer = document.getElementById("playerScore");
		var timeRemainingContainer = document.getElementById("timeRemaining");
		var guessedWordsContainer = document.getElementById("guessedWords");
		var livesLeftContainer = document.getElementById("livesLeft");
		var justForTest = document.getElementById("justForTest");
		
		playerScoreContainer.innerHTML = "Skoor: " + this.player.score;
		guessedWordsContainer.innerHTML = "Arvatud sõnu: " + this.player.guessedWords;
		livesLeftContainer.innerHTML = "Elusid alles: " + this.player.lives;
		timeRemainingContainer.innerHTML = "Aeg: " + this.player.time;
		justForTest.innerHTML = "Mäng läbi!";
	}

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
	var pageView = new PageView();
	//window.typerGame = typerGame;
};
