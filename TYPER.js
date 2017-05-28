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
	this.word_min_length = 3;
	this.guessed_words = 0; // arvatud sõnade arv
	this.WronglyGuessed_words = 0; //valesti kirjutatud sõnade arv(kirjavead)
	
	//mängija objekt, hoiame nime ja skoori
	this.player = {name: null, score: 0};
	this.score = 0;
	
	this.finishGame=null;
	
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

		// Mänigja objektis muudame nime
		this.player.name = p_name; // player =>>> {name:"Romil", score: 0}
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
	
		if(!this.finishGame){
			// Tekitame sõna objekti Word
			this.generateWord();
			//console.log(this.word);

			//joonista sõna
			this.drawAll();
			//TyperGame.score.DrawScore();
			//timer tööle
			this.word.Countdown(this.ctx, this.canvas);

			// Kuulame klahvivajutusi
			window.addEventListener('keypress', this.keyPressed.bind(this));
		}
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
		
		if(this.finishGame){return;}
		
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

				//loosin uue sõna
				this.generateWord();
			}

			//joonistan uuesti
			this.word.Draw();
		}else{
			
			this.WronglyGuessed_words += 1;

            //update player score
            this.WronglyGuessed_words = this.WronglyGuessed_words;
			console.log(this.WronglyGuessed_words);
			
		}
	
	this.ctx.clearRect(this.canvas.width*0.5, this.canvas.height*0.0, this.canvas.width, this.canvas.height*0.35);
	this.ctx.fillText(this.player.score,this.canvas.width*0.75, this.canvas.height*0.2);
	
	
	},	// keypress end
	
	finish: function(){
		
		this.finishGame=true;
		
		this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
		window.removeEventListener('keypress', this.keyPressed.bind(this));//bindime keypressed functionile lõpu
		
		
	},
	
	drawAll: function(){
		
		if(!this.finishGame){
			
			this.word.Draw();
			this.word.Countdown(this.ctx, this.canvas);
			
			this.ctx.fillText(this.player.score, this.canvas.width*0.8, this.canvas.height*0.2);
			
		}
		
	},
	
	hiScore: function(){
		
		if(!localStorage.hiScore){
			//massiiviga tühjad lahtrid?
			var hiScore = [
				{
					name:"",
					score:""
				},
				{
					name:"",
					score:""
				},
				{
					name:"",
					score:""
				}
			]
			
			
		}else if(localStorage.hiScore){
			
			hiScore=JSON.parse(localStorage.hiScore);
			
		}
		
		if(this.player.score>=hiScore[0].score || hiScore[0].score==""){
			
			hiScore[2].score=hiScore[1].score;
			hiScore[2].name=hiScore[1].name;
			hiScore[1].score=hiScore[0].score;
			hiScore[1].name=hiScore[0].name;
			hiScore[0].score=this.player.score;
			hiScore[0].name=this.player.name;
			
			
		}else if((this.player.score>=hiScore[1].score && this.player.score<hiScore[0].score) || hiScore[1].score==""){
			
			hiScore[2].score=hiScore[1].score;
			hiScore[2].name=hiScore[1].name;
			hiScore[1].score=this.player.score;
			hiScore[1].name=this.player.name;
			
		}else if((this.player.score>=hiScore[2].score && this.player.score>hiScore[1].score)|| hiScore[2].score==""){
			
			hiScore[2].score=this.player.score;
			hiScore[2].name=this.player.name;
			
		}
		
		localStorage.setItem("hiScore", JSON.stringify(hiScore));
		
		var hiScore = JSON.parse(localStorage.getItem("hiScore"));
		
		this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
		
		var horisontaal=0.0;
		for(i=0;i<3;i++){
			
			if(hiScore[i].score!=""){
				
				this.ctx.fillText(hiScore[i].name, this.canvas.width*0.35, this.canvas.height*(0.5+horisontaal));
				this.ctx.fillText(":"+hiScore[i].score, this.canvas.width*0.9, this.canvas.height*(0.5+horisontaal));
				horisontaal=horisontaal+0.1;
				
			}
			
		}
		this.ctx.fillText("Sinu skoor", canvas.width*0.4, canvas.height*0.3);
		this.ctx.fillText(":"+this.player.score, canvas.width*0.9, canvas.height*0.3);
		this.ctx.fillText("Kirjavigu", canvas.width*0.4, canvas.height*0.4);
		this.ctx.fillText(":"+this.WronglyGuessed_words, canvas.width*0.9, canvas.height*0.4);
		
		
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

function NewGame(){
	
	window.location.reload();
	
}


window.onload = function(){
	var typerGame = new TYPER();
	window.typerGame = typerGame;
};


















