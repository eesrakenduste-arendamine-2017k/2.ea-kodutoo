function Player(){
    this.player_object = {name: "", score: 0};
    document.getElementById("submit").addEventListener("click", this.addIntoStorage.bind(this));
}

Player.prototype = {

  addIntoStorage: function () {
      var player_name = document.getElementById("name-area").value;

      if(player_name == "" || player_name == null){
          this.player_object.name = "Tundmatu";
      }else{
          this.player_object.name = player_name;
      }
      localStorage.setItem('player', JSON.stringify(this.player_object));
      window.location.href = "typer.html";
  }



};

window.onload = function(){
    var player = new Player();
};