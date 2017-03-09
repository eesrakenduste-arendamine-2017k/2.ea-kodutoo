var TYPER = function() {

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
    this.player = {
        name: null,
        score: 0
    };
    this.player_id = 0;

    // hakkan hoidma siin kõiki purke
    this.scoreBoard = [];


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

        //resolutsioon
        // kui retina ekraan, siis võib ja peaks olema 2 korda suurem
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;



        // laeme sõnad
        this.loadWords();
    },

    loadPlayerData: function() {

        // küsime mängija nime ja muudame objektis nime
        var p_name = document.getElementById('name').value;
        // Kui ei kirjutanud nime või jättis tühjaks
        if (p_name === null || p_name === "") {
            p_name = "Tundmatu";

        }

        // Mänigja objektis muudame nime
        this.player.name = p_name; // player =>>> {name:"Romil", score: 0}
        // console.log(this.player);
        document.getElementById("playerName").innerHTML = p_name;


    },

    loadWords: function() {

        console.log('loading...');

        // AJAX http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_first
        var xmlhttp = new XMLHttpRequest();

        // määran mis juhtub, kui saab vastuse
        xmlhttp.onreadystatechange = function() {

            //console.log(xmlhttp.readyState); //võib teoorias kõiki staatuseid eraldi käsitleda

            // Sai faili tervenisti kätte
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

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
                // console.log(typerGame.words);

                // küsime mängija andmed
                typerGame.loadPlayerData();

                // kõik sõnad olemas, alustame mänguga
                typerGame.start();
            }
        };

        xmlhttp.open('GET', './lemmad2013.txt', true);
        xmlhttp.send();
    },

    start: function() {

        // Tekitame sõna objekti Word
        this.generateWord();
        //console.log(this.word);

        //joonista sõna
        this.word.Draw();

        this.mistake = 0;

        // Kuulame klahvivajutusi
        window.addEventListener('keypress', this.keyPressed.bind(this));

        // if(localStorage.scoreBoard){
        //   this.scoreBoard = JSON.parse(localStorage.scoreBoard);
        //   console.log('laadisin localStorageist massiiivi ' + this.scoreBoard.length);
        //
        //   this.scoreBoard.forEach(function(player){
        //
        //       var new_score = new Score(player.id, player.name, player.score);
        //
        //       //uuendad moosipurgi id'd et hiljem jätkata kus pooleli jäi
        //       TYPER.instance.player_id = player.id;
        //
        //       // eraldi funktsioonis tekitan <li> elemendi ja lisan loendisse
        //       // var li = new_score.createHtmlElement();
        //       // document.querySelector('.list-of-jars').appendChild(li);
        //
        //   });
        //
        // }
        //
        //
        // this.player_id++;
        // console.log("Uue m2ngija id: "+ this.player_id);

    },

    generateWord: function() {

        // kui pikk peab sõna tulema, + min pikkus + äraarvatud sõnade arvul jääk 5 jagamisel
        // iga viie sõna tagant suureneb sõna pikkus ühe võrra
        var generated_word_length = this.word_min_length + parseInt(this.guessed_words / 5);

        // Saan suvalise arvu vahemikus 0 - (massiivi pikkus -1)
        var random_index = (Math.random() * (this.words[generated_word_length].length - 1)).toFixed();

        // random sõna, mille salvestame siia algseks
        var word = this.words[generated_word_length][random_index];

        // Word on defineeritud eraldi Word.js failis
        this.word = new Word(word, this.canvas, this.ctx);

        //update player score
        this.player.score = this.guessed_words;
        document.getElementById("currentScore").innerHTML = this.player.score;
        var playerName = document.getElementById("playerName").innerHTML;
        var playerScore = document.getElementById("currentScore").innerHTML;
        // console.log("name: "+playerName + " score: " + playerScore);


    },

    keyPressed: function(event) {

            //console.log(event);
            // event.which annab koodi ja fromcharcode tagastab tähe
            var letter = String.fromCharCode(event.which);
            var transparency = 0;
            //console.log(letter);

            // Võrdlen kas meie kirjutatud täht on sama mis järele jäänud sõna esimene
            //console.log(this.word);
            if (letter === this.word.left.charAt(0)) {
                // console.log("prozra4nostj"+transparency);
                // typerGame.canvas.style.background = 'white';
                // Võtame ühe tähe maha
                this.word.removeFirstLetter();

                // kas sõna sai otsa, kui jah - loosite uue sõna

                if (this.word.left.length === 0) {
                    this.guessed_words += 1;

                    //loosin uue sõna
                    this.generateWord();
                }
                //joonistan uuesti
                this.word.Draw();
            } else {
                transparency = this.mistake * 0.1;
                // console.log("prozra4nostj" + transparency);
                typerGame.canvas.style.background = "rgba(255, 0, 0, " + transparency + ")";
                // console.log(mistake);
                this.mistake++;
                document.getElementById("mistake").innerHTML = this.mistake;
                if (this.mistake >= 10) {
                    location.href = '#end-view';

                    var name = document.getElementById('name').value;
                    var score = document.getElementById('currentScore').innerHTML;
                    // console.log("NAME: "+name+" SCORE: "+score);

                    var newScore = new Score(name, score);

                    this.scoreBoard.push(newScore);
                    console.log(JSON.stringify(this.scoreBoard));

                    var li = newScore.createHtmlElement();
                    document.querySelector('.list-of-jars').appendChild(li);
                    console.log(li);



                }
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

var Score = function(new_name, new_score) {
    this.name = new_name;
    this.score = new_score;
    console.log('created new jar');
    console.log(this);
};

Score.prototype = {
  createHtmlElement: function(){
    var li = document.createElement('li');

    var span = document.createElement('span');

    var span_with_content = document.createElement('span');
    span_with_content.className = 'content';

    // console.log(this.name);
    var content = document.createTextNode(this.name);
    console.log("CONTENT"+content);

    return li;

  }
};
