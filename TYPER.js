var score = 0;
var mistakes = 0;
var mistakesCount = 0;
var mistakesnr = 0;
window.onload = function() {
        document.getElementById('playerName').innerHTML = playerName();

};

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
	this.word_min_length = 4;
	this.guessed_words = 0; // arvatud sõnade arv
	//mängija objekt, hoiame nime ja skoori
	this.player=0;
	this.init();

};
TYPER.prototype = {
	// Funktsioon, mille käivitame alguses
	init: function(){
		// Lisame canvas elemendi ja contexti
		this.canvas = document.getElementsByTagName('canvas')[0];

		this.ctx = this.canvas.getContext('2d');
		console.log("Siin");
		// canvase laius ja kõrgus veebisirvija akna suuruseks (nii style, kui reso)
		this.canvas.style.width = this.WIDTH + 'px';
		this.canvas.style.height = this.HEIGHT + 'px';
		//resolutsioon
		// kui retina ekraan, siis võib ja peaks olema 2 korda suurem
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;

        this.varv3 = 1;
        this.varv2 = 50;
        this.varv = 0.2;
        this.up = 0;

		this.loadWords();
	},
	loadPlayerData: function(){
		// küsime mängija nime ja muudame objektis nime
		var p_name = prompt("Sisesta mängija nimi");
		// Kui ei kirjutanud nime või jättis tühjaks
		if(p_name === null || p_name === ""){
			p_name = "Tundmatu";
		}

        this.player = {name: p_name, score: 0, gameId: parseInt(1000+Math.random()*999999)};
		// Mänigja objektis muudame nime

        this.playerNameArray = JSON.parse(localStorage.getItem('playerName'));

        if(!this.playerNameArray || this.playerNameArray.length===0){
            this.playerNameArray=[];
        }

        this.playerNameArray.push(this.player);
        console.log("lisatud");


        localStorage.setItem("playerName",  JSON.stringify(this.playerNameArray));
        //localStorage["palyerName"]+= this.player.name;

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
		// Tekitame sõna objekti Word
		this.generateWord();
		//console.log(this.word);

		this.drawAll();
		// Kuulame klahvivajutusi
		window.addEventListener('keypress', this.keyPressed.bind(this));

	},
    drawAll: function(){

        requestAnimFrame(window.typerGame.drawAll.bind(window.typerGame));

        //console.log('joonistab');
        //joonista sõna
        this.word.Draw();
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
    savescore: function() {

        //this.playerNameArray = JSON.parse(localStorage.getItem('playerName'));
        //gamesFromStorage = JSON.parse(localStorage.getItem("games"));

        this.playerNameArray.forEach(function (player, key) {
            //gamesFromStorage.forEach(function(game, key){

            console.log(player);
            console.log(typerGame.player);

            if (player.gameId == typerGame.player.gameId) {

                player.score = typerGame.player.score;

                console.log("updated");
                console.log(player);

            }

        });

        localStorage.setItem("playerName", JSON.stringify(this.playerNameArray));
    },
	keyPressed: function(event){
		//console.log(event);
		// event.which annab koodi ja fromcharcode tagastab tähe
		var letter = String.fromCharCode(event.which);
		//console.log(letter);

		// Võrdlen kas meie kirjutatud täht on sama mis järele jäänud sõna esimene
		//console.log(this.word);
		if(letter === this.word.left.charAt(0)){
			this.word.left.charAt(0);


			// Võtame ühe tähe maha
			this.word.removeFirstLetter();

			// kas sõna sai otsa, kui jah - loosite uue sõna
			if(this.word.left.length === 0){
				this.guessed_words += 1;
                //update player score
                this.player.score = this.guessed_words-mistakes;
                score=this.player.score;
                if(this.varv2<=255 && this.up===0) {
                    document.getElementById('bg').innerHTML = '<style>canvas{background-color: rgba(0,128,0,0.57);};</style>';
                    window.setTimeout(function () {
                        document.getElementById('bg').innerHTML = '<style>canvas{background-color:'+NColor+';};</style>';
                    }, 250);
                }


            this.savescore();


				//loosin uue sõna
				this.generateWord();
				console.log("skoor: "+this.player.score);
			}
			//joonistan uuesti
			this.word.Draw();
		}else{
		    mistakesCount+=0.1;
            mistakes+=1+mistakesCount;
            mistakesnr+=1;
			if(this.varv3<100 && gameFinished===0) {
				if(this.varv2<=255 && this.up===0) {
                    document.getElementById('bg').innerHTML = '<style>canvas{background-color:  rgba(' + this.varv2 + ',0,0,1);};</style>';
                    window.setTimeout(function () {
                        document.getElementById('bg').innerHTML = '<style>canvas{background-color:'+NColor+';};</style>';
                    }, 250);
                    this.varv2 = this.varv2 + 10;
                    if(this.varv2>=255){
                    	this.up=1;
					}
        }else if(this.up==1 && gameFinished===0){
                    document.getElementById('bg').innerHTML = '<style>canvas{background-color:  rgba(' + this.varv2 + ',0,0,1);};</style>';
                    window.setTimeout(function () {
                        document.getElementById('bg').innerHTML = '<style>canvas{background-color: '+NColor+';};</style>';
                    },250);
                    this.varv2 = this.varv2 - 10;
                    if(this.varv2<=100){
                    	this.up=0;
					}
				}
            }
    	}
	} // keypress end
};
/* HELPERS */
function structureArrayByWordLength(words){
    // TEEN massiivi ümber, et oleksid jaotatud pikkuse järgi
    // NT this.words[4] on kõik kolmetähelised

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

var requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
}
)();

window.onload = function(){
	var typerGame = new TYPER();
	window.typerGame = typerGame;
};
var night=0;
var NColor='white';
function darkMode(){
	night=(night+1);
	if(night%2==1) {
	    console.log("NightMode ON");
		NColor='darkslategray';
        document.getElementById('bg').innerHTML = '<style>canvas{background-color: darkslategray;};</style>';
    }
    if(night%2===0) {
        console.log("NightMode OFF");
        NColor='white';
        document.getElementById('bg').innerHTML = '<style>canvas{background-color: white;};</style>';
    }
    if(gameFinished==1) {
        location.href = "welcome.html";
    }
}

var secondclick=0;
var random = Math.floor((Math.random() * 2) + 1);
function move(id) {
    document.getElementById(id).innerHTML ='<style>.click{animation-duration:'+random+'s;};</style>';
    document.getElementById(id).className += " click";
}
function firstClick(obj) {
    document.getElementById(obj).innerHTML = "MÄNGIMA!";
    document.getElementById('button').className += " disabled";
    window.setTimeout(function () {

        document.getElementById('button').classList.remove('disabled');
        document.getElementById('button').classList.add('changeColor');
        document.getElementById('button').innerHTML = "MÄNGIMA! <i class='large material-icons'>trending_flat</i>";
    }, random*1000);
	secondclick=1;
}
function toGame()
{
    if (secondclick == 1) {
        location.href = "typer.html";
    }
}
function clickCounter() {
    if (secondclick === 0) {
        if (typeof(Storage) !== "undefined") {
            if (localStorage.clickcount) {
                localStorage.clickcount = Number(localStorage.clickcount) + 1;
            } else {
                localStorage.clickcount = 1;
            }
            document.getElementById("result").innerHTML = "Sa oled mänginud " + localStorage.clickcount + " korda";
        } else {
            document.getElementById("result").innerHTML = "Vabandust, sinu brauser ei luba skoori salvestada";
        }
    }
}
function show(id) {
    document.getElementById(id).style.visibility = "visible";
}
function hide(id) {
    document.getElementById(id).style.visibility = "hidden";
}
var count = 0;
function playerName(){
    console.log("SIIIIINNN");

    var playerNameData = JSON.parse(localStorage.getItem("playerName"));


    playerNameData.sort(function(a, b) {
        return b.score - a.score;
    });

    playerNameData.forEach(function (player, key) {
        //gamesFromStorage.forEach(function(game, key){
        if(count>=10){
            return;
        }
        document.getElementById("playerName").style.fontSize= "80%";
        document.getElementById("playerName").innerHTML +=count+1+" ) "+ player.name+"<a style='float: right;color: maroon;padding-top: 0px'>"+player.score+"</a><hr style='padding: 0px'>";
        count+=1;
    });
}
