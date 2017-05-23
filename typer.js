/*
	* skoori arvutus (mitu sõna arvas, või sõltub trükitud sõna pikkusest)
	* (lisage muutujasse skoor)
	* skoor joonistatakse canvasele
	
	vabatahtlik osa

	* annate kasutajale lühikese sõna (4 tähte) ja siis iga 3 trükitud sõna tagant pikkus suureneb
	
	* lugeda kasutaja aega ja joonistada canvasele

	* kui vajutab valet tähte (uus sõna, joonistate canvasele ristküliku taustavärviga)

*/
window.onload = function(){
	TYPER.init();
}

var TYPER = {
	
	// Muutujad
	WIDTH: window.innerWidth,
	HEIGHT: window.innerHeight,
	canvas: null,
	ctx: null,
	words: new Array(),
	word: null,
	add_score: 5,
	remove_score: -10,
	score: null,
	word_min_length: 5,
	guessed_words: 0,
	player: {p_name: "", score: 0},
	player_count: null,
	
	// Funktsioon, mille käivitame alguses
	init: function(){
	
		// Küsime mängija andmed LISATUD
		this.loadPlayerData();
		
		// Saame kätte canvas elemendi
		this.canvas = document.getElementsByTagName('canvas')[0];
		this.ctx = this.canvas.getContext('2d');
		
		// teha canvase laius ja kõrgus veebisirvija akna suuruseks (nii style, kui reso)
		this.canvas.style.width = this.WIDTH + 'px';
		this.canvas.style.height = this.HEIGHT + 'px';
		
		//reso
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		
		// laeme sõnad
		this.loadWords();
		
	},
	//Lisatud
	loadPlayerData: function(){
		
		// küsime mängija nime ja muudame objektis nime
		var p_name = prompt("Sisesta mängija nimi");
		
		// Kui ei kirjutanud nime või jättis tühjaks
		if(p_name == null || p_name == ""){
			p_name = "Tundmatu";
		}
		
		// Mänigja objektis muudame nime
		this.player.name = p_name;
		
		// player =>>> {name:"Romil", score: 0}
		
		// Küsime localStorage'ist player_count'i, kui ei ole siis loome selle väärtusega 1 ja kui on siis suurendame selle väärtust ühe võrra
		this.player_count = localStorage.getItem("player_count");
		
		if(this.player_count == null){
			
			this.player_count = 1;
			localStorage.setItem("player_count", this.player_count);
			
		}else{
			
			this.player_count++;
			localStorage.setItem("player_count", this.player_count);
		}
		
		
		// Salvestan mängija, JSONi kaudu teen mängija objekti stringiks
		
		localStorage.setItem("player_"+this.player_count, JSON.stringify(this.player));
		
		
		// ARVUTADA HIGHSCORE
		
		var highscore = 0;
		
		// käin läbi kõik mängijad 1 - ...
		
		for(var i = 1; i <= this.player_count; i++ ){
		
			// küsin ühe mängija skoori |JSON.parse teeb objektiks
			var one_player_score = JSON.parse(localStorage.getItem("player_"+i)).score;
			
			if(one_player_score > highscore){
				
				highscore = one_player_score;
				
			}
		
		}
		
		alert(highscore);
		
		
		
		
	},
	
	start: function(){
		
		// Tekitame suvalise sõna, objekti Word
		this.word = new TYPER.Word();

		// skooriarvestus
		this.score = new TYPER.Score();

		//console.log(this.word);
		this.word.Draw();

		this.score.Draw();
		
		// Kuulame klahvivajutusi
		//document.getElementsByTagName('canvas')
		//this.canvas.addEventListener('click', function(){ alert('TERE'); });
		window.addEventListener('keypress', this.keyPressed);
		
	},
	
	keyPressed: function(event){
		
		//console.log(event);
		
		// event.which annab koodi ja fromcharcode tagastab tähe
		var letter = String.fromCharCode(event.which);
		
		// Võrdlen kas meie kirjutatud täht on sama mis järele jäänud sõna esimene
		//console.log(TYPER.word);
		if(letter == TYPER.word.left.charAt(0)){
			
			// Võtame ühe tähe maha
			TYPER.word.removeFirstLetter();
			
			TYPER.score.updateScore(TYPER.add_score);
			/*
			kas sõna sai otsa
			
			kui jah - loosite uue sõna
			*/
			
			if(TYPER.word.left.length == 0){
				TYPER.word = new TYPER.Word();
				
				TYPER.guessed_words +=1;
				
				// Uuendan mängija objekti skoori ja salvestan LISATUD
				TYPER.player.score = TYPER.guessed_words;
				localStorage.setItem("player_"+TYPER.player_count, JSON.stringify(TYPER.player));
				
				TYPER.word = new TYPER.Word();
				
			}

			
			//console.log(TYPER.word);
			TYPER.word.Draw();
			TYPER.score.Draw();

			
			
		}
		else {

			TYPER.score.updateScore(TYPER.remove_score);



		}
		TYPER.word.Draw();
		TYPER.score.Draw();
	
	},
	
	loadWords: function(){
	
		// AJAX http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_first
		var xmlhttp = new XMLHttpRequest();
		
		xmlhttp.onreadystatechange = function(){
			//console.log(xmlhttp.readyState);
			
			// Sai faili tervenisti kätte
			if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
				
				// faili sisu
				var response = xmlhttp.responseText;
				//console.log(response);
				
				// tekitame massiivi, faili sisust lähtudes reavahetusest
				var words_from_file = response.split('\n');
				//console.log(words_from_file);
				TYPER.words = words_from_file;
				
				console.log(TYPER.words);
				
				//TYPER.words[    ]
				
				
				// FOR tsükkel
				// küsite iga sõna pikkuse
				
				// defineerin ajutise massiivi, kus kõik on õige jrk 
				var temp_array = [];
				
				// Käime läbi kõik sõnad
				for(var i = 0; i < TYPER.words.length; i++){
					
					var word_length = TYPER.words[i].length;
					
					
					// Kui pole veel seda array'd olemas, tegu esimese just selle pikkusega sõnaga
					if(temp_array[word_length] == undefined){
						
						// Teen uue
						temp_array[word_length] = [];
						
					}
					
					// Küsin kõik sõnad mis on ajutises array's kohal 4
					var current_word_length_array = temp_array[word_length];
					
					// Lisan ühe juurde
					current_word_length_array.push(TYPER.words[i]);
					
					// Panen kogu array tagasi
					temp_array[word_length] = current_word_length_array;
					
				
				}
				
				TYPER.words = temp_array;
				
				//console.log(temp_array);
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				// kõik sõnad olemas, alustame mänguga
				TYPER.start();
			
			}
		};
		
		xmlhttp.open('GET','./vormid.txt',true);
		xmlhttp.send();
		
	
	
	}

}


// Sõna objekt 
TYPER.Word = function(){
	
	// miinimumpikkus + äraarvatud sõnade suhe / 3
	var generated_word_length =  TYPER.word_min_length + parseInt(TYPER.guessed_words/2);

	// Kõik 4'tähelised sõnad
	console.log(TYPER.guessed_words);
	
	// Saan suvalise arvu vahemikus 0 - (massiivi pikkus -1)
	var random_index = (Math.random()*(TYPER.words[generated_word_length].length-1)).toFixed();
	// random sõna
	this.word = TYPER.words[generated_word_length][random_index];
	
	// sõna järel
	this.left = this.word;
	
	//console.log(this.left);
	
	// Joonistame sõna
	this.Draw = function(){
		
		// Tühjendame canvase
		TYPER.ctx.clearRect( 0, 0, TYPER.WIDTH, TYPER.HEIGHT);
		
		
		// Canvasele joonistamine
		TYPER.ctx.textAlign = 'center';
		TYPER.ctx.font = '70px Courier';
		TYPER.ctx.fillStyle = "000";
		
		// tekst, x, y
		// Joonistame sõna, mis on järel
		TYPER.ctx.fillText(this.left, TYPER.WIDTH/2, TYPER.HEIGHT/2);
		
	}
	
	
	// Võtame sõnast ühe tähe maha
	this.removeFirstLetter = function(){
	
		// Võtame esimese tähe sõnast maha
		this.left = this.left.slice(1);
	
	}

	
}

// SKOOR
TYPER.Score = function(){
	this.score = 0;
	this.updateScore = function(offset){
		if(this.score + offset < 0){
			this.score = 0;
		} else {
			this.score += offset;
		}
	}
	
	this.Draw = function(){


		TYPER.ctx.textAlign = 'left';
		TYPER.ctx.font = "70px Courier";
		TYPER.ctx.fillStyle = "000";
		
		TYPER.ctx.fillText(this.score, 300, 200);
		
	}
	
}