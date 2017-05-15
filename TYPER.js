
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
	
	"stat-view": {
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
		
	},
	
	sortPlayers: function() {
		
		if(localStorage.players) {
			
			var allPlayers = JSON.parse(localStorage.players);
			console.log(allPlayers);
			
			var top10Players = allPlayers.sort(function(a, b) {
				return a.playerScore < b.playerScore ? 1 : -1;
			}).slice(0, 10);
			
			console.log(top10Players);
			
			top10Players.forEach(function(player, index) {
					
				var newPlayer = new Player(player.PlayerId, player.playerName, player.playerScore, player.playerWords, player.playerTime, player.playerLives);
				
				if(TYPER.instance_) {
					TYPER.instance_.playerId = player.playerId;
				}
				
				var playerListLi = newPlayer.createHTML();
				document.querySelector("#playerList").appendChild(playerListLi);
				
				var playerPosition = document.querySelectorAll("#playerList > li");
				
		
				if(playerPosition[0]) {
					//console.log("essa");
					playerPosition[0].style.backgroundColor = "#FFD700";
				}
				
				if(playerPosition[1]) {
					//console.log("kossa");
					playerPosition[1].style.backgroundColor = "#C0C0C0";
				}
				
				if(playerPosition[2]) {
					//console.log("kossa");
					playerPosition[2].style.backgroundColor = "#DAA520";
				}
				
			});
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
	this.players = [];
	//this.sortedPlayers = []; // uus massiiv kus on sorteeritud mängijad
	this.correctWords = [];
	this.time = 1000;
	this.livesLeft = 5;
	this.countDown = null;
	this.playerScore = 0;
	this.stop = 0;
	this.playerId = 0;
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
		
		if(localStorage.players) {
			
			this.players = JSON.parse(localStorage.players);			
			this.playerId++;
		}
	}, 

	loadPlayerData: function(){
		
		var playerNameContainer = document.querySelector(".playerName");
		
		var activeScore = document.querySelector(".activeScore");
		var activeTime = document.querySelector(".activeTime");
		var activeGuessedWords = document.querySelector(".activeGuessedWords");
		var activeLivesLeft = document.querySelector(".activeLivesLeft");
		
		
		var startButton = document.getElementById("startGame");
		var newButton = document.getElementById("newGame");
		
		
		var p_name = prompt("Sisesta mängija nimi");
		if(p_name === null || p_name === ""){
			p_name = "Tundmatu";
		}
		this.player.name = p_name;
		
		startButton.style.display = "inline";
		newButton.style.display = "none";
		
		playerNameContainer.innerText = this.player.name;
		activeScore.innerText = this.playerScore;
		activeTime.innerText = this.time;
		activeGuessedWords.innerText = this.guessed_words;
		activeLivesLeft.innerText = this.livesLeft;

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
		this.countTime();
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
		
		var activeScore = document.querySelector(".activeScore");
		var activeChar = document.querySelector(".activeChar");
		var activeGuessedWords = document.querySelector(".activeGuessedWords");
		var activeLivesLeft = document.querySelector(".activeLivesLeft");
		
		
		if(this.word.left !== null) {
			
			if(letter === this.word.left.charAt(0)){
				
				activeChar.innerText = "Õige täht!";
				activeChar.style.color = "#4AC948";
				
				activeLivesLeft.innerText = this.livesLeft;
				
				this.word.removeFirstLetter();
				this.playerScore += 5;
				
				activeScore.innerText = this.playerScore;
				activeScore.style.color = "#4AC948";
				
				if(this.word.left.length === 0){
					this.time = 1000;
					this.guessed_words += 1;
					this.playerScore += 100;
					
					activeScore.innerText = this.playerScore;
					activeGuessedWords.innerText = this.guessed_words;
					
					this.correctWords.push(this.word.word);
					
					this.generateWord();
				}
				this.word.Draw();
				
			} else {
				
				activeChar.innerText = "Vale täht!";
				activeChar.style.color = "#EE2C2C";
				
				this.playerScore -= 300;
				
				activeScore.innerText = this.playerScore;
				activeScore.style.color = "#EE2C2C";
				
				
				if(this.livesLeft < 2) {
					this.livesLeft -= 1;
					activeLivesLeft.innerText = this.livesLeft;
					this.stopGame();
				} else {
					this.livesLeft -= 1;
					activeLivesLeft.innerText = this.livesLeft;
					activeLivesLeft.style.color = "yellow";
				}
			}
		}	
	},
	
	
	setTimer: function() {
		
		var startTimer = document.getElementById("startGame");
		startTimer.addEventListener("click", function(){
			typerGame.loadWords();
		});
	},
	
	
	countTime: function() {
		
		var activeTime = document.querySelector(".activeTime");
		
		this.countDown = setInterval(function(){
			
			activeTime.innerText = typerGame.time;
			activeTime.style.color = "yellow";
			
			typerGame.time -= 10;
			
			if(typerGame.time < 300) {
				activeTime.style.color = "#EE2C2C";
			}
			
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
		
		var activeChar = document.querySelector(".activeChar");
		var activeScore = document.querySelector(".activeScore");
		var activeTime = document.querySelector(".activeTime");
		var activeGuessedWords = document.querySelector(".activeGuessedWords");
		var activeLivesLeft = document.querySelector(".activeLivesLeft");
		
		activeScore.innerText = this.player.score;
		activeScore.style.color = "yellow";
		
		activeTime.innerText = this.player.time;
		activeTime.style.color = "yellow";
		
		activeGuessedWords.innerText = this.player.guessedWords;
		activeGuessedWords.style.color = "yellow";
		
		activeLivesLeft.innerText = this.player.lives;
		activeLivesLeft.style.color = "yellow";
		
		activeChar.innerText = "Mäng läbi!";
		activeChar.style.color = "yellow";
		
		var newButton = document.getElementById("newGame");
		newButton.style.display = "inline";
		
		newButton.onclick = function() {
			location.reload();
		};
		
		console.log(this.correctWords);
		
		this.addNewPlayer();
		this.displayStatistics();
	},
	
	displayStatistics: function() {
		
		var statistics = document.querySelector("#statistics");
		var wordsList = document.querySelector("#correctWords");
		
		statistics.innerHTML = "Nimi: " + this.player.name + "<br>Skoor: " + this.player.score + "<br>Arvatud sõnu: " + this.player.guessedWords;
		
		if(this.correctWords.length === 0) {
			
		wordsList.innerHTML = "Õigesti trükitud sõnu ei olnud...";
			
		} else {
			
			var correctWordsString = "";
			
			for(i = 0; i < this.correctWords.length; i++) {
				correctWordsString += this.correctWords[i] + ", ";
			}
			
			var pos = correctWordsString.lastIndexOf(", ");
			var finalWordsList = correctWordsString.slice(0, pos);
			
			wordsList.innerHTML = "Sinu poolt õigesti trükitud sõnad: " + finalWordsList;
		}
		
		
	},
	
	addNewPlayer: function() {
		
		var storePlayer = new Player(this.playerId, this.player.name, this.player.score, this.player.guessedWords, this.player.time, this.player.lives);
		this.playerId++;
		this.players.push(storePlayer);
		localStorage.setItem("players", JSON.stringify(this.players));
		
		console.log("peaks kustutama");
		var list = document.getElementById("playerList");
		
		while(list.hasChildNodes()) {
			var n = 0;
			list.removeChild(list.childNodes[n]);
			n++;
		}
		
		pageView = new PageView();
		pageView.sortPlayers();
		
	}
	
};



var Player = function(playerId, playerName, playerScore, playerGuessedWords, playerTime, playerLives) {
	
	this.playerId = playerId;
	this.playerName = playerName;
	this.playerScore = playerScore;
	this.playerGuessedWords = playerGuessedWords;
	this.playerTime = playerTime;
	this.playerLives = playerLives;
	
};


Player.prototype = {
	
	createHTML: function() {
		
		var li = document.createElement("li");
		li.innerHTML = this.playerName + ", " + this.playerScore;
		return li;
		
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
	//var typerGame = new TYPER();
	pageView.sortPlayers();
	//window.typerGame = typerGame;
};
