//aitah richard kajaste ja ege-rita noor kelle eeskujul sai local soragisse salvestamine ja tabeli kuju

function Table(){
    this.players = JSON.parse(localStorage.getItem('players'));
}

Table.prototype = {

    toplist: function(){

        //var top = document.getElementById("toplist");
        var topbody = document.getElementById("toplist");
        //topbody.innerHTML = "";
        if(this.players !== null){
            var top10 = this.players.sort(function(a, b) { return a.score < b.score ? 1 : -1; })
                .slice(0, 10);
            var j = 0;
            top10.forEach(function(player){
                j++;
                var row = topbody.insertRow(topbody.rows.length);
                var i = 0;
                var cell = row.insertCell(i);
                var text = document.createTextNode(j.toString());
                cell.appendChild(text);
                i++;
                for(var attribute in player){
                    if(i <= 4){
                        cell = row.insertCell(i);
                        text = document.createTextNode(player[attribute]);
                        cell.appendChild(text);
                    }
                    i++;
                }
            });
        }



    }

};