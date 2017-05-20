function Player(){

    // Kui LocalStoragis pole midagi, tekitame uue listi, kui on midagi siis laeme selle sisse.
    if (JSON.parse(localStorage.getItem("player")) == null) {
        this.player_object = {players: []}; // MÄNGIJATE LIST, hojab endas mitme mängija objektid.
    } else {
        this.player_object = JSON.parse(localStorage.getItem("player"));
    }

    document.getElementById("submit").addEventListener("click", this.addIntoStorage.bind(this));
}

Player.prototype = {

  addIntoStorage: function () {
      var player_name = document.getElementById("name-area").value;

      if (player_name == "" || player_name == null) {
          player_name = "Tundmatu";
      }

      var player_helper = {name: player_name, score: 0}; // Loome abiobjekti mida sisse lükata.
      this.player_object.players.push(player_helper); // Lükkame abiobjekti, MÄNGIJATE listi.
      localStorage.setItem('player', JSON.stringify(this.player_object)); // Salvestame MÄNGIJATE listi local-storage'sse.

      window.location.href = "typer.html"; // Alustame mängu.
  }



};

window.onload = function(){
    var player = new Player();
};