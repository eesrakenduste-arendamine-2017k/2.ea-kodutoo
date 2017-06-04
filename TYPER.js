var TYPER = function(){
    if (TYPER.instance_) {
        return TYPER.instance_;
    }
    TYPER.instance_ = this;

	this.WIDTH = window.innerWidth;
	this.HEIGHT = window.innerHeight;
	this.canvas = null;
	this.ctx = null;

	this.words = [];
	this.word = null;
	this.word_min_length = 3;
	this.guessed_words = 0;
	this.typo = 0;
	this.player = {name: null, score: 0};

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

		this.loadWords(this.canvas);
	},

	loadPlayerData: function(){
		var p_name = prompt("Sisesta mängija nimi");
		
		if(p_name === null || p_name === ""){
			p_name = "Tundmatu";
		}

		this.player.name = p_name;
	},

	loadWords: function(canvas){
		var xmlhttp = new XMLHttpRequest();
		
		xmlhttp.onreadystatechange = function(){
			if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
				var response = xmlhttp.responseText;
				var words_from_file = response.split('\n');
				typerGame.words = structureArrayByWordLength(words_from_file);
                typerGame.loadPlayerData();
				typerGame.start();
			}
		};
		xmlhttp.open('GET','./lemmad2013.txt',true);
		xmlhttp.send();
	},

	start: function(){
		this.generateWord();
        this.drawAll();
		window.addEventListener('keypress', this.keyPressed.bind(this));
	},

    drawAll: function(){
        requestAnimFrame(window.typerGame.drawAll.bind(window.typerGame));
		this.word.Draw();
    },

    generateWord: function(){
        var generated_word_length =  this.word_min_length + parseInt(this.guessed_words/5);
    	var random_index = (Math.random()*(this.words[generated_word_length].length-1)).toFixed();
    	var word = this.words[generated_word_length][random_index];
        this.word = new Word(word, this.canvas, this.ctx);
    },

	keyPressed: function(event){
		var letter = String.fromCharCode(event.which);
		if(letter === this.word.left.charAt(0)){
			document.getElementById("canvas").style.background = 'rgb(100,255,100)'
			setTimeout(function(){document.getElementById("canvas").style.backgroundImage = 
				'url("http://www.planwallpaper.com/static/images/colorful-triangles-background_yB0qTG6.jpg")';}, 100);
			this.word.removeFirstLetter();
			if(this.word.left.length == 0){
				this.guessed_words += 1;
                this.player.score = this.guessed_words;
				this.generateWord();
			}
			this.word.Draw();
		} else{
			document.getElementById("canvas").style.background = 'rgb(255,100,100)'
			setTimeout(function(){document.getElementById("canvas").style.backgroundImage = 'url("http://www.planwallpaper.com/static/images/colorful-triangles-background_yB0qTG6.jpg")';}, 100);
			this.typo = this.typo +1;
		}
	}
};

function structureArrayByWordLength(words){
    var temp_array = []
    for(var i = 0; i < words.length; i++){
        var word_length = words[i].length;
        if(temp_array[word_length] === undefined){
            temp_array[word_length] = [];
        }
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
