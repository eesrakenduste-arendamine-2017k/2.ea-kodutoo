"use strict"
var TYPER = function () {

    // Kui inimene proovib kaval olla ja läheb otse typerisse.
    if (localStorage.getItem("player") === null) {
        window.location.href = "index.html";
    }

    if (TYPER.instance_) {
        return TYPER.instance_;
    }
    TYPER.instance_ = this;

    // Muutujad
    this.WIDTH = window.innerWidth;
    this.HEIGHT = window.innerHeight;
    this.canvas = null;
    this.ctx = null;

    this.all_words = [];
    this.current_word = null;
    this.word_min_length = 3;
    this.guessed_words = 0;

    // Mängija objekt, hoiame nime ja skoori
    this.local_storage_content = JSON.parse(localStorage.getItem("player"));                         // Võtab kõik mängijad enda sisse.
    this.player = this.local_storage_content.players[this.local_storage_content.players.length - 1]; // Võtab endasse viimati lisatud mängija.
    this.player.score = 0;

    // Must-vaade defauldina. (nagu kord ja kohus)
    this.color = "black";

    // Aja hoidja, mäng kestab 30 sekundid.
    this.time = 30;

    // Äraarvatud sõnad.
    this.guessed_list = {words: []};

    // Valesti kirjutatud tähed.
    this.wrong_letters = {letters: []};

    // Millisel ajahetkel pandi mööda.
    this.timestap = {time: []};

    // Ennast kutsuv funktsioon selle klassi objekti-loomisel.
    this.init();
};


TYPER.prototype = {

    // Funktsioon, mille käivitame alguses.
    // Loob canvase, paneb paika selle suuruse ja loeb sõnad.
    init: function () {

        // Lisame canvas elemendi ja contexti.
        this.canvas = document.getElementsByTagName('canvas')[0];
        this.ctx = this.canvas.getContext('2d');

        // Canvase laius ja kõrgus veebisirvija akna suuruseks (nii style, kui reso).
        this.canvas.style.width = this.WIDTH + 'px';
        this.canvas.style.height = this.HEIGHT + 'px';

        // Resolutsioon.
        // Kui retina ekraan, siis võib ja peaks olema 2 korda suurem.
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;

        // Laeme sõnad
        this.loadWords();
    },

    loadWords: function () {

        console.log('loading...');
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                console.log('successfully loaded');
                var response = xmlhttp.responseText;

                // Tekitame massiivi, faili sisu aluseks, uue sõna algust märgib reavahetuse \n.
                var words_from_file = response.split('\n');

                // Kuna this viitab siin xmlhttp päringule siis tuleb läheneda läbi avaliku muutuja
                // ehk this.all_words asemel tuleb kasutada typerGame.all_words.
                // Asendan massiivi.
                typerGame.all_words = structureArrayByWordLength(words_from_file);
                console.log(typerGame.all_words);

                // Küsime mängija andmed.
                //typerGame.loadPlayerData();

                // Kõik sõnad olemas, alustame mänguga.
                typerGame.start();
            }
        };

        xmlhttp.open('GET', './lemmad2013.txt', true);
        xmlhttp.send();
    },

    start: function () {

        // Tekitame sõna objekti current_word.
        // Salvestab loodud sõna TYPER klassi muutujasse current_word.
        this.generateWord();

        // Joonista sõna.
        this.current_word.Draw(this.player.score, this.color, this.time);

        // Kuulame klahvivajutusi.
        window.addEventListener('keypress', this.keyPressed.bind(this));

        // Paneme paika aja ja mängu lõpu.
        var intervalID = setInterval(function () {
            if (typerGame.time === 0) {
                window.removeEventListener("keypress", typerGame.keyPressed);
                alert("MÄNG LÄBI! SU SKOOR ON " + typerGame.player.score + " punkti!");
                window.location.href = "../statistics.html";

            } else {
                typerGame.time -= 1;
                typerGame.current_word.Draw(typerGame.player.score, typerGame.color, typerGame.time);
            }
        }, 1000);
        if (this.time === 0) {
            clearInterval(intervalID);
        }

    },

    generateWord: function () {

        // Kui pikk peab sõna tulema, + min pikkus + äraarvatud sõnade arvul jääk 5 jagamisel.
        // Iga viie sõna tagant suureneb sõna pikkus ühe võrra.
        var generated_word_length = this.word_min_length + parseInt(this.guessed_words / 5);

        // Saan suvalise arvu vahemikus 0 - (massiivi pikkus -1).
        var random_index = (Math.random() * (this.all_words[generated_word_length].length - 1)).toFixed();

        // Random sõna, mille salvestame siia algseks.
        var current_word = this.all_words[generated_word_length][random_index];

        // current_word on defineeritud eraldi current_word.js failis.
        this.current_word = new Word(current_word, this.canvas, this.ctx, this.player.score);
    },

    keyPressed: function (event) {
        if (event.keyCode === 43) {
            if (this.color === "white") {
                typerGame.color = "black";
            } else {
                typerGame.color = "white";
            }
        }

        // Event.which annab koodi ja fromcharcode tagastab tähe.
        var letter = String.fromCharCode(event.which);

        // Võrdlen kas meie kirjutatud täht on sama mis järele jäänud sõna esimene.
        if (letter === this.current_word.left.charAt(0)) {

            // Võtame ühe tähe maha.
            this.current_word.removeFirstLetter();


            // Kas sõna sai otsa, kui jah - loosite uue sõna.
            if (this.current_word.left.length === 0) {

                this.guessed_list.words.push(this.current_word.word);
                localStorage.setItem("guessed", JSON.stringify(this.guessed_list));

                this.guessed_words += 1;
                this.player.score += 1;
                this.local_storage_content.players[this.local_storage_content.players.length - 1] = this.player;
                localStorage.setItem("player", JSON.stringify(this.local_storage_content));

                // Loosin uue sõna.
                this.generateWord();
            }

        } else if (letter != "+") {
            this.player.score -= 1;
            this.local_storage_content.players[this.local_storage_content.players.length - 1] = this.player;
            localStorage.setItem("player", JSON.stringify(this.local_storage_content)); // Salvestab mängija objekti.

            this.wrong_letters.letters.push(letter);
            localStorage.setItem("letters", JSON.stringify(this.wrong_letters));

            this.timestap.time.push(this.time);
            localStorage.setItem("timestamp", JSON.stringify(this.timestap));

            console.log(letter);
        }

        this.current_word.Draw(this.player.score, this.color, this.time);
    } // keypress end

};


// HELPERID
function structureArrayByWordLength(all_words) {
    // TEEN massiivi ümber, et oleksid jaotatud pikkuse järgi.
    // NT this.all_words[3] on kõik kolmetähelised.

    // Defineerin ajutise massiivi, kus kõik on õiges jrk.
    var temp_array = [];

    // Käime läbi kõik sõnad.
    for (var i = 0; i < all_words.length; i++) {

        var word_length = all_words[i].length;

        // Kui pole veel seda array'd olemas, tegu esimese just selle pikkusega sõnaga.
        if (temp_array[word_length] === undefined) {
            // Teen uue
            temp_array[word_length] = [];
        }

        // Lisan sõna juurde.
        temp_array[word_length].push(all_words[i]);
    }
    return temp_array;
}


window.onload = function () {
    var typerGame = new TYPER();
    window.typerGame = typerGame;
};