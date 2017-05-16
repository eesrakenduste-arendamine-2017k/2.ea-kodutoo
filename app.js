(function() {
    "use strict";

    var game = function() {

        // SEE ON SINGLETON PATTERN
        if (game.instance) {
            return game.instance;
        }
        //this viitab game fn
        game.instance = this;

        this.routes = game.routes;
        // saame lehe laadimiseks kasutada hiljem this.routes['home-view'].render()

        // KÕIK muuutujad, mida muudetakse ja on rakendusega seotud defineeritakse siin
        this.currentRoute = null;



        // Kui tahan Moosipurgile referenci siis kasutan THIS = MOOSIPURGI RAKENDUS ISE
        this.init();
    };

    // kõik lehed, teistes raamistikes võib käsitleda neid view'dena
    // render funktsioon käivtatakse selle konkreetse lehe laadimisel
    game.routes = {
        'home-view': {
            'render': function() {
                // käivitame siis kui lehte laeme
                document.getElementById('home-view').style.visibility = 'visible';
                document.getElementById('game-view').style.visibility = 'hidden';
                document.getElementById('end-view').style.visibility = 'hidden';
                document.getElementById('statistics-view').style.visibility = 'hidden';

                console.log('>>>>avaleht');
                // ls
                // parser
                // innerhtml = ''
                // forEach
                //   li
            }
        },
        'game-view': {
            'render': function() {
                // käivitame siis kui lehte laeme
                document.getElementById('home-view').style.visibility = 'hidden';
                document.getElementById('game-view').style.visibility = 'visible';
                document.getElementById('end-view').style.visibility = 'hidden';
                document.getElementById('statistics-view').style.visibility = 'hidden';



                console.log('>>>>loend');
                var typerGame = new TYPER();
                window.typerGame = typerGame;
              }
        },
        'end-view':{
          'render': function(){
            document.getElementById('home-view').style.visibility = 'hidden';
            document.getElementById('game-view').style.visibility = 'hidden';
            document.getElementById('end-view').style.visibility = 'visible';
            document.getElementById('statistics-view').style.visibility = 'hidden';
            document.querySelector('.scoreBoard').style.display = 'block';

            console.log(">>>>game_end");
          }
        },
        'statistics-view':{
          'render': function(){
            document.getElementById('home-view').style.visibility = 'hidden';
            document.getElementById('game-view').style.visibility = 'hidden';
            document.getElementById('end-view').style.visibility = 'hidden';
            document.getElementById('statistics-view').style.visibility = 'visible';


            console.log(">>>>game_end");
          }
        },
    };

    // Kõik funktsioonid lähevad Moosipurgi külge
    game.prototype = {

        init: function() {
            console.log('Rakendus läks tööle');

            //kuulan aadressirea vahetust, ehk kui aadressireale tuleb #lehe nimi
            window.addEventListener('hashchange', this.routeChange.bind(this));

            // kui aadressireal ei ole hashi siis lisan juurde, et avaleht
            if (!window.location.hash) {
                window.location.hash = 'home-view';
                // routechange siin ei ole vaja sest käsitsi muutmine käivitab routechange event'i ikka
            } else {
                //esimesel käivitamisel vaatame urli üle ja uuendame menüüd
                this.routeChange();
            }

            if(localStorage.playerName){
                //võtan stringi ja teen tagasi objektideks
                this.players = JSON.parse(localStorage.playerName);
                console.log('laadisin localStorageist massiiivi ' + this.players.length);

                //sorteerime scoreBoard
                var numbers = [];
                var len = this.players.length;

                for(var j = 0; j < len; j++){
                  numbers.push([this.players[j].score, j, this.players[j].name]);
                  // console.log(numbers);
                }
                numbers.sort(sortNumbers);
                numbers.reverse();
                // console.log(numbers);

                for(var i = 0; i < 10; i++){
                    // console.log(this.players[i]);
                    var tr = document.createElement('tr');
                    var th = document.createElement('th');
                    var th2 = document.createElement('th');
                    var th3 = document.createElement('th');

                    var place = i+1;
                    th.append(place);
                    var Pname = numbers[i][2];
                    // console.log(Pname);
                    th2.append(Pname);

                    var Pscore = numbers[i][0];
                    th3.append(Pscore);

                    tr.appendChild(th);
                    tr.appendChild(th2);
                    tr.appendChild(th3);


                    document.querySelector('.scoreBoard').appendChild(tr);

                    // console.log(tr);
                  }

                  for(var ii = 0; ii < this.players.length; ii++){
                      // console.log(this.players[i]);
                      var trr = document.createElement('tr');
                      var thh = document.createElement('th');
                      var th2h = document.createElement('th');
                      var th3h = document.createElement('th');

                      var placee = ii+1;
                      thh.append(placee);
                      var Pnamee = numbers[ii][2];
                      // console.log(Pname);
                      th2h.append(Pnamee);

                      var Pscoree = numbers[ii][0];
                      th3h.append(Pscoree);

                      trr.appendChild(thh);
                      trr.appendChild(th2h);
                      trr.appendChild(th3h);


                      document.querySelector('.statistics').appendChild(trr);

                      // console.log(tr);
                    }

                }


        },


        routeChange: function(event) {

            //kirjutan muuutujasse lehe nime, võtan maha #
            this.currentRoute = location.hash.slice(1);
            console.log(this.currentRoute);

            //kas meil on selline leht olemas?
            if (this.routes[this.currentRoute]) {

                //muudan menüü lingi aktiivseks

                this.routes[this.currentRoute].render();


            } else {
                /// 404 - ei olnud
            }


        },

    }; // MOOSIPURGI LÕPP
    var Player = function(new_name, new_score){
        this.name = new_name;
        this.score = new_score;
        console.log('created new jar');
        console.log(this);
    };

    function sortNumbers(a, b) {
        if (a[0] === b[0]) {
            return 0;
        }
        else {
            return (a[0] < b[0]) ? -1 : 1;
        }
    }

    // kui leht laetud käivitan Moosipurgi rakenduse

    window.onload = function() {
        var app = new game();
    };

})();
