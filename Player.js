function Player() {
    this.player_object = this.initPlayerObject();  // Loob mängijate konteinerit kui veel pole tehtud, kui on siis laeb need sisse.
    this.player_list = this.getAllPlayerData();  // Sorteerib ära mängijad nende tulemuste järgi. Suurem->väiksem.
    this.printTable(this.player_list);
    document.getElementById("submit").addEventListener("click", this.addIntoStorage.bind(this));  // Nupuvajutusel salvestab mängija, alustab mängu.
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


    printTable: function (player_list) {
        if (JSON.parse(localStorage.getItem("player")) != null) {
            var table = document.getElementById("score-table");
            var prefix = "<thead><tr> <th>#</th> <th>Nimi</th> <th>Skoor</th></tr></thead><tbody>";
            var suffix = "";
            for (var j = 0; j < 10 && j < player_list.length; j++) {
                suffix += "<tr><td>" + (j + 1) + "</td><td>" + player_list[j].name + "</td> <td>" + player_list[j].score + "</td></tr>";
            }
            suffix += "</tbody>";
            table.innerHTML = prefix + suffix;
        }
    }
};


window.onload = function () {
    var player = new Player();
    window.player = player;
};