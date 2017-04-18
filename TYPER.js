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

    this.data = this.getFromLocalStorage();

    this.words = []; // kõik sõnad
    this.word = null; // preagu arvamisel olev sõna
    this.word_min_length = 3;
    this.guessed_words = 0; // arvatud sõnade arv

    this.timer = 0;
    var self = this;
    this.counter = setInterval(function () {
        self.timer++;
        this.timer = self.timer;
    }, 1000);

    //this.timer value when new word was displayed.
    this.currentWordTimer = 0;
    //mängija objekt, hoiame nime ja skoori
    this.player = {name: null, score: 0};

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
        let self = this;

        if (this.player.name === null) {
            p_name = prompt("Please enter your name. Leave blank for Anonymous");
            // Kui ei kirjutanud nime või jättis tühjaks
            if (p_name === null || p_name === "") {
                p_name = "Anonymous";
            }
        } else {
            p_name = this.player.name;
        }


        /*****************************
        console.log("JSON TEST START");
        var jsonTest = [{
            name: "Anonymous",
            score: 0,
            wordsGuessed: 0
        },
            {
                name: "Hello",
                score: 500,
                wordsGuessed: 1000
            }];
        console.log(JSON.stringify(jsonTest));
        console.log(JSON.parse(JSON.stringify(jsonTest)));
        console.log("JSON TEST END");
        *****************************/

        //new session
        if (localStorage.getItem("highScores") === null) {
            console.log("Creating a new session.");
            this.newPlayer(p_name, true);
            this.data = this.getFromLocalStorage();
        } else {
            this.data = JSON.parse(localStorage.getItem("highScores"));
            console.log("Existing session found.");
            let found = false;
            //console.log(self.data.length);

            for (let i=0; i<self.data.length; i++){
                //console.log(self.data.length);
                if(self.data[i][0].name === p_name){
                    found = true;
                    console.log("Player found.");
                    break;
                }
            }

            if (!found) this.newPlayer(p_name);
        }


        // Mängija objektis muudame nime
        this.player.name = p_name; // player =>>> {name:"Romil", score: 0}
        //console.log(this.player);
    },

    loadWords: function () {

        console.log('Loading Typer');
        let self = this;
        // AJAX http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_first
        let xmlhttp = new XMLHttpRequest();

        // määran mis juhtub, kui saab vastuse
        xmlhttp.onreadystatechange = function () {

            //console.log(xmlhttp.readyState); //võib teoorias kõiki staatuseid eraldi käsitleda

            // Sai faili tervenisti kätte
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {

                console.log('Typer loaded');

                // serveri vastuse sisu
                let response = xmlhttp.responseText;
                //console.log(response);

                // tekitame massiivi, faili sisu aluseks, uue sõna algust märgib reavahetuse \n
                let words_from_file = response.split('\n');
                //console.log(words_from_file);

                // Kuna this viitab siin xmlhttp päringule siis tuleb läheneda läbi avaliku muutuja
                // ehk this.words asemel tuleb kasutada typerGame.words


                this.data = self.getFromLocalStorage()
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

        //console.log("189 - Current word timer:" + this.currentWordTimer);


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
                if ((this.currentWordTimer.valueOf() + 10) - this.timer.valueOf() < 0) {
                    timeMultiplier = 0;
                } else {
                    timeMultiplier = (this.currentWordTimer.valueOf() + 10) - this.timer.valueOf();
                }

                this.player.score += timeMultiplier * Math.ceil(this.guessed_words / 5);



                //loosin uue sõna
                this.generateWord();
            }

            //joonistan uuesti
            this.word.Draw();
        } else {
            while (this.word.left.length !== 0) {
                this.word.removeFirstLetter();
                this.word.left.length = this.word.left.length;
            }
            alert("Game over! \nYour score: " + this.player.score);
            this.gameOver(this.player.name, this.player.score, this.guessed_words);
            this.guessed_words = 0;
            this.player.score = 0;
            this.generateWord();
            this.word.Draw();
        }

    },

    gameOver: function (player, score, guessed) {
        //Move to high score table
        console.log("Game over.");
        var self = this;
        document.getElementById('scores').scrollIntoView();
        //Update player data, if necessary
        let playerFound = false;
        for (let i=0; i<self.data.length; i++){
            if(self.data[i][0].name === player){
                if(self.data[i][0].score < score) {
                    self.data[i][0].score = score;
                    self.data[i][0].wordsGuessed = guessed;
                    playerFound = true;
                }
            }
        }
        this.saveToLocalStorage(self.data);
        this.data = this.getFromLocalStorage();
        //Update table
        generateTable(this.getFromLocalStorage());
    },

    newPlayer: function (playerName, newSession) {
        console.log("Creating new player.");
        let data;
        if(newSession){
            data = [[{
                name: playerName,
                score: 0,
                wordsGuessed: 0
            }]];
        } else {
            data = this.getFromLocalStorage();
            data.push([{
                name: playerName,
                score: 0,
                wordsGuessed: 0
            }]);
        }
        this.saveToLocalStorage(data);
        generateTable(this.getFromLocalStorage());
        this.data = this.getFromLocalStorage();
    },


    saveToLocalStorage: function (json) {
        localStorage.setItem("highScores", JSON.stringify(json));
    },

    getFromLocalStorage: function () {
        return JSON.parse(localStorage.getItem("highScores"));
    },

    resetTimer: function () {
        this.guessed_words = 0;
        this.player.score = 0;
        this.currentWordTimer = this.timer;
    },


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
/*
function nightModeToggle() {
    let currentColor = document.getElementById("gameCanvas").style["background-color"];
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
*/

function generateTable(data) {
    //clear table
    console.log("Generating new table.");
    let table = document.getElementById("hiscoreTable").getElementsByTagName("tbody")[0];
    table.parentNode.replaceChild(document.createElement('tbody'), table);
    table = document.getElementById("hiscoreTable").getElementsByTagName("tbody")[0];
    if (data!=null && data!=undefined){
        let sortedData = sortData(data);
        for (let i=0; i<sortedData.length; i++){
            let row = table.insertRow(table.rows.length);
            let nameRow = row.insertCell(0);
            let scoreRow = row.insertCell(1);
            let wordsRow = row.insertCell(2);

            nameRow.innerHTML = sortedData[i][0].name;
            scoreRow.innerHTML = sortedData[i][0].score;
            wordsRow.innerHTML = sortedData[i][0].wordsGuessed;
        }
        table = null;
        console.log("New table generated.");
    } else {
        console.log("Cannot generate new table without data.");
    }

}

function sortData(data) {
    console.log("Sorting player data.");
    let sortedData = data.sort(function (a, b) {
        return a[0].score < b[0].score;
    })
    console.log("Player data sorted.");
    return sortedData;

}

window.onload = function () {
    var typerGame = new TYPER();
    window.typerGame = typerGame;
    generateTable(typerGame.getFromLocalStorage());
    //nmToggle.onclick = nightModeToggle();
};

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}
