function Table(){
    this.navbar = document.getElementById('navbar');
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
        this.players = JSON.parse(localStorage.getItem('players'));
        var top = document.getElementById("toplist");
        var topbody = top.getElementsByTagName("TBODY")[0];
        topbody.innerHtml = "";
        var top10 = [];
        var maxplayer;
        for(var j = 0; j < this.players.length; j++){
            var max = 0;
            for(var i = 0; i < this.players.length; i++){
                if(this.players[i] > max){
                    max = this.players[i]['score'];
                    maxplayer = this.players[i];
                }
            }
            top10.push(maxplayer);
            var index = this.players.indexOf(maxplayer);
            this.players.splice(index, 1);
        }

        top10.forEach(function(player){

            var row = topbody.insertRow(topbody.rows.length);
            var i = 0;
            for(var attribute in player){
                if(i <= 1){
                    var cell = row.inserCell(i);
                    var text = document.createTextNode(player[attribute]);
                    cell.appendChild(text);
                }
                i++;
            }
        })
    }

};