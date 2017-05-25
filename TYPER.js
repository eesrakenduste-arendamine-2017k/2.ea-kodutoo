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
	this.finishGame=null;

	//mängija objekt, hoiame nime ja skoori
	this.player = {name: null, score: 0};

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
		this.ctx.textAlign = 'center';
		this.ctx.font = '70px Courier';
		this.scoreBoard();
		this.loadWords();

	}, 

	loadPlayerData: function(){
		
		// küsime mängija nime ja muudame objektis nime
		var p_name = prompt("Tere ! Tegemist on typer stiilis mäng kus tuleb kirjutada sõnu aja peale. Alustamiseks sisesta nimi.");

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
			//this.finishGame=false;
			
			// Tekitame sõna objekti Word
			this.generateWord();
			//console.log(this);
			window.addEventListener('keypress', this.keyPressed.bind(this));

			//joonista sõna
			this.drawAll();
			this.word.Timer(this.ctx, this.canvas);	


			// Kuulame klahvivajutusi
		}
		

	},
	


	
	
	
	finish: function(){
		
		this.finishGame=true;
		
		//console.log(this);
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		window.removeEventListener('keypress', this.keyPressed.bind(this));
		//console.log(this.player.score);
		//console.log("Finish function");
	},
	
	
	
	drawAll: function(){
		
		if(!this.finishGame){		
			this.word.Draw();
			this.word.Timer(this.ctx, this.canvas);
			this.ctx.fillText(this.player.score, this.canvas.width*0.8, this.canvas.height*0.2);
		}
		
	},
	
	scoreBoard: function (){
		

		//console.log("scoreboard algus");
		
		if (!localStorage.leaderboard){
			
			var leaderboard = 
							[
								{	name:"",
									score:""
								},{
									name:"",
									score:""
								},{
									name:"",
									score:""
								}
			
							]
		}else if(localStorage.leaderboard){
		
			leaderboard=JSON.parse(localStorage.leaderboard);
	
		}	
		
		/*
		for (i=0; i<3; i++){
			if(this.player.score>=leaderboard[i].score || leaderboard[i].score==""){
				//console.log(i);
				leaderboard[i+2].score=leaderboard[i+1].score;
				leaderboard[i+2].name=leaderboard[i+1].name;
				leaderboard[i+1].score=leaderboard[i].score;
				leaderboard[i+1].name=leaderboard[i].name;
				leaderboard[i].name=this.player.name;
				leaderboard[i].score=this.player.score;
				break;
			}
		}
		
		*/
		
		if(this.player.score>=leaderboard[0].score || leaderboard[0].score==""){
				leaderboard[2].score=leaderboard[1].score;
				leaderboard[2].name=leaderboard[1].name;
				leaderboard[1].score=leaderboard[0].score;
				leaderboard[1].name=leaderboard[0].name;
				leaderboard[0].name=this.player.name;
				leaderboard[0].score=this.player.score;
			
		}else if((this.player.score>=leaderboard[1].score && this.player.score<leaderboard[0].score) || leaderboard[1].score==""){
				leaderboard[2].score=leaderboard[1].score;
				leaderboard[2].name=leaderboard[1].name;
				leaderboard[1].name=this.player.name;
				leaderboard[1].score=this.player.score;
				
		}else if((this.player.score>=leaderboard[2].score && this.player.score<leaderboard[1].score) || leaderboard[1].score==""){
				leaderboard[2].name=this.player.name;
				leaderboard[2].score=this.player.score;
		}
	
			localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
			
			//console.log(leaderboard[0].name, leaderboard[0].score);
		
			var leaderboard = JSON.parse(localStorage.getItem('leaderboard'));
			
			this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height);
			
			
			
			var yCord=0.0;
			for (i=0; i<3; i++){
			/*
				console.log(1+i+". ");
				console.log(leaderboard[i].name);
				console.log(leaderboard[i].score);
			*/
				if(leaderboard[i].score!=""){
					this.ctx.fillText(leaderboard[i].name, this.canvas.width*0.35, this.canvas.height*(0.4+yCord));
					this.ctx.fillText(":"+leaderboard[i].score, this.canvas.width*0.9, this.canvas.height*(0.4+yCord));
					yCord=yCord+0.1;
				}
				
			}
			
				
		
			/*
			var leaderboard = JSON.parse(localStorage.getItem(this.player.name)) || [];

			var newItem = {
				'name':this.player.name,
				'score':this.player.score
			};

			leaderboard.push(newItem);

			localStorage.setItem(this.player.name, JSON.stringify(leaderboard));
			
			*/
	},

    generateWord: function(){

        // kui pikk peab sõna tulema, + min pikkus + äraarvatud sõnade arvul jääk 5 jagamisel
        // iga viie sõna tagant suureneb sõna pikkus ühe võrra
        var generated_word_length =  this.word_min_length + parseInt(this.guessed_words/1);

    	// Saan suvalise arvu vahemikus 0 - (massiivi pikkus -1)
    	var random_index = (Math.random()*(this.words[generated_word_length].length-1)).toFixed();

        // random sõna, mille salvestame siia algseks
    	var word = this.words[generated_word_length][random_index];
    	
    	// Word on defineeritud eraldi Word.js failis
        this.word = new Word(word, this.canvas, this.ctx);
    },
    
	keyPressed: function(event){
		
		if(this.finishGame){return;}

		//console.log(event);
		// event.which annab koodi ja fromcharcode tagastab tähe
		var letter = String.fromCharCode(event.which);
		//console.log(letter);

		// Võrdlen kas meie kirjutatud täht on sama mis järele jäänud sõna esimene
		//console.log(this.word);
		if(letter === this.word.left.charAt(0)){

		
			this.player.score = this.player.score+1;
			// Võtame ühe tähe maha
			this.word.removeFirstLetter();
			//console.log(this.player.score);
			
			
			// kas sõna sai otsa, kui jah - loosite uue sõna

			if(this.word.left.length === 0){

				this.guessed_words += 1;

				//loosin uue sõna
				this.generateWord();
				
			}

			//joonistan uuesti
			this.word.Draw();
		}else if(letter!=this.word.left.charAt(0)){
			if (this.player.score>0){
				this.player.score=this.player.score-1;
				//console.log(this.player.score);
				
				
			}
			
		}//MIKS SA EI SUUDA VALE TÄHE PEALE PUHASTADA !!!??!!??!
		
		//    var o = Math.round, r = Math.random, s = 255;

		//this.ctx.fillStyle = 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
		//this.ctx.fillRect(500, 0,800,200);
		//this.word.Draw();
		//console.log("clearRect õige süna");
		
		//this.ctx.fillRect(vasak-algus, ülevalt-algus, vasak-lõpp, ülevalt-lõpp);
		
		
		/*
		var o = Math.round, r = Math.random, s = 255;
		this.ctx.fillStyle = 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
		this.ctx.fillRect(this.canvas.width*0.5, this.canvas.height*0.0,this.canvas.width, this.canvas.height*0.4);
		*/
		
		this.ctx.clearRect(this.canvas.width*0.5, this.canvas.height*0.0,this.canvas.width, this.canvas.height*0.35);
		
		this.ctx.fillText(this.player.score, this.canvas.width*0.8, this.canvas.height*0.2);
		

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

window.onload = function(){
	var typerGame = new TYPER();
	window.typerGame = typerGame;
};
