function Table(){
    this.navbar = document.getElementById('navbar');
    this.navbar.addEventListener('click', this.statistics);
    this.top = document.getElementById('top');
    this.players = null;
}

Table.prototype = {

    statistics: function(){
        this.players = JSON.parse(localStorage.getItem('players'));
        var stats = document.getElementById('statistics');
        var statsbody = stats.getElementsByTagName("TBODY")[0];
        statsbody.innerHTML = "";
        if(stats.style.display === "block"){
            stats.style.display = "none";
        } else {
            stats.style.display = "block"
        }
        this.players.forEach(function(player){
            var row = statsbody.insertRow(statsbody.rows.length);
            var i = 0;
            for(var attribute in player){
                var cell = row.insertCell(i);
                var text = document.createTextNode(player[attribute]);
                cell.appendChild(text);
                i++;
            }
        });

    },

    toplist: function(){

    }

};