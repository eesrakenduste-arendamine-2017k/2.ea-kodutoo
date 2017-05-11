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
	this.word_min_length = 2;
	this.guessed_words = 0; // arvatud sõnade arv
	this.guessed_letters = 0;
	this.typos = 0;
	this.kuulaja = this.keyPressed.bind(this);
	this.teineKuulaja = this.init.bind(this);

	//mängija objekt, hoiame nime ja skoori
	this.player = {name: null, score: 0};
	this.samePlayer;
	this.init();
	this.finishGame = null ;
};

TYPER.prototype = {

	// Funktsioon, mille käivitame alguses
	init: function(){

		window.removeEventListener('click', this.teineKuulaja);

		this.canvas = document.getElementById("blink");
		this.ctx = this.canvas.getContext("2d");

		// canvase laius ja kõrgus veebisirvija akna suuruseks (nii style, kui reso)
		this.canvas.style.width = this.WIDTH + 'px';
		this.canvas.style.height = this.HEIGHT + 'px';

		//resolutsioon 
		// kui retina ekraan, siis võib ja peaks olema 2 korda suurem
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;

		// laeme sõnad
		this.loadWords(this.ctx, this.canvas);
	}, 

	loadPlayerData: function(){

		if(this.samePlayer != 1){
			// küsime mängija nime ja muudame objektis nime
			var p_name = prompt("Sisesta mängija nimi:");

			if(p_name.length >= 10){
				p_name = prompt("Liiga pikk nimi!");
			
			}

			// Kui ei kirjutanud nime või jättis tühjaks
			if(p_name === null || p_name === ""){
				p_name = prompt("Sisesta mängija nimi:");
			
			}

			// Mänigja objektis muudame nime
			this.player.name = p_name; // player =>>> {name:"Romil", score: 0}
	        console.log(this.player);
	    } 
	}, 

	loadWords: function(ctx, canvas){

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
				setTimeout(function(){

				typerGame.start();

				}, 1000);			

				setTimeout(function(){

				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.textAlign = 'center';
				ctx.fillStyle = 'red';
				ctx.font = '100px Courier';
				ctx.fillText("", canvas.width/2, canvas.height/2);
				}, 1000);

			}
		};

		xmlhttp.open('GET','./lemmad2013.txt',true);
		xmlhttp.send();
	}, 

	start: function(){

		this.finishGame = false;
		this.generateWord();

		//var kuulaja = this.keyPressed.bind(this);
		//window.addEventListener('keypress', this.keyPressed.bind(this));
		window.addEventListener('keypress', this.kuulaja);
		this.word.Draw2(this.ctx, this.canvas);
		this.drawAll();
		/*
		setTimeout(function(){
			this.word.ctx.fillText("3...", this.canvas.width/2, this.canvas.height/2);
		}, 0);
		*/


	},


	finish: function(ctx, canvas){

		this.finishGame = true;
		window.removeEventListener('keypress', this.kuulaja);
		finishScore = this.player.score;
		//var playerScoreArray = [this.player.name, finishScore]
		var finishWords = this.guessed_words;
		var finishTypos = this.typos;



		if(!localStorage.edetabel){

			var edetabel = [
								{
									name: "",
									score: ""
								}, {
									name: "",
									score: ""
								}, {
									name: "",
									score: ""
								}, {
									name: "",
									score: ""
								}, {
									name: "",
									score: ""
								}
							];

			localStorage.setItem('edetabel', JSON.stringify(edetabel));
			var olemas = JSON.parse(localStorage.getItem('edetabel'));

			for(i=0; i<=4; i++){
				if(finishScore>olemas[i].score){
					if(i<4){

						for(g=olemas[i]; g<=3; g++){
							olemas[g+1].score = olemas[g].score;
							olemas[g+1].name = olemas[g].name;
						}

						olemas[i].score = finishScore;
						olemas[i].name = this.player.name;
						break;

					} else {
						olemas[i].score = finishScore;
						olemas[i].name = this.player.name;
						break;
					}
					
				}
			}

			localStorage.setItem('edetabel', JSON.stringify(olemas));

		} else if(localStorage.edetabel){


			var olemas = JSON.parse(localStorage.getItem('edetabel'));

			for(i=0; i<=4; i++){
				if(finishScore>olemas[i].score || olemas[i].score === ""){
					if(i<4){

						for(g=olemas[i]; g<=3; g++){
							olemas[g+1].score = olemas[g].score;
							olemas[g+1].name = olemas[g].name;
						}

						olemas[i].score = finishScore;
						olemas[i].name = this.player.name;
						break;

					} else {
						olemas[i].score = finishScore;
						olemas[i].name = this.player.name;
						break;
					}
					
				}
			}

			localStorage.setItem('edetabel', JSON.stringify(olemas));
		}
		var edetabel = JSON.parse(localStorage.getItem('edetabel'));


		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.textAlign = 'center';
		ctx.fillStyle = 'red';
		ctx.font = '50px Courier';
		ctx.fillText("Sinu skoor:", canvas.width*0.45, canvas.height*0.7);
		ctx.fillText(finishScore, canvas.width*0.63, canvas.height*0.7);
		ctx.fillText("Lahendatud sõnu:", canvas.width*0.5, canvas.height*0.8);
		ctx.fillText(finishWords, canvas.width*0.72, canvas.height*0.8);
		ctx.fillText("Vigu:", canvas.width*0.45, canvas.height*0.9);
		ctx.fillText(finishTypos, canvas.width*0.53, canvas.height*0.9);
		ctx.fillText("Mängi uuesti", canvas.width*0.85, canvas.height*0.9);
		ctx.fillText("TOP:", canvas.width*0.5, canvas.height*0.25);

		ctx.fillText(edetabel[0].score, canvas.width*0.7, canvas.height*0.35);
		ctx.fillText(edetabel[0].name, canvas.width*0.4, canvas.height*0.35);

		ctx.fillText(edetabel[1].score, canvas.width*0.7, canvas.height*0.45);
		ctx.fillText(edetabel[1].name, canvas.width*0.4, canvas.height*0.45);

		ctx.fillText(edetabel[2].score, canvas.width*0.7, canvas.height*0.55);
		ctx.fillText(edetabel[2].name, canvas.width*0.4, canvas.height*0.55);

		this.player.score = 0;
		this.guessed_words = 0;
		this.typos = 0;
		this.samePlayer = 1;
		window.addEventListener('click', this.teineKuulaja);

	},
	
    drawAll: function(){

    	if(!this.finishGame){

    	
        requestAnimFrame(window.typerGame.drawAll.bind(window.typerGame));

        console.log('joonistab');
        //joonista sõna
		this.word.Draw();
		this.word.drawScore(this.player.score);
		}
    },


    generateWord: function(){

        // kui pikk peab sõna tulema, + min pikkus + äraarvatud sõnade arvul jääk 5 jagamisel
        // iga viie sõna tagant suureneb sõna pikkus ühe võrra
        var generated_word_length =  this.word_min_length + parseInt(this.guessed_words);

    	// Saan suvalise arvu vahemikus 0 - (massiivi pikkus -1)
    	var random_index = (Math.random()*(this.words[generated_word_length].length-1)).toFixed();

        // random sõna, mille salvestame siia algseks
    	var word = this.words[generated_word_length][random_index];
    	
    	// Word on defineeritud eraldi Word.js failis
        this.word = new Word(word, this.canvas, this.ctx, this.guessed_letters, this.guessed_words);
    },
    
	keyPressed: function(event){

		//console.log(event);
		// event.which annab koodi ja fromcharcode tagastab tähe
		var letter = String.fromCharCode(event.which);
		console.log(letter);

		// Võrdlen kas meie kirjutatud täht on sama mis järele jäänud sõna esimene
		//console.log(this.word);
		if(letter === this.word.left.charAt(0)){

			this.word.paintFirstLetter();
			this.guessed_letters += 1;
			this.player.score += 1;
			// kas sõna sai otsa, kui jah - loosite uue sõna

			if(this.word.left.length === 0){


				this.guessed_words += 1;
				this.guessed_letters = 0;

				//loosin uue sõna
				this.generateWord();
				this.word.Draw();
				
				this.word.ctx.fillStyle = 'red';
			}

			//joonistan uuesti
			this.word.Draw();
			this.word.drawScore(this.player.score);
		} else {
			
			// vale tähe korral blinkib errori
			document.getElementById("blink").style.background = 'url(error.jpg)';
			setTimeout(function(){ document.getElementById("blink").style.background = 'url(template.jpg)'; }, 100);
			this.typos += 1;
			this.player.score -= 2;

			
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
