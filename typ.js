var clock = document.getElementById('timer_inp');
var gs = 0;
var pl_id = 0;
var pl_name = null;
var pl_mistake = 0;
var pl_avg_speed;
var arr = [];
var word = null;
var counter = 1;

var countTime = 0;

var top_stat = [];

function compare(a, b) {
    if (a.score > b.score)
        return -1;
    if (a.score < b.score)
        return 1;
    return 0;
}

function compareId(a, b) {
    if (a.id < b.id)
        return -1;
    if (a.id > b.id)
        return 1;
    return 0;
}

function getMaxId(arr) {
    var max = -99;
    arr.forEach(function (member) {
        if (member.id > max) {
            max = member.id;
            // console.log("Max now: " + max);
        }
    });
    return max;
}

var TYPER = function () {

    //singleton
    if (TYPER.instance_) {
        return TYPER.instance_;
    }
    TYPER.instance_ = this;

    // Muutujad
    this.WIDTH = window.innerWidth;
    this.HEIGHT = window.innerHeight;
    this.canvas = null;
    this.ctx = null;

    this.words = []; // kõik sõnad
    this.word = null; // preagu arvamisel olev sõna
    this.word_min_length = 3;
    this.guessed_words = 0; // arvatud sõnade arv
    this.miss = 0;

    //mängija objekt, hoiame nime ja skoori
    this.player = {
        id: 0,
        name: null,
        score: 0,
        mistake: 0,
        avg_speed: 0
    };

    //top10
    this.top_id = 0;
    this.top10 = [];

    this.routes = TYPER.routes;
    // saame lehe laadimiseks kasutada hiljem this.routes['home-view'].render()


    window.addEventListener('hashchange', this.routeChange.bind(this));

    // kui aadressireal ei ole hashi siis lisan juurde, et avaleht
    if (!window.location.hash) {
        window.location.hash = 'home-view';
        // routechange siin ei ole vaja sest käsitsi muutmine käivitab routechange event'i ikka
    } else {
        //esimesel käivitamisel vaatame urli üle ja uuendame menüüd
        this.routeChange();
    }

    // KÕIK muuutujad, mida muudetakse ja on rakendusega seotud defineeritakse siin
    this.click_count = 0;
    this.currentRoute = null;
    var p_name = null;
    this.init();
};
TYPER.routes = {
    'home-view': {
        'render': function () {
            // käivitame siis kui lehte laeme
            console.log('>>>>avaleht');
            document.querySelector('.list-group').style.display = 'block';
            document.querySelector('.loading').style.display = 'none';
            document.querySelector('.words').style.display = 'none';
            document.querySelector('#score').style.display = 'none';

        }
    },
    'list-view': {
        'render': function () {
            // käivitame siis kui lehte laeme
            console.log('>>>>loend');

            function locationHashChanged() {
                if (location.hash === "#home-view" || location.hash === "#stats-view") {
                    location.reload();
                }
            }

            window.onhashchange = locationHashChanged;

            // peidan loendi ja näitan loading...
            document.querySelector('.list-group').style.display = 'none';
            document.querySelector('.loading').style.display = 'block';
            document.querySelector('.words').style.display = 'none';
            document.querySelector('#score').style.display = 'none';


            //simulatsioon laeb kaua
            window.setTimeout(function () {

                // peidan loading... ja näitan loendit

                document.querySelector('.loading').style.display = 'none';
                document.querySelector('#score').style.display = 'block';
                document.querySelector('.words').style.display = 'block';

                function timer() {


                    clock.innerHTML--;
                    if (clock.innerHTML < 0) {
                        clock.innerHTML = 0;
                    }

                    if (clock.innerHTML <= 0) {
                        if (clock.innerHTML <= 0 && gs !== 0) {
                            pl_id += 1;
                            pl_avg_speed = countTime / gs;
                            pl_avg_speed = Math.round((pl_avg_speed) * 100) / 100;
                            var new_top = new Top(pl_id, pl_name, gs, pl_mistake, pl_avg_speed);
                            arr.push(new_top);
                            localStorage.setItem('top10', JSON.stringify(arr));
                            //console.log("Kokku secundid " + countTime);
                           // console.log("Kokku punktid " + gs);
                            //console.log("Average kiirus / per sona " + countTime / gs);


                        }
                        alert('GAME OVER');
                        clock.innerHTML = 10;
                        window.location.hash = 'home-view';

                        setTimeout(function () {
                        }, 1000);
                    } else {
                        setTimeout(timer, 1000);
                    }
                }

                setTimeout(timer, 1000);
            }, 2000);

        }
    }

};
TYPER.prototype = {

    // Funktsioon, mille käivitame alguses
    init: function () {

        // Lisame canvas elemendi ja contexti
        this.canvas = document.getElementsByTagName('canvas')[0];
        this.ctx = this.canvas.getContext('2d');

        // canvase laius ja kõrgus veebisirvija akna suuruseks (nii style, kui reso)
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';

        //resolutsioon
        // kui retina ekraan, siis võib ja peaks olema 2 korda suurem
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT - 200;

        // laeme sõnad
        this.loadWords();

        //kuulan aadressirea vahetust, ehk kui aadressireale tuleb #lehe nimi

        // Sort by score
        if (localStorage.top10) {

            this.top10 = JSON.parse(localStorage.top10);
            this.top10.sort(compare);
            arr = JSON.parse(localStorage.top10);
            arr.sort(compare);

            top_stat = JSON.parse(localStorage.top10);
            top_stat.sort(compareId);


           // console.log('laadisin localStorageist massiiivi ' + this.top10.id);

            // top 10 counter


            // Using some instead of forEach , because i want to show top10 scores
            this.top10.some(function (top) {
                var new_top = new Top(top.id, top.name, top.score, top.mistake, top.avg_speed);

                //    TYPER.instance_.top_id = top.id;

                var li = new_top.createHtmlElement();
                if (counter < 4) {
                    li.className = "list-group-item justify-content-between list-group-item-success"
                }
                else {
                    li.className = "list-group-item justify-content-between";
                }
                document.querySelector('.list-group').appendChild(li);

                if (counter == 10) {
                    return true;
                }
                counter += 1;
            });

            top_stat.some(function (top) {
                var new_top = new Top(top.id, top.name, top.score, top.mistake, top.avg_speed);

                var tr = new_top.createStatistic();

                document.querySelector('.table').appendChild(tr);

            });

            this.player.id = getMaxId(this.top10);
            pl_id = getMaxId(this.top10);
        } else {
            this.player.id = 0;
        }
    },

    loadPlayerData: function () {

        p_name = prompt("Sisesta mängija nimi");

        // Kui ei kirjutanud nime või jättis tühjaks
        if (p_name === null || p_name === "") {
            p_name = "Tundmatu";

        }

        // Mänigja objektis muudame nime
        this.player.name = p_name; // player =>>> {name:"Romil", score: 0}
        pl_name = this.player.name;


       // console.log(this.player);
    },

    loadWords: function () {

        console.log('loading...');

        // AJAX http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_first
        var xmlhttp = new XMLHttpRequest();

        // määran mis juhtub, kui saab vastuse
        xmlhttp.onreadystatechange = function () {

            //console.log(xmlhttp.readyState); //võib teoorias kõiki staatuseid eraldi käsitleda

            // Sai faili tervenisti kätte
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                console.log('successfully loaded');

                // serveri vastuse sisu
                var response = xmlhttp.responseText;
                //console.log(response);

                // tekitame massiivi, faili sisu aluseks, uue sõna algust märgib reavahetuse \n
                var words_from_file = response.split('\n');
                //console.log(words_from_file);

                // Kuna this viitab siin xmlhttp päringule siis tuleb läheneda läbi avaliku muutuja
                // ehk this.words asemel tuleb kasutada typerGame.words

                //asendan massiivi
                typerGame.words = structureArrayByWordLength(words_from_file);
              //  console.log(typerGame.words);

                // küsime mängija andmed
                typerGame.loadPlayerData();

                // kõik sõnad olemas, alustame mänguga
                typerGame.start();
            }
        };

        xmlhttp.open('GET', './lemmad2013.txt', true);
        xmlhttp.send();
    },

    start: function () {

        // Tekitame sõna objekti Word
        this.generateWord();
        //console.log(this.word);

        //joonista sõna
        this.word.Draw();

        // Kuulame klahvivajutusi

        window.addEventListener('keypress', this.keyPressed.bind(this));

    },

    generateWord: function () {

        // kui pikk peab sõna tulema, + min pikkus + äraarvatud sõnade arvul jääk 5 jagamisel
        // iga viie sõna tagant suureneb sõna pikkus ühe võrra
        var generated_word_length = this.word_min_length + parseInt(this.guessed_words / 5);

        // Saan suvalise arvu vahemikus 0 - (massiivi pikkus -1)
        var random_index = (Math.random() * (this.words[generated_word_length].length - 1)).toFixed();

        // random sõna, mille salvestame siia algseks
        word = this.words[generated_word_length][random_index];

        // Word on defineeritud eraldi Word.js failis
        this.word = new Word(word, this.canvas, this.ctx);

        start = new Date().getTime() / 1000;

    },

    keyPressed: function (event) {


        if (location.hash === "#list-view") {

            //console.log(this.player.id);
            // event.which annab koodi ja fromcharcode tagastab tähe
            var letter = String.fromCharCode(event.which);

            // Võrdlen kas meie kirjutatud täht on sama mis järele jäänud sõna esimene

         //   console.log(word.length);

            if (letter === this.word.left.charAt(0)) {

                // Võtame ühe tähe maha
                this.word.removeFirstLetter();
            }

            else {
                this.miss += 1;

               // console.log("MISTAKE " + this.miss);
                // blink
                document.body.style.background = "red";
                window.setTimeout(function () {
                    document.body.style.background = "white";
                }, 100);

                // - 5 sekundid
                clock.innerHTML = clock.innerHTML - 5;

                if (clock.innerHTML < 0) {
                    clock.innerHTML = 0;
                }
                this.player.mistake = this.miss;
                pl_mistake = this.miss;
            }
            // kas sõna sai otsa, kui jah - loosite uue sõna

            if (this.word.left.length === 0) {

                this.guessed_words += 1;

                if (word.length === 3) {
                    clock.innerHTML++;
                } else if (word.length === 4) {
                    clock.innerHTML = parseInt(clock.innerHTML) + 2;
                } else {
                    clock.innerHTML = parseInt(clock.innerHTML) + 4;
                }


                //update player score
                this.player.score = this.guessed_words;
                gs = this.guessed_words;
                document.getElementById('score').innerHTML = "Punktid: " + this.player.score;

             //   console.log(JSON.stringify(this.top10));

                var elapsed = new Date().getTime() / 1000 - start;
                elapsed = Math.round((elapsed) * 100) / 100;
               // console.log(elapsed);

                countTime += elapsed;

                this.generateWord();
            }


            //joonistan uuesti
            this.word.Draw();

        }
    }, // keypress end
    routeChange: function (event) {

        //kirjutan muuutujasse lehe nime, võtan maha #
        this.currentRoute = location.hash.slice(1);
        console.log(this.currentRoute);

        //kas meil on selline leht olemas?
        if (this.routes[this.currentRoute]) {

            //muudan menüü lingi aktiivseks
            this.updateMenu();

            this.routes[this.currentRoute].render();


        } else {
            /// 404 - ei olnud
        }


    },

    updateMenu: function () {
        //http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
        //1) võtan maha aktiivse menüülingi kui on
        document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');

        //2) lisan uuele juurde
        //console.log(location.hash);
        document.querySelector('.' + this.currentRoute).className += ' active-menu';

    }

};

var Top = function (top_id, top_name, top_score, top_mistake, top_avg_speed) {
    this.id = top_id;
    this.name = top_name;
    this.score = top_score;
    this.mistake = top_mistake;
    this.avg_speed = top_avg_speed;
  //  console.log(this);
};

Top.prototype = {
    createHtmlElement: function () {


        var li = document.createElement('li');

        var span_with_content = document.createElement('span');
        span_with_content.className = 'content';

        var sc = document.createElement('span');
        sc.className = " badge badge-default badge-pill";

        var content = document.createTextNode(counter + ".  " + this.name);
        var c = document.createTextNode(this.score);

        span_with_content.appendChild(content);

        sc.appendChild(c)

        li.appendChild(span_with_content);
        li.appendChild(sc);

        return li;
    },

    createStatistic: function () {
        var tr = document.createElement('tr');

        var tdId = document.createElement('td');
        var tdName = document.createElement('td');
        var tdScore = document.createElement('td');
        var tdMistake = document.createElement('td');
        var tdAvg = document.createElement('td');

        var contentId = document.createTextNode(this.id);
        var contentName = document.createTextNode(this.name);
        var contentScore = document.createTextNode(this.score);
        var contentMistake = document.createTextNode(this.mistake);
        var contentAvg = document.createTextNode(this.avg_speed);

        tdId.appendChild(contentId);
        tr.appendChild(tdId);

        tdName.appendChild(contentName);
        tr.appendChild(tdName);

        tdScore.appendChild(contentScore);
        tr.appendChild(tdScore);

        tdMistake.appendChild(contentMistake);
        tr.appendChild(tdMistake);

        tdAvg.appendChild(contentAvg);
        tr.appendChild(tdAvg);


        return tr;
    }
};


/* HELPERS */
function structureArrayByWordLength(words) {
    // TEEN massiivi ümber, et oleksid jaotatud pikkuse järgi
    // NT this.words[3] on kõik kolmetähelised

    // defineerin ajutise massiivi, kus kõik on õiges jrk
    var temp_array = [];

    // Käime läbi kõik sõnad
    for (var i = 0; i < words.length; i++) {

        var word_length = words[i].length;

        // Kui pole veel seda array'd olemas, tegu esimese just selle pikkusega sõnaga
        if (temp_array[word_length] === undefined) {
            // Teen uue
            temp_array[word_length] = [];
        }

        // Lisan sõna juurde
        temp_array[word_length].push(words[i]);
    }

    return temp_array;
}
window.onload = function () {
    var typerGame = new TYPER();
    window.typerGame = typerGame;
};
