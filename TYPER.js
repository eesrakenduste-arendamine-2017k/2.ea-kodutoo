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
    this.guessed_words = 0; // arvatud sõnade arv

    this.timer = 0;
    var that = this;
    this.counter = setInterval(function(){
        that.timer++;
        this.timer = that.timer;

    }, 1000);


    this.currentWordTimer = 0;
    console.log(this.currentWordTimer);
    //mängija objekt, hoiame nime ja skoori
    this.player = {name: null, score: 0, highScore: 0};

    this.init();
};

TYPER.prototype = {

    // Funktsioon, mille käivitame alguses
    init: function () {

        // Lisame canvas elemendi ja contexti

        this.canvas = document.getElementsByTagName("canvas")[0];
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

        // küsime mängija nime ja muudame objektis nime
        let p_name;

        if (this.player.name === null) {
            p_name = prompt("Please enter your name. Leave blank for Anonymous");
            // Kui ei kirjutanud nime või jättis tühjaks
            if (p_name === null || p_name === "") {
                p_name = "Anonymous";
            }
        } else {
            p_name = this.player.name;
        }

        //new session
        if (localStorage.getItem("highScores") === null) {
            console.log("NEW SESSION");
            let newLocalStorage = [{}];
            this.saveToLocalStorage(newLocalStorage);
            this.newPlayer(this.player.name);
        } else {
            this.data = JSON.parse(localStorage.getItem("highScores"));
            console.log("OLD SESSION");
            console.log(this.data);

            let found = false;
            for (let user in this.data) {
                if (this.data.hasOwnProperty(user)) {
                    if (user.name === this.player.name) {
                        console.log("OLD PLAYER");

                        found = true;
                    }
                }

                if (!found) this.newPlayer(this.player.name);
            }
        }

        // Mänigja objektis muudame nime
        this.player.name = p_name; // player =>>> {name:"Romil", score: 0, highScore:0}
        //console.log(this.player);
    },

    loadWords: function () {

        console.log('loading...');

        // AJAX http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_first
        let xmlhttp = new XMLHttpRequest();

        // määran mis juhtub, kui saab vastuse
        xmlhttp.onreadystatechange = function () {

            //console.log(xmlhttp.readyState); //võib teoorias kõiki staatuseid eraldi käsitleda

            // Sai faili tervenisti kätte
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {

                console.log('successfully loaded');

                // serveri vastuse sisu
                let response = xmlhttp.responseText;
                //console.log(response);

                // tekitame massiivi, faili sisu aluseks, uue sõna algust märgib reavahetuse \n
                let words_from_file = response.split('\n');
                //console.log(words_from_file);

                // Kuna this viitab siin xmlhttp päringule siis tuleb läheneda läbi avaliku muutuja
                // ehk this.words asemel tuleb kasutada typerGame.words


                this.data = JSON.parse(localStorage.getItem("highScores"));
                console.log("ONLOAD");
                console.log(this.data);
                console.log(localStorage.getItem("highScores"));
                console.log("/ONLOAD");


                //asendan massiivi
                typerGame.words = structureArrayByWordLength(words_from_file);
                //console.log(typerGame.words);

                // küsime mängija andmed
                typerGame.loadPlayerData();


                // kõik sõnad olemas, alustame mänguga
                typerGame.start();
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
        let generated_word_length = this.word_min_length + parseInt(this.guessed_words / 5);

        // Saan suvalise arvu vahemikus 0 - (massiivi pikkus -1)
        let random_index = (Math.random() * (this.words[generated_word_length].length - 1)).toFixed();

        // random sõna, mille salvestame siia algseks
        let word = this.words[generated_word_length][random_index];

        // Word on defineeritud eraldi Word.js failis
        this.word = new Word(word, this.canvas, this.ctx);
        //start timer
        this.currentWordTimer = this.timer;

        console.log("189 - Current word timer:" + this.currentWordTimer);


    },

    keyPressed: function (event) {

        //console.log(event);
        // event.which annab koodi ja fromcharcode tagastab tähe
        let letter = String.fromCharCode(event.which);
        //console.log(letter);

        // Võrdlen kas meie kirjutatud täht on sama mis järele jäänud sõna esimene
        if (letter === this.word.left.charAt(0)) {

            // Võtame ühe tähe maha
            this.word.removeFirstLetter();

            // kas sõna sai otsa, kui jah - loosite uue sõna

            if (this.word.left.length === 0) {

                this.guessed_words += 1;

                //update player score
                let timeMultiplier;
                if((this.currentWordTimer.valueOf()+10)-this.timer.valueOf() < 0) {
                    timeMultiplier = 1;
                } else {
                    timeMultiplier = (this.currentWordTimer.valueOf()+10)-this.timer.valueOf();
                }
                this.player.score += timeMultiplier * Math.ceil(this.guessed_words / 5);

                //loosin uue sõna
                this.generateWord();
            }

            //joonistan uuesti
            this.word.Draw();
        } else {
            if (this.player.score > this.player.highScore) {
                this.player.highScore = this.player.score;
            }
            while (this.word.left.length !== 1) {
                this.word.removeFirstLetter();
                //this.word.left.length = this.word.left.length;
            }
            alert("Game over! \nYour score: " + this.player.score + "\nYour high score: " + this.player.highScore);
            this.guessed_words = 0;
            this.player.score = 0;
            this.gameOver();
            this.generateWord();
            this.word.Draw();

        }

    },

    gameOver: function () {
        //Move to high score table
        document.getElementById('scores').scrollIntoView();
        //Update player data, if necessary
        let playerName = this.player.name;
        for (let user in this.data) {
            if (this.data.hasOwnProperty(user)) {
                if (user.name === playerName) {
                    if (user.score < this.player.score) {
                        this.updateScore(playerName, this.player.score);
                    }
                }
            }
        }
        console.log(this.data);
        //Update table
        generateTable(this.data);
    },

    updateScore: function (playerName, newScore) {
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].name === playerName) {
                this.data[i].score = newScore;
                this.saveToLocalStorage(this.data);
            }
        }
    },
    newPlayer: function (playerName) {
        console.log("NEW PLAYER");

        let newPlayer = {
            name: playerName,
            score: 0,
            wordsGuessed: 0
        };

        this.data.push(newPlayer);
        console.log(this.data.valueOf());
        this.saveToLocalStorage(this.data);
    },


    saveToLocalStorage: function (json) {
        localStorage.setItem("highScores", JSON.stringify(json));
        this.data = JSON.parse(localStorage.getItem("highScores"));
        console.log(localStorage.getItem("highScores"));

    },


    resetTimer: function () {
        console.log("Word timer reset");
        this.currentWordTimer = this.timer;
    },

    timerCount: function() {
        this.timer++;
    }

};


/* HELPERS */
function structureArrayByWordLength(words) {
    // TEEN massiivi ümber, et oleksid jaotatud pikkuse järgi
    // NT this.words[3] on kõik kolmetähelised

    // defineerin ajutise massiivi, kus kõik on õiges jrk
    let temp_array = [];

    // Käime läbi kõik sõnad
    for (let i = 0; i < words.length; i++) {

        let word_length = words[i].length;

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

function resetTimer() {
    typerGame.resetTimer();
}
const requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
})();

function nightModeToggle() {
    let currentColor = document.getElementsByTagName("canvas").style["background-color"];
    if (currentColor === "#e8eaf6") {
        document.getElementById("nightModeToggle").textContent = "Day mode";
        document.getElementById("nightmodeToggle").style.color = "#e8eaf6";
        document.getElementsByTagName("canvas").style["background-color"] = "#1a237e";
    } else {
        document.getElementById("nightModeToggle").textContent = "Night mode";
        document.getElementById("nightmodeToggle").style.color = "#1a237e";
        document.getElementsByTagName("canvas").style["background-color"] = "#e8eaf6";
    }
}


function generateTable(data) {
    //clear table
    let table = document.getElementById("hiscoreTable").getElementsByTagName('tbody')[0];
    table.parentNode.replaceChild(document.createElement('tbody'), table);
    sortData();
    let i = 0;
    for (let user in data) {
        if (this.data.hasOwnProperty(user)) {
            let row = table.insertRow(i);
            let nameRow = row.insertCell(0);
            let scoreRow = row.insertCell(1);
            let timeRow = row.insertCell(2);
            nameRow.innerHTML = user.name;
            scoreRow.innerHTML = user.score;
            timeRow.innerHTML = user.wordsGuessed;
        }
        i++;
    }

}

function sortData() {
    this.data.sort(function (a, b) {
        return a.score > b.score;
    })
}


window.onload = function () {
    var typerGame = new TYPER();
    window.typerGame = typerGame;
    const nmToggle = document.getElementById("nightModeToggle");
    nmToggle.onclick = nightModeToggle();

    generateTable();
};
