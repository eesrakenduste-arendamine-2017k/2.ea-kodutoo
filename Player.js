function Player() {


    this.player_object = this.initPlayerObject();
    this.sorted_players = this.getAllPlayerData();
    document.getElementById("submit").addEventListener("click", this.addIntoStorage.bind(this));
}

Player.prototype = {

    // Loob tühja mängijate objekti kui ühtegi pole, kui on olemas siis laeb selle.
    // Mängijate objekt on kujul: {players: [ {mängija1}, {mängija2}, ...} ]
    // localStorage.getItem() tagastab null kui sellist kirjet ei leitud.
    initPlayerObject: function () {
        var player_object = {};

        if (JSON.parse(localStorage.getItem("player")) == null) {
            player_object = {players: []};
        } else {
            player_object = JSON.parse(localStorage.getItem("player"));
        }

        return player_object;
    },


    // Võtab Local-Storagest kõik mängijad ja tagastab kujul [ {obj1}, {obj2}, {obj3} ]
    getAllPlayerData: function () {
        var player_data = JSON.parse(localStorage.getItem("player"));
        if (player_data != null) {
            player_data = player_data.players.sort(function (a, b) {
                return b.score - a.score;
            });
        }

        return player_data;
    },


    // Loeb sisse HTML'i kirjutatud nime, kui pole siis nimeks Tundmatu ja alustab mängu.
    addIntoStorage: function () {
        var player_name = document.getElementById("name-area").value;

        if (player_name == "" || player_name == null) {
            player_name = "Tundmatu";
        }

        var player_helper = {name: player_name, score: 0}; // Loome abiobjekti mida sisse lükata.
        this.player_object.players.push(player_helper); // Lükkame abiobjekti, MÄNGIJATE listi.
        localStorage.setItem('player', JSON.stringify(this.player_object)); // Salvestame MÄNGIJATE listi local-storage'sse.

        window.location.href = "typer.html"; // Alustame mängu.
    },

    printTable: function (sorted_players) {
        var table = document.getElementById("score-table");
        table.innerHTML = ""
    }
};

window.onload = function () {
    var player = new Player();
    window.player = player;
};