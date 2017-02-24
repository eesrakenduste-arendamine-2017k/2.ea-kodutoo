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
                console.log('>>>>avaleht');
            }
        },
        'game-view': {
            'render': function() {
                // käivitame siis kui lehte laeme
                console.log('>>>>loend');

                var typerGame = new TYPER();
                window.typerGame = typerGame;
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


    // kui leht laetud käivitan Moosipurgi rakenduse
    window.onload = function() {
        var app = new game();
    };

})();
