var time;
// document.getElementById('playBtn').addEventListener('click', function(e){e.preventDefault; TYPER();})

var TYPER = function (){

  // Singleton
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
  this.player = {
    name: null,
    score: 0,
    typos: 0
  };

  this.init();
};

TYPER.prototype = {

  // Funktsioon, mille käivitame alguses
  init: function() {

    // Lisame canvas elemendi ja contexti
    this.canvas = document.getElementsByTagName('canvas')[0];
    this.ctx = this.canvas.getContext('2d');

    // canvase laius ja kõrgus veebisirvija akna suuruseks (nii style, kui reso)
    this.canvas.style.width = this.WIDTH + 'px';
    this.canvas.style.height = this.HEIGHT + 'px';

    // Resolutsioon
    // Kui retina ekraan, siis võib ja peaks olema 2 korda suurem
    this.canvas.width = this.WIDTH;
    this.canvas.height = this.HEIGHT;

    // Laeme sõnad
    this.loadWords();
  },

  loadPlayerData: function() {

    // Küsime mängija nime ja muudame objektis nime
    var p_name = prompt("Enter your name to start:");

    // Kui ei kirjutanud nime või jättis tühjaks
    if (p_name === null || p_name === "") {
      p_name = "Unknown";
    }

    // Mänigja objektis muudame nime
    this.player.name = p_name + " (HIDDEN MODE)"; // player => {name:"Rauno", score: 0}
    console.log(this.player);
    // document.getElementById("playerName").innerHTML = "Mängija: " + this.player.name;
  },

  loadWords: function() {

    console.log('loading...');

    // AJAX http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_first
    var xmlhttp = new XMLHttpRequest();

    // Määran, mis juhtub, kui saab vastuse
    xmlhttp.onreadystatechange = function() {

      // console.log(xmlhttp.readyState); // Võib teoorias kõiki staatuseid eraldi käsitleda

      // Sai faili tervenisti kätte
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        console.log('successfully loaded');

        // Serveri vastuse sisu
        var response = xmlhttp.responseText;
        // console.log(response);

        // tekitame massiivi, faili sisu aluseks, uue sõna algust märgib reavahetuse \n
        var words_from_file = response.split('\n');
        // console.log(words_from_file);

        // Kuna this viitab siin xmlhttp päringule siis tuleb läheneda läbi avaliku muutuja
        // Ehk this.words asemel tuleb kasutada typerGame.words

        // Asendan massiivi
        typerGame.words = structureArrayByWordLength(words_from_file);
        console.log(typerGame.words);

        // Küsime mängija andmed
        typerGame.loadPlayerData();

        // Kõik sõnad olemas, alustame mänguga
        typerGame.start();
      }
    };

    xmlhttp.open('GET', './lemmad2013.txt', true);
    xmlhttp.send();
  },

  start: function() {

    time = 30;
    showTime = document.querySelector("#time");
    timer(time, showTime);

    // Kuulame klahvivajutusi
    window.addEventListener('keypress', this.keyPressed.bind(this));

    // Tekitame sõna objekti Word
    this.generateWord();
    // console.log(this.word)

    // Joonista sõna
    this.word.Draw();

  },

  generateWord: function() {

    // Kui pikk peab sõna tulema, + min pikkus + äraarvatud sõnade arvul jääk 5 jagamisel
    // Iga viie sõna tagant suureneb sõna pikkus ühe võrra
    var generated_word_length = 20;

    // Saan suvalise arvu vahemikus 0 - (massiivi pikkus -1)
    var random_index = (Math.random() * (this.words[generated_word_length].length - 1)).toFixed();

    // Random sõna, mille salvestame siia algseks
    var word = this.words[generated_word_length][random_index];

    // Word on defineeritud eraldi Word.js failis
    this.word = new Word(word, this.canvas, this.ctx);
  },

  keyPressed: function(event) {

    // console.log(event);
    // event.which annab koodi ja fromcharcode tagastab tähe
    var letter = String.fromCharCode(event.which);
    // console.log(letter);

    // Võrdlen, kas meie kirjutatud täht on sama mis järele jäänud sõna esimene
    // console.log(this.word);
    if (letter === this.word.left.charAt(0)) {
      // console.log("right");
      this.player.score += 1;

      // Võtame ühe tähe maha
      this.word.removeFirstLetter();

      // Kas sõna sai otsa, kui jah - loosime uue sõna
      if (this.word.left.length === 0) {

        this.guessed_words += 1;

        // update player score
        // this.player.score = this.guessed_words;
        console.log(this.player.score);
        // Loosin uue sõna
        this.generateWord();
      }

      // Joonistan uuesti
      this.word.Draw();
    } else {
      //console.log("wrong");
      console.log(this.player.typos);
      this.player.score -= 5;
      this.player.typos += 1;
    }
  } // keypress end
};



/* HELPERS */
function structureArrayByWordLength(words) {
  // TEEN massiivi ümber, et oleksid jaotatud pikkuse järgi
  // NT this.words[3] on kõik kolmetähelised

  // defineerin ajutise massiivi, kus kõik on õiges jrk
  var temp_array = [];

  // Käime läbi kõik sõnad
  for (var i = 0; i < words.length; i++) {

    var word_length = words[i].length;

    // Kui pole veel seda array'd olemas, tegu esimese just selle pikkusega sõnaga
    if (temp_array[word_length] === undefined) {
      // Teen uue
      temp_array[word_length] = [];
    }
    // Lisan sõna juurde
    temp_array[word_length].push(words[i]);
  }
  return temp_array;
}

window.onload = function() {
  var typerGame = new TYPER();
  window.typerGame = typerGame;
};

var r;

function timer(time, showTime) {
  var timer = time,
    seconds;
    r = setInterval(function() {
    //minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    //minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? + seconds : seconds;

    if (--timer < 0) {
      var session = [];

      var game = {
        id: parseInt(1000 + Math.random() * 999),
        name: typerGame.player.name,
        score: typerGame.player.score,
        typos: typerGame.player.typos
      };
      
      var gamesFromStorage = null;

      if (localStorage.getItem("session")) {
        gamesFromStorage = JSON.parse(localStorage.getItem("session"));

        if (gamesFromStorage) {
          session = gamesFromStorage;
        }
      }

      session.push(game);

      localStorage.setItem("session", JSON.stringify(session));
      var replay = confirm("Time's up! You're score: " + typerGame.player.score + " Play again?");
      if (replay === true) {
        clearInterval(r);
        timer = time;
        location.reload(typerGame.start);
      } else {
        window.location.href = "index.html";
      }
    }
    console.log("timer");
  }, 1000);
}