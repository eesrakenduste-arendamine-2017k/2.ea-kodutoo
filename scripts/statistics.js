"use strict"
function Statistics() {

    if (checkLocal("guessed") === null || checkLocal("letters") === null || checkLocal("timestamp") === null) {
        window.location.href = "index.html";
    }

    this.word_list = checkLocal("guessed");
    this.false_letters = checkLocal("letters");
    this.false_timestamps = checkLocal("timestamp");

    this.printWords();
    this.printLetters();
    this.printTimestamps();
}


Statistics.prototype = {

    // Trükib välja arvatud sõnad.
    printWords: function () {

        // Loeb sisse sõnad.
        var table = document.getElementById("guessed-table");

        // Trükib välja tabeli.
        var prefix = "<thead><tr><th>#</th><th>Sõnad</th></tr></thead><tbody>";
        var suffix = "";
        for (var j = 0; j < this.word_list.words.length; j++) {
            suffix += "<tr><td>" + (j + 1) + "</td><td>" + this.word_list.words[j] + "</td></tr>";
        }
        suffix += "</tbody>";
        table.innerHTML = prefix + suffix;

    },


    // Trükib välja, kui tihti mingit tähte valesti kirjutati.
    printLetters: function () {

        // Loeb sisse tähed.
        var letter_objects = checkLocal("letters").letters;
        var counts = {};

        // Loeb välja kui palju on korduvaid tähti.
        for (var i = 0; i < letter_objects.length; i++) {
            var num = letter_objects[i];
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }

        // Järiestab tähed järiekorda, suuremast väiksemani.
        var sorted_letter_order = Object.keys(counts).sort(function (a, b) {
            return counts[b] - counts[a]
        });

        // Prindib välja tabeli
        var table = document.getElementById("letter-table");
        var prefix = "<thead><tr><th>Täht</th><th>Veade arv</th></tr></thead><tbody>";
        var suffix = "";
        for (var j = 0; j < sorted_letter_order.length; j++) {
            suffix += "<tr><td>" + sorted_letter_order[j] + "</td><td>" + counts[sorted_letter_order[j]] + "</td></tr>";
        }
        suffix += "</tbody>";
        table.innerHTML = prefix + suffix;
    },


    // Trükib välja, kui tihti mingi ajal mõõda pandi.
    printTimestamps: function () {

        //Võtab sisse aja.
        var timestamp_objects = checkLocal("timestamp").time;
        var counts = {};

        // Loendab kui palju on korduvaid ajahetki kujul {aeg: arv, aeg2: arv2, ... : ...}
        for (var i = 0; i < timestamp_objects.length; i++) {
            var num = timestamp_objects[i];
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }

        // Sorteerib ära ajad suuremast väiksemani kujul [aeg, aeg2, aeg3, aeg4].
        var sorted_timestamp_order = Object.keys(counts).sort(function (a, b) {
            return counts[b] - counts[a]
        });

        // Prindib välja tabeli.
        var table = document.getElementById("time-table");
        var prefix = "<thead><tr><th>Aeg</th><th>Veade arv</th></tr></thead><tbody>";
        var suffix = "";
        for (var j = 0; j < sorted_timestamp_order.length; j++) {
            suffix += "<tr><td>" + sorted_timestamp_order[j] + ".00s" + "</td><td>" + counts[sorted_timestamp_order[j]] + "</td></tr>";
        }
        suffix += "</tbody>";
        table.innerHTML = prefix + suffix;
    }
};


//HELPERS
function checkLocal(key) {
    return JSON.parse(localStorage.getItem(key));
}


window.onload = function () {
    var statistics = new Statistics();
    window.statistics = statistics;
};