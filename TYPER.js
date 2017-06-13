var taimer = 60;

var TYPER = function () {

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
    this.guessed_words = 0
    this.totalGuessedWords = 0 || JSON.parse(localStorage.getItem("totalGuessedWords"))
    this.totalGames = 0 || JSON.parse(localStorage.getItem("totalGames"))
    this.totalGames++
        this.errors = 0 || JSON.parse(localStorage.getItem("totalErrors"))

    //mängija objekt, hoiame nime ja skoori
    this.player = {
        name: null,
        score: 0
    };

    this.init();

    showTop10();
};

TYPER.prototype = {

    // Funktsioon, mille käivitame alguses
    init: function () {

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

    loadPlayerData: function () {
        self = this
        // küsime mängija nime ja muudame objektis nime
        var p_name = prompt("Sisesta mängija nimi");

        // Kui ei kirjutanud nime või jättis tühjaks
        if (p_name === null || p_name === "") {
            p_name = "Tundmatu";

        }

        // Mänigja objektis muudame nime
        this.player.name = p_name; // player =>>> {name:"Romil", score: 0}
        console.log(this.player);
        this.stopper()

    },

    loadWords: function () {
        var self = this
        console.log('loading...');

        // AJAX http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_first
        var xmlhttp = new XMLHttpRequest();

        // määran mis juhtub, kui saab vastuse
        xmlhttp.onreadystatechange = function () {

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
                self.words = structureArrayByWordLength(words_from_file);

                // küsime mängija andmed
                self.loadPlayerData();

                // kõik sõnad olemas, alustame mänguga
                self.start();
            }
        };

        xmlhttp.open('GET', './lemmad2013.txt', true);
        xmlhttp.send();
    },

    start: function () {

        // Tekitame sõna objekti Word
        this.generateWord();
        //console.log(this.word);

        //joonista sõna
        this.word.Draw();

        // Kuulame klahvivajutusi
        window.addEventListener('keypress', this.keyPressed.bind(this));

    },

    generateWord: function () {

        // kui pikk peab sõna tulema, + min pikkus + äraarvatud sõnade arvul jääk 5 jagamisel
        // iga viie sõna tagant suureneb sõna pikkus ühe võrra
        var generated_word_length = this.word_min_length + parseInt(this.guessed_words / 5);

        // Saan suvalise arvu vahemikus 0 - (massiivi pikkus -1)
        var random_index = (Math.random() * (this.words[generated_word_length].length - 1)).toFixed();

        // random sõna, mille salvestame siia algseks
        var word = this.words[generated_word_length][random_index];

        // Word on defineeritud eraldi Word.js failis
        this.word = new Word(word, this.canvas, this.ctx);
    },

    keyPressed: function (event) {
        if (taimer <= 0) {
            return;
        }
        //console.log(event);
        // event.which annab koodi ja fromcharcode tagastab tähe
        var letter = String.fromCharCode(event.which);
        //console.log(letter);

        // Võrdlen kas meie kirjutatud täht on sama mis järele jäänud sõna esimene
        //console.log(this.word);
        if (letter === this.word.left.charAt(0)) {

            // Võtame ühe tähe maha
            this.word.removeFirstLetter();

            // kas sõna sai otsa, kui jah - loosite uue sõna

            if (this.word.left.length === 0) {

                this.guessed_words += 1;
                this.totalGuessedWords += 1;

                //update player score
                this.player.score = this.guessed_words;
                grab("skoor").innerHTML = "SKOOR:" + this.player.score;

                //loosin uue sõna
                this.generateWord();
            }

            //joonistan uuesti
            this.word.Draw();
        } else {
            if (taimer < 5) {
                taimer = 0

            } else {
                taimer = taimer - 5
            }

            colorChange("#cc0d4e")
            setTimeout(colorChange, 100)
            grab("taimer").innerHTML = "AEG:" + taimer;
            this.errors++

        }

    }, // keypress end

    stopper: function () {
        var self = this;
        var intervall = setInterval(function () {
            if (taimer != 0) {
                taimer = taimer - 1
            }
            grab("taimer").innerHTML = "AEG:" + taimer;
            if (taimer <= 0) {
                clearInterval(intervall)
                hideCanvas();
                gameOver(self.player.score);
                saveStatistics(self.totalGuessedWords, self.errors, self.totalGames)
                addPlayerDataToLocalStorage(self.player);
                sortTopScores();

            }

        }, 1000)
    }

};



function gameOver(score) {
    grab("wrapper").style.display = "block";
    grab("buttons").innerHTML = '<a href="#" id="back" class="button">Avalehele</a>'
    grab("content").innerHTML = "<h2>GAME OVER!</h2><br><br>Sinu skoor oli " + score;
    grab("back").addEventListener("click", function () {
        window.location.reload(false);

    })


}


function hideCanvas() {
    document.getElementsByTagName("canvas")[0].style.display = "none";

}



//localstorage kräu


function addPlayerDataToLocalStorage(objekt) {
    if (!localStorage["skoorid"]) {
        var arr = []
        arr.push(objekt)
        localStorage.setItem("skoorid", JSON.stringify(arr))
    } else {
        var arr = JSON.parse(localStorage.getItem("skoorid"))

        arr.push(objekt)
        localStorage.setItem("skoorid", JSON.stringify(arr));
    }

}

function sortTopScores() {
    var arr = JSON.parse(localStorage.getItem("skoorid"))
    arr.sort(function (a, b) {
        return b.score - a.score;

    });
    var sliceArray = arr.slice(0, 10)
    localStorage.setItem("skoorid", JSON.stringify(sliceArray));

}

function showTop10() {
    grab("content").innerHTML = "<b>Top 10 mängijad:</b><br><br>";
    var arr = JSON.parse(localStorage.getItem("skoorid"))

    if (!arr) {
        grab("content").innerHTML += "Hetkel rekordid puuduvad!";
    } else {
        for (var i = 0; i < arr.length; i++) {
            grab("content").innerHTML += "<b>"+arr[i].name + "</b> teenis mängus " + arr[i].score + " punkti<br>";

        }
    }
};

function saveStatistics(words, errors, games) {
    localStorage.setItem("totalGuessedWords", JSON.stringify(words));
    localStorage.setItem("totalErrors", JSON.stringify(errors));
    localStorage.setItem("totalGames", JSON.stringify(games));
}

function showStatistics() {
    grab("content").innerHTML = "";
    var errors = JSON.parse(localStorage.getItem("totalErrors"))
    var games = JSON.parse(localStorage.getItem("totalGames"))
    var words = JSON.parse(localStorage.getItem("totalGuessedWords"))

    if (!games && !words && !errors) {
        grab("content").innerHTML = "<b>Statistika</b><br><br>Hetkel pole statistika jaoks piisavalt andmeid. Mängi ja vaata seejärel uuesti siia";
    } else {
        grab("content").innerHTML = "<b>Statistika</b><br><br>mängus kokku arvatud sõnu: " + words + "<br> " + "mängude peale kokku vigu: " + errors + "<br> " + "mänge kokku: " + games;
    }

}

/* HELPERS */

function colorChange(col) {
    if (!col) {
        col = "#FFFFFF"
    }
    document.body.style.backgroundColor = col
}

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


window.onload = function () {

    grab("content").innerHTML = "<b>TYPER</b><br><br>Sinu eesmärgiks on võimalikult kiiresti ja õigesti trükkida ekraanile ilmuvaid sõnu. Mängu alustamiseks vajuta \"mängi\"."

    grab("start").addEventListener("click", function () {
        var typerGame = new TYPER();
        window.typerGame = typerGame;
        document.getElementsByClassName("gameStats")[0].style.display = "block"
        grab("wrapper").style.display = "none";
    })
    grab("top10").addEventListener("click", function () {
        showTop10()
    })
    grab("stats").addEventListener("click", function () {
        showStatistics()
    })
};


function grab(id) {
    return document.getElementById(id)
}