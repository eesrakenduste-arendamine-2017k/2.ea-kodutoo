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

	//mängija objekt, hoiame nime ja skoori
	this.player = {name: null, score: 0};

	
	this.scores = JSON.parse(localStorage.getItem("games"));

	this.init();
};

TYPER.prototype = {

	// Funktsioon, mille käivitame alguses
	init: function(){

		// Lisame canvas elemendi ja contexti
		this.canvas = document.getElementsByTagName('canvas')[0];
		this.ctx = this.canvas.getContext('2d');

		// canvase laius ja kõrgus veebisirvija akna suuruseks (nii style, kui reso)
		this.canvas.style.width = this.WIDTH/1.3+ 'px';
		this.canvas.style.height = this.HEIGHT/1.3+ 'px';

		//resolutsioon 
		// kui retina ekraan, siis võib ja peaks olema 2 korda suurem
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;

		// laeme sõnad
		this.loadWords();
	}, 

	loadPlayerData: function(){

		//et saada kasutaja sisestatud username
		document.getElementById("btn").addEventListener("click", function(){
			var p = document.getElementById("userN").value;
			localStorage.setItem("username", p); 
			
		})

		// küsime mängija nime ja muudame objektis nime
		var p_name = localStorage.getItem("username"); //prompt("Sisesta mängija nimi");
		
		// Kui ei kirjutanud nime või jättis tühjaks
		if(p_name === null || p_name === ""){
			p_name = "Tundmatu";
		}
		document.getElementById("username").textContent = p_name;
		// Mänigja objektis muudame nime
		this.player.name = p_name; 
        
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

		// Tekitame sõna objekti Word
		this.generateWord();
		//console.log(this.word);

        //joonista sõna
		this.word.Draw();

		// Kuulame klahvivajutusi
		window.addEventListener('keypress', this.keyPressed.bind(this));

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

	
	
		if(window.location.hash != "#2view"){ return; }
			
		

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
				
				document.getElementById("score").textContent = this.player.score;
				//loosin uue sõna
				this.generateWord();
				
			





			//LOCALSTORAGE SALVESTAMINE
			if(this.guessed_words > 30){
				
				window.location.hash = "#1view";
				var gamer = this.p_name;
				
				var games = [];
				
				
				
				var game = {
					id: parseInt(1000+Math.random()*999),
					gamerR: localStorage.getItem("username") || "Tundmatu",
					score: document.getElementById("score").textContent || 0,
					mistakes: document.getElementById("missed").textContent || 0
				};
				
				console.log(game);
				
				var gamesFromStorage = null;
				
				if(localStorage.getItem("games")){
					gamesFromStorage = JSON.parse(localStorage.getItem("games"));
					
					if(gamesFromStorage){
						games = gamesFromStorage;
					}
					
				}
						
				games.push(game);
				
				
				
				localStorage.setItem("games", JSON.stringify(games));
				this.scores = JSON.parse(localStorage.getItem("games"));
				
				drawTable();
				
				function savescore(gameId, newScore){

					games.forEach(function(game, key){
						
						console.log(game);
						
						if(gameId == game.id){
							
							game.score = newScore;
							
							console.log("updated");
							console.log(game);
							
						}
						
					});
					
					
					localStorage.setItem("games", JSON.stringify(gamesFromStorage));
				
				}
			}

				
			}
			//KAST NORMAALSUURUSELE TAGASI, KUI ON ÕITESTI VAJUTATUD KLAHVI
			document.getElementById("kast").style.webkitAnimation = "normaalne 0s";
			//joonistan uuesti
			this.word.Draw();
		} 
		
		else {
			//document.getElementById("kast").style.border = "thick solid red";
			//KAST HAKKAB PUNASELT VILKUMA, KUI VAJUTADA VALET KLAHVI, CSS ANIMATSIOON TRIGGER
			document.getElementById("kast").style.webkitAnimation = "keyError 0.5s infinite";
			// ARVUTAB VALESTI VAJUTATUD KEYD
			var wrong = 0;
			var wrongCount = document.getElementById("missed").textContent;
			wrong = Number(wrongCount);
			document.getElementById("missed").textContent = wrong +1;
			console.log(wrongCount);
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

// DRAW TABLE FUNCTION

function drawTable(){
	
	
		
	var table =	document.querySelector("#table");
	var tr = document.createElement("tr");
	tr.style.backgroundColor = "#b0bec5"; 
	table.InnerHTML = "";
	//kui localStorage on olemas, siis joonista andmetega tabel
	
	if(typerGame.scores && typerGame.scores.length > 0){
			
		var th0 = document.createElement("th");
		th0.innerHTML = "id";	
		th0.setAttribute("class", "idField");
		
		var th1 = document.createElement("th");
		th1.innerHTML = "Kasutajanimi";	
		var th2 = document.createElement("th");
		th2.innerHTML = "Skoor";	
		var th3 = document.createElement("th");
		th3.innerHTML = "Vigu";
		
		table.innerHTML = "";
		
		tr.appendChild(th0);
		tr.appendChild(th1);
		tr.appendChild(th2);
		tr.appendChild(th3);
		
		
		table.appendChild(tr);
		
		var userId = 0; 
		
		
			
			
			//tabeli sortimine
			typerGame.scores.sort(function(a, b){
			return b.score-a.score || a.mistakes-b.mistakes;
			})
			
		
		typerGame.scores.forEach(function(game, key){
			
			var td0 = document.createElement("td");
			td0.innerHTML = ++userId;
			var tr = document.createElement("tr");
			var td1 = document.createElement("td");
			td1.innerHTML = game.gamerR;	
			var td2 = document.createElement("td");
			td2.innerHTML = game.score;	
			var td3 = document.createElement("td");
			td3.innerHTML = game.mistakes;
			
			
			
			
			//kui id läheb suuremaks kui 10, siis lõpetab loopimise
			if(userId > 10){
				return;
			}
			td0.setAttribute("class", "idField");
			
			tr.appendChild(td0);
			tr.appendChild(td1);
			tr.appendChild(td2);
			tr.appendChild(td3);
			
			table.appendChild(tr);	
			
		});
		//ku localstorage on tühi, siis joonista tühi tabel
	}	else	{
		
		document.getElementById("table").innerHTML = "";
		
		var table =	document.querySelector("#table");
		var tr = document.createElement("tr");
		tr.style.backgroundColor = "#b0bec5"; 
		
		var th0 = document.createElement("th");
		th0.innerHTML = "id";	
		th0.setAttribute("class", "idField");
		
		var th1 = document.createElement("th");
		th1.innerHTML = "Kasutajanimi";	
		var th2 = document.createElement("th");
		th2.innerHTML = "Skoor";	
		var th3 = document.createElement("th");
		th3.innerHTML = "Vigu";
		
		table.innerHTML = "";
		
		tr.appendChild(th0);
		tr.appendChild(th1);
		tr.appendChild(th2);
		tr.appendChild(th3);
		
		
		table.appendChild(tr);
		
		var counter = 0;
		for(i = counter; i < 10; i++){
					
				var td0 = document.createElement("td");
				td0.innerHTML = ++counter;
				var tr = document.createElement("tr");
				var td1 = document.createElement("td");
				td1.innerHTML = "";	
				var td2 = document.createElement("td");
				td2.innerHTML = "";	
				var td3 = document.createElement("td");
				td3.innerHTML = "";	
				
				td0.setAttribute("class", "idField");
				
				tr.appendChild(td0);
				tr.appendChild(td1);
				tr.appendChild(td2);
				tr.appendChild(td3);
				
				table.appendChild(tr);
				
		}
		userId = 10;
	}
	
	//vaatab et kui tabelis on vähem väärtuseid kui 10tk, siis teeb tühjad lahtrid juurde
	if(userId < 10){
			for(i = userId; i < 10; i++){
				
			var td0 = document.createElement("td");
			td0.innerHTML = ++userId;
			var tr = document.createElement("tr");
			var td1 = document.createElement("td");
			td1.innerHTML = "";	
			var td2 = document.createElement("td");
			td2.innerHTML = "";	
			var td3 = document.createElement("td");
			td3.innerHTML = "";	
			
			td0.setAttribute("class", "idField");
			
			tr.appendChild(td0);
			tr.appendChild(td1);
			tr.appendChild(td2);
			tr.appendChild(td3);
			
			table.appendChild(tr);
			} 
			
	}
	
	console.log("draw table tehtud");
}// function drawTable() lõppeb




document.getElementById("clearTable").addEventListener("click", function(){
	confirm("oled kindel, et soovid jätkata?");
	localStorage.clear();
	typerGame.scores = [];
	
	drawTable();
	 
	
});



window.onload = function(){
	var typerGame = new TYPER();
	window.typerGame = typerGame;
	
	var url = window.location.href;
	var array = url.split('/');
	var lastsegment = array[array.length-1];
	
	if(lastsegment == "index.html"){
		document.getElementById("nav").style.display = "none";	
	}
	
	drawTable();
	
	window.addEventListener("hashchange",function(){
		console.log("leht muutus");
		drawTable();
	})
	
	
};










	








