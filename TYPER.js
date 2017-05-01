var score = 0;
var mistakes = 0;
var mistakesCount = 0;
var mistakesNumber = 0; 
window.onload = function() {
        document.getElementById('playerName').innerHTML = playerName();
};

var TYPER = function(){
    //singleton
    if (TYPER.instance_) {
        return TYPER.instance_;
    }
    TYPER.instance_ = this;
    this.WIDTH = window.innerWidth;
    this.HEIGHT = window.innerHeight;
    this.canvas = null;
    this.ctx = null;
    this.words = []; // kõik sõnad
    this.word = null; // preagu arvamisel olev sõna
    this.word_min_length = 4;  
    var ch = document.getElementsByName('diffLevel');
    for (var i = ch.length; i--;) {
        ch[i].onchange = function() {
            var diffStr = this.value;
            localStorage.setItem("diffStr", diffStr);
            localStorage.getItem("diffStr", diffStr);
            this.word_min_length = JSON.parse(localStorage.getItem('diffStr')); 
            console.log(this.word_min_length);
        }
    };
    this.word_min_length = JSON.parse(localStorage.getItem('diffStr')); 
    this.guessed_words = 0; // arvatud sõnade arv
    //mängija objekt, hoiame nime ja skoori
    this.player=0;
    this.init();
};

TYPER.prototype = {
    // Funktsioon, mille käivitame alguses
    init: function(){
        this.canvas = document.getElementsByTagName('canvas')[0];
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.width = this.WIDTH + 'px';
        this.canvas.style.height = this.HEIGHT + 'px';
        //resolutsioon
        // kui retina ekraan, siis võib ja peaks olema 2 korda suurem
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
        this.color2 = 1;
        this.color1 = 50;
        this.up = 0;
        this.loadWords();
    },
    loadPlayerData: function(){
        // küsime mängija nime ja muudame objektis nime
        var p_name = prompt("Enter Your Name:");
        // Kui ei kirjutanud nime või jättis tühjaks
        if(p_name === null || p_name === ""){
            p_name = "Unknown";
        }

        this.player = {name: p_name, score: 0, gameId: parseInt(1000+Math.random()*999999)};
        // Mänigja objektis muudame nime
        this.playerNameArray = JSON.parse(localStorage.getItem('playerName'));

        if(!this.playerNameArray || this.playerNameArray.length===0){
            this.playerNameArray=[];
        }

        this.playerNameArray.push(this.player);
        localStorage.setItem("playerName",  JSON.stringify(this.playerNameArray));
        //localStorage["palyerName"]+= this.player.name;
        console.log(this.player); 
    },
    loadWords: function(){
        console.log('loading...');
        var xmlhttp = new XMLHttpRequest();
        // määran mis juhtub, kui saab vastuse
        xmlhttp.onreadystatechange = function(){
            // Sai faili tervenisti kätte
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
                // serveri vastuse sisu
                var response = xmlhttp.responseText;
                // tekitame massiivi, faili sisu aluseks, uue sõna algust märgib reavahetuse \n
                var words_from_file = response.split('\n');
                // Kuna this viitab siin xmlhttp päringule siis tuleb läheneda läbi avaliku muutuja
                // ehk this.words asemel tuleb kasutada typerGame.words
                //asendan massiivi
                typerGame.words = structureArrayByWordLength(words_from_file);
                // küsime mängija andmed
                typerGame.loadPlayerData();
                // kõik sõnad olemas, alustame mänguga
                typerGame.start();
            }
        };

        xmlhttp.open('GET','./english_words.txt',true);
        xmlhttp.send();
    },

    start: function(){
        // Tekitame sõna objekti Word
        this.generateWord();
        this.drawAll();
        // Kuulame klahvivajutusi
        window.addEventListener('keypress', this.keyPressed.bind(this));
    },

    drawAll: function(){
        requestAnimFrame(window.typerGame.drawAll.bind(window.typerGame));
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
        this.playerNameArray.forEach(function (player, key) {
            console.log(player);
            if (player.gameId == typerGame.player.gameId) {
                player.score = typerGame.player.score;
            }
        });

        localStorage.setItem("playerName", JSON.stringify(this.playerNameArray));
    },

    keyPressed: function(event){
        // event.which annab koodi ja fromcharcode tagastab tähe
        var letter = String.fromCharCode(event.which);
        // Võrdlen kas meie kirjutatud täht on sama mis järele jäänud sõna esimene
        if(letter === this.word.left.charAt(0)){
            this.word.left.charAt(0);
            this.word.removeFirstLetter();
            // kas sõna sai otsa, kui jah - loosite uue sõna
            if(this.word.left.length === 0){
                this.guessed_words += 1;
                //update player score
                this.player.score = this.guessed_words-mistakes/7;
                this.player.score = Math.round( this.player.score * 10 ) / 10;
                score=this.player.score;
                if(this.color1<=255 && this.up===0) {
                    document.getElementById('bg').innerHTML = '<style>canvas{background-color: green;};</style>';
                    window.setTimeout(function () {
                        document.getElementById('bg').innerHTML = '<style>canvas{background-color: white;};</style>';
                    }, 250);
                }

            this.savescore();
                //round score to 1 decimal point
                this.player.score = Math.round( this.player.score * 10 ) / 10;
                if(this.player.score < 0){
                    this.player.score = 0;
                }
                //loosin uue sõna
                this.generateWord();
            }
            //joonistan uuesti
            this.word.Draw();
        }else{
            mistakesCount+=0.1;
            mistakes+=1+mistakesCount;
            mistakesNumber+=1;
            if(this.color2<100 && gameFinished===0) {
                if(this.color1<=255 && this.up===0) {    
                    document.getElementById('bg').innerHTML = '<style>canvas{background-color: red;};</style>';
                    window.setTimeout(function () {
                        document.getElementById('bg').innerHTML = '<style>canvas{background-color: white;};</style>';
                    }, 250);
                    this.color1 = this.color1 + 10;
                    if(this.color1>=255){
                        this.up=1;
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
    return  window.requestAnimationFrame   ||
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

function restartGame(){
    if(gameFinished==1){
        location.href = "landing.html";
    }
}

function validate()
{
  var retval = false;
  for (var i=0; i < document.myForm.r.length; i++)
  {
    if (document.myForm.r[i].checked)
    {
      retval = true;
    }
  }
  console.log("Please choose difficulty!");
  return retval;
}
 
var count = 0;
function playerName(){
    var playerNameData = JSON.parse(localStorage.getItem("playerName"));
    playerNameData.sort(function(a, b) {
        return b.score - a.score;
    });

    playerNameData.forEach(function (player, key) {
        if(count>=10){
            return;
        }
        document.getElementById("playerName").style.fontSize= "100%";   
        document.getElementById("playerName").innerHTML +=count+1+". "+ player.name+"<a style='float: right; padding-top: 0px'>"+player.score+"</a><hr style='padding: 0px'>";
        count+=1;
    });
}