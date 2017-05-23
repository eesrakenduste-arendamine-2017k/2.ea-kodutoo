"use strict"
function Statistics(){

    if(checkLocal("guessed") === null || checkLocal("letters") === null || checkLocal("timestamp") === null){
        window.location.href = "index.html";
    }


    this.word_list = checkLocal("guessed");
    this.false_letters = checkLocal("letters");
    this.false_timestamps = checkLocal("timestamp");

    this.printWords();
    this.printLetters();
}

Statistics.prototype = {

    // Trükib välja arvatud sõnad.
    printWords : function () {
        var table = document.getElementById("guessed-table");
        var prefix = "<thead><tr><th>#</th><th>Sõnad</th></tr></thead><tbody>";
        var suffix = "";
        for (var j = 0; j < this.word_list.words.length; j++) {
            suffix += "<tr><td>" + (j+1) + "</td><td>" + this.word_list.words[j] + "</td></tr>";
        }
        suffix += "</tbody>";
        table.innerHTML = prefix + suffix;

        // Puhastame statistilised andmed.
        //localStorage.removeItem("guessed");
    },

    // Trükib välja, kui tihti mingit tähte valesti kirjutati.
    printLetters: function () {
        this.false_letters.letters.sort();
        false.letters.amounts = [];
        for( var obj in false_letters.letters){

        }
    }


    // Trükib välja, kui tihti mingi ajal mõõda pandi.
};


//HELPERS
function checkLocal(key){
    return JSON.parse(localStorage.getItem(key));
}


window.onload = function () {
    var statistics = new Statistics();
    window.statistics = statistics;
};