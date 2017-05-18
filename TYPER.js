//Globaalsed muutujuad
var timer = document.getElementById("time_left");
var points = document.querySelector("#points");
var g_words = 0;
var mistakes = 0;
var arrPlayerData = JSON.parse(localStorage.getItem('PlayerData1')) || [];
var charsTyped = 0;
var CorrectlycharsTyped = 0;
var quality = 0;


var TYPER = function(){

    if (TYPER.instance_) {
        return TYPER.instance_;
    }
    TYPER.instance_ = this;
		
	// Muutujad
	this.WIDTH = window.innerWidth;
	this.HEIGHT = window.innerHeight;
	this.canvas = null; //canvas
	this.ctx = null;
	this.pages = TYPER.pages;
	this.top10 = []; //TOP10
	this.words = []; // kõik sõnad mis on listis
	this.word = null; // preagu arvamisel olevad sõnaad
	this.word_min_length = 3; // sõna miinimum pikkus
	this.guessed_words = 0; // sõnade arv mis on jub arvatud

	//Siin hoitakse mängijaga seotud parameetreid meeles
	this.player = {playerName: null, points: 0, mistakes: 0, quality: 0};
	
	this.init();
};


TYPER.pages = {
	'home-view': {
		'render': function(){
			console.log('Home');
			$("#game-view").css("display", "none");
			$("#statistics-view").css("display", "none");
			$("#home-view").css("display", "block");
		}
	},
	
	'game-view':{
		'render': function(){	
			console.log('Game');
			$("#game-view").css("display", "block");
			$(".loading").css("display", "none");
			$(".message").css("display", "block");
			$(".words-display").css("display", "none");
			$("#points").css("display", "none");
			$("#statistics-view").css("display", "none");
			$("#home-view").css("display", "none");

			
			window.setTimeout(function(){
				
			$(".loading").css("display", "none");
			$(".message").css("display", "none");
			$(".words-display").css("display", "block");
			$("#points").css("display", "block");
				
				//Siin refreshib esilehte peale mängu lõppemist, mägija saab uuesti alustada
				function pageHashChanged(){
					if(location.hash === '#home-view' || location.hash === '#statistics-view'){
						location.reload();
					}
				}
				
				window.onhashchange = pageHashChanged;
				
				function Timer(){
					timer.innerHTML--;
					if(timer.innerHTML < 0){
						timer.innerHTML = 0;
					}
					
					if(timer.innerHTML <= 0){
						if(timer.innerHTML <= 0 && g_words !== 0){
							
							quality = (CorrectlycharsTyped/charsTyped * 100);
							quality = Math.round((quality) * 100) / 100;
							var n_player = new Leaderboard(player, g_words, mistakes, quality);
							
							arrPlayerData.push(n_player);
							localStorage.setItem('PlayerData1', JSON.stringify(arrPlayerData));
							
						}
						var newH3 = document.createElement('h3');
						newH3.innerHTML = "Sinu skoor jäi: " + g_words;
						document.getElementById('divMdlPlyrBdy').appendChild(newH3);
						$("#mdlPlyrName").modal('show');
						timer.innerHTML = 10;
						
						setTimeout(function(){
						}, 1000);
						
					} else {
						setTimeout(Timer, 1000);
					}
				}
				
				setTimeout(Timer, 1000);
				
			}, 1000);
		}
	},
	
	'statistics-view':{
		'render': function(){
			console.log('Statistics');
			$("#statistics-view").css("display", "block");
			$("#home-view").css("display", "none");
			$("#game-view").css("display", "none");
		}
	}
};

//Siin luuakse localStorage top10 
if(localStorage.PlayerData1){
	
	localStorage.removeItem("PlayerData");
	
	arrPlayerData = JSON.parse(localStorage.PlayerData1);
	arrPlayerData.sort(compareScores);
	this.top10 = arrPlayerData.slice(0, 10);
	
	var counter = 0;
	
	for(i=0; i<this.top10.length; i++){
		
		counter += 1;

		var top10Div = document.createElement('div');
		
		if(i == 0)
			top10Div.className = 'col-md-12 alert alert-success';
		else if(i == 1) 
			top10Div.className = 'col-md-12 alert alert-info';
		else if(i == 2) 
			top10Div.className = 'col-md-12 alert alert-warning';
		else 
			top10Div.className = 'col-md-12 alert alert-danger';
		
		top10Div.innerHTML = counter + ". " + this.top10[i].playerName + "   (" + this.top10[i].points + ")";
		
		document.getElementById('divtop10Players').appendChild(top10Div);
	
	}
	
	//Siin luuakse tabel kõikide mängijate jaoks
	
	for(i=0; i<arrPlayerData.length; i++){
		
		var table_row = document.createElement('tr');
		
		var tdplayerName = document.createElement('td');
		var tdpoints = document.createElement('td');
		var tdmistakes = document.createElement('td');
		var tdquality = document.createElement('td');
		
		var p_content = document.createTextNode(arrPlayerData[i].playerName);
		var s_content = document.createTextNode(arrPlayerData[i].points);
		var m_content = document.createTextNode(arrPlayerData[i].mistakes);
		var a_content = document.createTextNode(arrPlayerData[i].quality + "%");
		
		tdplayerName.appendChild(p_content);
		tdpoints.appendChild(s_content);
		tdmistakes.appendChild(m_content);
		tdquality.appendChild(a_content);
		
		table_row.appendChild(tdplayerName);
		table_row.appendChild(tdpoints);
		table_row.appendChild(tdmistakes);
		table_row.appendChild(tdquality);
		
		var connect_table = document.querySelector(".players_table_body");
		
		connect_table.appendChild(table_row);
		
	}
}

TYPER.prototype = {

	init: function(){
		
		window.addEventListener('hashchange', this.ChangePage.bind(this));
		
		if(!window.location.hash){
			window.location.hash = 'home-view';
		} else {
			this.ChangePage();
		}
		// Lisame canvas elemendi ja contexti
		this.canvas = document.getElementsByTagName('canvas')[0];
		this.ctx = this.canvas.getContext('2d');

		// canvase laius ja kõrgus veebisirvija akna suuruseks (nii style, kui reso)
		/* this.canvas.style.width = this.WIDTH + 'px';
		this.canvas.style.height = this.HEIGHT + 'px'; */

		this.canvas.style.width = '100%';
		this.canvas.style.height = (this.HEIGHT/2 -50) + 'px';
		
		//resolutsioon 
		// kui retina ekraan, siis võib ja peaks olema 2 korda suurem
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.loadWords();
		
	},

	loadPlayerData: function(){
		
		// Küsitakse mängija nime
		var p_name = prompt("Sisesta oma nimi");

		// Kui nime ei kirjutata siis automaatselt, tundmatu
		if(p_name === null || p_name === ""){
			p_name = "Tundmatu";
		
		}
		this.player.playerName = p_name; 
		player = this.player.playerName;
        console.log(this.player);
	}, 
// Selles funktisoonis laetakse sõnad lemmad2013.txt failist
	loadWords: function(){

        console.log('Laeb...');
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange = function(){


			if(xmlhttp.readyState == 4 && xmlhttp.status == 200){

                console.log('Successfully loaded');

				var response = xmlhttp.responseText;
				var words_from_file = response.split('\n');
				TYPERGame.words = structureArrayByWordLength(words_from_file);
                TYPERGame.loadPlayerData();
				TYPERGame.start();
			}
		};

		xmlhttp.open('GET','./lemmad2013.txt',true);
		xmlhttp.send();
	}, 

	start: function(){

		this.generateWord();
		this.word.Draw();
		window.addEventListener('keypress', this.keyPressed.bind(this));

	},
	// siin genereeritakse sõnad min ja max pikkused
    generateWord: function(){

        var genWordLen =  this.word_min_length + parseInt(this.guessed_words/5);
    	var ranIndex = (Math.random()*(this.words[genWordLen].length-1)).toFixed();
    	var word = this.words[genWordLen][ranIndex];
        this.word = new Word(word, this.canvas, this.ctx);
    },
    // Siin funktsioonis on kõik seotud mängu sise tegevusega, kuidas lisatakse aega ja vüetakse tähed maha jne.
	keyPressed: function(event){
		var letter = String.fromCharCode(event.which);
		if(letter === this.word.left.charAt(0)){
			this.word.removeFirstLetter();
			
			CorrectlycharsTyped += 1;
			charsTyped += 1;
			

			if(this.word.left.length === 0){

				this.guessed_words += 1;
				
				timer.innerHTML = parseInt(timer.innerHTML) + 2;

                this.player.points = this.guessed_words;
				g_words = this.guessed_words;
				document.getElementById("points").innerHTML = "Score: " + g_words;

				this.generateWord();
			}

			this.word.Draw();
			
		} else {
			
			charsTyped += 1;
			mistakes += 1;
			
			document.body.style.background = "red";
			window.setTimeout(function(){
				document.body.style.background = "white";
			}, 50);
			
			timer.innerHTML = parseInt(timer.innerHTML) - 2;
			
			if(timer.innerHTML < 0){
				timer.innerHTML = 0;
			}
			
		}

	}, 
	
	ChangePage: function(event){
		
		this.currentPage = location.hash.slice(1);
		console.log(this.currentPage);
		
		if(this.pages[this.currentPage]){
			
			this.UpdateNavigation();
			this.pages[this.currentPage].render();
			
		} else {
			
			console.log("Tekkis probleem");
			
		}
	},
	
	UpdateNavigation: function(){	
		document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');
		document.querySelector('.' + this.currentPage).className += ' active-menu';
	}

};

var Leaderboard = function(playerName, points, mistakes, quality){
	
	this.playerName = playerName;
	this.points = points;
	this.mistakes = mistakes;
	this.quality = quality;
	
};

function structureArrayByWordLength(words){

    var temp_array = [];
    for(var i = 0; i < words.length; i++){

        var word_length = words[i].length;
        if(temp_array[word_length] === undefined){
            temp_array[word_length] = [];
        }
        temp_array[word_length].push(words[i]);
    }

    return temp_array;
}


window.onload = function(){
	var TYPERGame = new TYPER();
	window.TYPERGame = TYPERGame;
};
//Funktsioon kust läheb tagasi esilehele
function goToHome(){
	window.location.hash = 'home-view';
}
//Funktsioon mis võrdleb skoore
function compareScores(val1, val2){
	
	if(val1.points > val2.points)
		return -1;
	else if(val1.points < val2.points)
		return 1;
	else
		return 0;
}

