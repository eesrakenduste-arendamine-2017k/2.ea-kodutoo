window.onload = function(){
	TYPER.init();
}

var TYPER = {
	
	// Muutujad
	WIDTH: window.innerWidth,
	HEIGHT: window.innerHeight,
	canvas: null,
	ctx: null,
	words: null,
	word: null,
	min_word_length: 6,
	guessed_word: 0,
	score: null,
	life: null,
	lives: 2,
	timer: null, // Mängu taimeriobjekt
	timer_time: 5,
	player: {name: "", score: 0},
	player_name: null,
	player_count: null,
	gameOver: null,
	highscore: null,
	// Funktsioon mis käivitatakse esimesena
	init: function(){
		
		this.loadPlayerData();
		
		// muutuja canvas, mis esialgselt oli null
		this.canvas = document.getElementsByTagName('canvas')[0];
		this.ctx = this.canvas.getContext('2d');
		//console.log(this.ctx);
		
		// määran canvase suuruse ja reso
		this.canvas.style.width = this.WIDTH+"px";
		this.canvas.style.height = this.HEIGHT+"px";
		
		// Resolutsioon
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		
		// Laeme sõnad
		this.loadWords();
		
	},
	loadPlayerData: function(){
		
		//küsime mängija nime ja muudame objektis nime
		var p_name = prompt("Sisesta mängija nimi");
		if(p_name == null || p_name == ""){
			p_name = "Tundmatu";
		}
		this.player.name = p_name;
		this.player_name = p_name;
		//küsime localStoragest player_counti, kui ei ole, siis loome väärtusega 1, kui on, siis suurendame ühe võrra
		this.player_count = localStorage.getItem("player_count");
		
		if(localStorage.getItem("player_count") == null){
			this.player_count = 1;
			localStorage.setItem("player_count", this.player_count);
		}else{
			this.player_count++;
			localStorage.setItem("player_count", this.player_count);
		}
		
		//Salvestan mängija
		
	
	},
	
	start: function(){
	
		this.word = new this.Word();
		//this.timer = new this.Timer();
		this.life = new this.Life();
		this.word.Draw();
		this.life.Draw();
		this.score = new this.score();
		this.score.Draw();
		

		this.timer = new TYPER.Timer(5);
		this.timer.Drawing();
		this.timer.start();
		//setInterval(TYPER.timer.timerUpdate(), 1000);
		// Kuulame klahvivajutusi keydown, keyup, *** keypress ***
		window.addEventListener('keypress', this.keyPressed);
	
	},
	
	keyPressed: function(event){
		var letter = String.fromCharCode(event.which);
		//console.log(letter);
		//self.Drawing();
		// võrdlen klahvilt saadud tähte, järele jäänud esimese tähega
		if(letter == TYPER.word.left.charAt(0)){
			TYPER.canvas.style.backgroundColor = "BurlyWood";
			//console.log('pihtas');
			
			// Võtame ühe tähe järele jäänud sõnast maha, oma tehtud funktsiooniga
			TYPER.word.removeFirstLetter();
			
			// Kui viimane täht, siis sõna pikkus on 0 ja loosime uue sõna
			if(TYPER.word.left.length == 0){
				TYPER.word = new TYPER.Word();
				TYPER.guessed_word += 1;
				TYPER.score.score_add();
					TYPER.timer.time_left += 2;
			}
			
			
			
			// joonistame sõna uuesti
			
			
		}else if(letter != TYPER.word.left.charAt(0)){
			TYPER.canvas.style.backgroundColor = "red";
			setInterval(function(){TYPER.canvas.style.backgroundColor = "BurlyWood";},500);
			TYPER.score.score_lose();
			TYPER.life.livesLeft();
		}
		TYPER.word.Draw();
		TYPER.score.Draw();
		TYPER.life.Draw();
		
	//TYPER.timer.timerOver();
		
	},
	
	loadWords: function(){
		
		// Ajax - http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_first
		
		var xmlhttp = new XMLHttpRequest();
		
		xmlhttp.onreadystatechange = function(){
			
			// http://www.w3schools.com/ajax/ajax_xmlhttprequest_onreadystatechange.asp
			//console.log(xmlhttp.readyState);
			
			// Kogu andmestiks jõudis edukalt kohale
			if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
				
				// trükin faili sisu
				//console.log(xmlhttp.responseText);
				//console.log('laetud');
				
				// laeme sõnad massiivi
				var words_from_file = xmlhttp.responseText.split('\n');
				//console.log(words_from_file);
				TYPER.words = words_from_file;
				
				
				//console.log(TYPER.words);
				
				var temp_array = [];
				
				for(var i = 0; i < TYPER.words.length; i++){
				
					var one_word = TYPER.words[i];
					var one_word_length = one_word.length;
						
						// Kas selline massiiv on juba olemas, või on
						//see esimese sõna selle pikkusega
						if(temp_array[one_word_length] == undefined){
							
							// kui ei ole veel ühtegi sõna olnud siis teen uue massiivi
							temp_array[one_word_length] = [];
							
						}
						
						// Lisan massiivi
						temp_array[one_word_length].push(one_word);
						
				}
				
				
				TYPER.words = temp_array;
				
				TYPER.start();
				
				
			}
			
		}
		
		xmlhttp.open('GET','./vormid.txt',true);
		xmlhttp.send();
		
	
	}
	
}

TYPER.Word = function(){
	
	
	var generated_word_length = TYPER.min_word_length + parseInt(TYPER.guessed_word/3);
	
	// random indeks vahemikus 0 - massiivi pikkus
	var random_index = (Math.random()*(TYPER.words[generated_word_length].length-1)).toFixed();
	
	this.generated_word = TYPER.words[generated_word_length][random_index];
	this.left = this.generated_word;
	
	
	this.Draw = function(){
		
		//Kustutame canvase tühjaks (x,y,laius,kõrgus)
		TYPER.ctx.clearRect(0,0,TYPER.WIDTH,TYPER.HEIGHT);
		
		// Joonistame canvasele
		TYPER.ctx.textAlign = "center";
		TYPER.ctx.font = "70px Courier";
		//TYPER.ctx.fillStyle = "red";
		
		// tekst, x, y 
		TYPER.ctx.fillText(this.left, TYPER.WIDTH/2, TYPER.HEIGHT/2);
		
		
	
	}
	
	this.removeFirstLetter = function(){
		
		// Võtan järele jäänud sõnast ühe tähe maha
		this.left = this.left.slice(1);
		
	}
}
TYPER.Life = function(){
		
		this.livesLeft = function(){
		
		if(TYPER.lives >= 1){
			TYPER.lives = TYPER.lives - 1;
		}else if(TYPER.lives < 1){
			TYPER.gameOver();
		}
	}
		this.Draw = function(){

		// Joonistame canvasele
		TYPER.ctx.textAlign = "right";
		TYPER.ctx.font = "30px Courier";
		//TYPER.ctx.fillStyle = "red";
		
		// tekst, x, y 
		TYPER.ctx.fillText(TYPER.lives+1, TYPER.WIDTH-200, 100);
		
		
	
	}
}
TYPER.score = function(){
		this.scoreval = 0;
	this.score_add = function(){
			this.scoreval = this.scoreval + 10;
	}
	this.score_lose = function(){
		if((this.scoreval - 20) < 0){
			this.scoreval = 0;
		}else{
			this.scoreval = this.scoreval - 5;
		}
		
	}
	
	this.Draw = function(){
		

		// Joonistame canvasele
		TYPER.ctx.textAlign = "left";
		TYPER.ctx.font = "30px Courier";
		//TYPER.ctx.fillStyle = "red";
		
		// tekst, x, y 
		TYPER.ctx.fillText(this.scoreval, 200, 110);
		

	}
}
TYPER.Timer = function(time){
	
	// Loodud taimeri pikkus, reset'i jaoks
	var create_time = time;
	
	// Taimeri pikkus sekundites
	this.time_left = time;
	
	// Kui taimer käivitada, läheb intervall siia sisse
	this.interval = null;
	
	// Kuna this muutub setInterval'i sees objekti asemel window'ks, on vaja lisamuutujat, mis salvestaks this'i
	// Ja siis kasutan setInterval'iga kutsutava meetodi sees this'i asemel self'i
	var self = this;
	
	// Käivitamine (vähendab iga sekundi tagant)
	this.start = function(){
		this.interval = setInterval(self.update, 1000);
		this.interval = setInterval(self.Drawing, 100);
	}
	
	// Peatamine
	this.stop = function(){
		clearInterval(this.interval);
		this.interval = null;
	}
	
	// Uuendamine ehk ühe sekundi võrra vähendamine
	this.update = function(){
		// Kui pole 0, võta üks maha
		// Kui on 0, peata taimer
		if(self.time_left != 0){
			self.time_left -= 1;
		} else {
			TYPER.gameOver();
		}
		//self.Drawing();
		
	}

	// Reset
	this.reset = function(){
		this.time_left = create_time;
	}
	
	// Joonistamine
	this.Drawing = function(){
		TYPER.word.Draw();
		TYPER.score.Draw();
		TYPER.life.Draw();
		
		TYPER.ctx.textAlign = "center";
		TYPER.ctx.font = "30px Georgia";
		TYPER.ctx.fillStyle = "black";
		
		TYPER.ctx.fillText(self.time_left, TYPER.WIDTH/2, (TYPER.HEIGHT/2)-100);

	}
	
}
TYPER.gameOver = function(){
			
			TYPER.player.score = TYPER.score.scoreval;
			localStorage.setItem("player_"+TYPER.player_count, JSON.stringify(TYPER.player));
			TYPER.insertScore();
			alert("Game over\n\nSinu skoor: " + TYPER.score.scoreval);
			
			TYPER.guessed_word = 1;
			TYPER.Life.lives = 2;
			TYPER.lives = 2;
			TYPER.word = new TYPER.Word();
			TYPER.life = new TYPER.Life();
			TYPER.score.scoreval = 0;
			TYPER.init();
			TYPER.timer.time_left = 6;
}

TYPER.insertScore = function(){
/* 		$(function() {
		
		var name = TYPER.player_name;
		var score = TYPER.score.scoreval;

		var dataString = name="+ name + "&score="+ score;
		if(name=='')
		{
		alert("Nimeta ei arvestata skoori");
		}
		else
		{
		$.ajax({
			type: "POST",
			url: "scoreinsert.php",
			data: dataString,
			cache: true,
			success: function(html){
			console.log("Ok");
			}
		});
		}
		return false;
		}); */
		var name = TYPER.player_name;
		var score = TYPER.score.scoreval;
		document.location = 'scoreinsert.php?name='+name+'&score='+score;
       // window.open("scoreinsert.php", "_self");
		//xmlhttp = new XMLHttpRequest();

       // xmlhttp.open("GET","scoreinsert.php?name="+ name + "&score="+ score,true);

		};