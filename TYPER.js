var TYPER = function(){

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

    this.keypress_func = null;
    this.reset_func = null;
    this.words = []; // kõik sõnad
    this.word = null; // preagu arvamisel olev sõna
    this.word_min_length = 6;
    this.guessed_words = 0; // arvatud sõnade arv

    this.interval = null;
    this.timer = 0;
    this.sum = 0;
    this.players = [];
    //mängija objekt, hoiame nime ja skoori(+ trükivead, trükikiirus)
    this.player = {name: null, score: 0, errors: 0};
	this.dark = dark.checked;
    this.init();

};

TYPER.prototype = {

    // Funktsioon, mille käivitame alguses
    init: function(){
		 if(this.dark){
            var body = document.getElementsByTagName("BODY")[0];
            body.style.background = "black";
			body.style.color = "white";
        }
        // Lisame canvas elemendi ja contexti
        this.canvas = document.getElementsByTagName('canvas')[0];
        this.ctx = this.canvas.getContext('2d');
		

        // canvase laius ja kõrgus veebisirvija akna suuruseks (nii style, kui reso)
        this.canvas.style.width = this.WIDTH + 'px';
        this.canvas.style.height = this.HEIGHT + 'px';

        //resolutsioon
        // kui retina ekraan, siis võib ja peaks olema 2 korda suurem
        this.canvas.width = this.WIDTH;
        this.canvas.height = this.HEIGHT;
		
		this.img = new Image();
		this.img.src = 'goodjob.jpg';
        // laeme sõnad
        this.loadWords();
    },

    saveData: function(){
        //arvutab keskmise aja
        this.sum = 0;


        //ja salvestab localStorage'i
        this.players[this.players.length] = this.player;
        localStorage.setItem("players", JSON.stringify(this.players));
        console.log(this.player);

    },

    loadPlayerData: function(){

        // küsime mängija nime ja muudame objektis nime
        var p_name = prompt("Sisesta mängija nimi");

        // Kui ei kirjutanud nime või jättis tühjaks
        if(p_name === null || p_name === ""){
            p_name = "Tundmatu";
        }
        if(JSON.parse(localStorage.getItem('players')) === null){
            this.players = [];
        } else {
            this.players = JSON.parse(localStorage.getItem('players'));
        }
        this.hideElements();
        // Mängija objektis muudame nime
        this.player.name = p_name; // player =>>> {name:"Romil", score: 0}
        console.log(this.player);

    },

    hideElements: function(){
        var infoStyle = document.getElementById("info").style;
        var canvas = document.getElementById("canvas").style;
        infoStyle.display = "none";
        canvas.display = "block";
    },

    showElements: function(){
        var infoStyle = document.getElementById("info").style;
        var canvas = document.getElementById("canvas").style;
        infoStyle.display = "block";
        canvas.display = "none";
    },

    loadWords: function(){

        console.log('loading...');

        // AJAX http://www.w3schools.com/ajax/tryit.asp?filename=tryajax_first
        var xmlhttp = new XMLHttpRequest();

        // määran mis juhtub, kui saab vastuse
        xmlhttp.onreadystatechange = function(){

            //console.log(xmlhttp.readyState); //võib teoorias kõiki staatuseid eraldi käsitleda

            // Sai faili tervenisti kätte
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200){

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

                // küsime mängija andmed
                typerGame.loadPlayerData();

                // kõik sõnad olemas, alustame mänguga
                typerGame.start();
            }
        };

        xmlhttp.open('GET','./lemmad2013.txt',true);
        xmlhttp.send();
    },

    start: function(){

        // Tekitame sõna objekti Word
        this.generateWord();
        //joonista sõna
		if(this.dark){
			this.ctx.fillStyle = "white";
		} else {
			this.ctx.fillStyle = "black";
		}
			this.word.Draw();
		
        // Kuulame klahvivajutusi
        this.keypress_func = this.keyPressed.bind(this);
        window.addEventListener('keypress', this.keypress_func);
		timer = 0;
        var self = this;
        this.interval = window.setInterval(function(){ 
			self.timer += 1; 
			if(self.timer >= 15){
				self.drawEndScreen();
			}
		}, 1000);
    },
	
	drawEndScreen: function(){
		
		this.timer=0;
        this.saveData(this.player);
        window.removeEventListener('keypress', this.keypress_func);
        clearInterval(this.interval);
        table.players = this.players;
        table.toplist();
		
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height);
		
		this.ctx.textAlign = 'center';
		this.ctx.font = '40px Times New Roman';
		
		this.ctx.drawImage(this.img, this.canvas.width/2-250, this.canvas.height/2-300);
		if(!this.dark){
			this.ctx.fillStyle = "black";
		this.ctx.fillText("Sa olid tubli!", this.canvas.width/2, this.canvas.height/2);
		this.ctx.fillText("Skoor: "+this.player.score, this.canvas.width/2, this.canvas.height/2+50);
		this.ctx.fillText("Vigu: "+this.player.errors, this.canvas.width/2, this.canvas.height/2+100);
		this.ctx.fillText("Kliki ekraanil, et uuesti mängida.", this.canvas.width/2, this.canvas.height/2+150);
		} else {
			this.ctx.fillStyle = "White";
			this.ctx.fillText("Sa olid tubli!", this.canvas.width/2, this.canvas.height/2);
			this.ctx.fillText("Skoor: "+this.player.score, this.canvas.width/2, this.canvas.height/2+50);
			this.ctx.fillText("Vigu: "+this.player.errors, this.canvas.width/2, this.canvas.height/2+100);
			this.ctx.fillText("Kliki ekraanil, et uuesti mängida.", this.canvas.width/2, this.canvas.height/2+150);
		}
		var self = this;
		document.getElementById("canvas").addEventListener('click', function(){
			self.showElements();
			self.player = {name: null, score: 0, errors: 0};
			self.reset_func = self.reset.bind(self);
			document.getElementById("play").addEventListener('click', self.reset_func);
		});

    },

    generateWord: function(){
        console.log('generate');
        // kui pikk peab sõna tulema, + min pikkus + äraarvatud sõnade arvul jääk 5 jagamisel
        // iga viie sõna tagant suureneb sõna pikkus ühe võrra
        var generated_word_length =  this.word_min_length + parseInt(this.guessed_words/5);

        // Saan suvalise arvu vahemikus 0 - (massiivi pikkus -1)
        var random_index = (Math.random()*(this.words[generated_word_length].length-1)).toFixed();
		
        // random sõna, mille salvestame siia algseks
        var word = this.words[generated_word_length][random_index];

        // Word on defineeritud eraldi Word.js failis
        this.word = new Word(word, this.canvas, this.ctx);
        this.word.guessed_words = this.guessed_words;
        if (this.guessed_words > 0){
            this.word.first_word = false;
        }
		this.word.dark = this.dark;
    },
//test
    keyPressed: function(event){

        var letter = String.fromCharCode(event.which);
        //console.log(letter);
        // Võrdlen kas meie kirjutatud täht on sama mis järele jäänud sõna esimene

        if(letter === this.word.left.charAt(0)){

            // Võtame ühe tähe maha
            this.word.removeFirstLetter();

            // kas sõna sai otsa, kui jah - loosite uue sõna
            if(this.word.left.length === 0){

                this.guessed_words += 1;

                //update player score
                this.player.score = this.guessed_words;
                
                //loosin uue sõna
                this.generateWord();

            }
            //joonistan uuesti
            this.word.Draw();

        } else {
            this.player.errors += parseInt(1, 10);
			var body = document.getElementsByTagName("BODY")[0];
			if(this.dark){
                body.classList.add("errordark");
                window.setTimeout(function(){ body.classList.remove("errordark")}, 1000);
            }else{
                body.classList.add("error");
                window.setTimeout(function(){ body.classList.remove("error")}, 1000);
            }
        }
    }, // keypress end

    reset: function(){

        document.getElementById("play").removeEventListener("click", this.reset_func);
			this.dark = dark.selected;
        this.init()

    }
};


/* HELPERS */
function structureArrayByWordLength(words){
    // TEEN massiivi ümber, et oleksid jaotatud pikkuse järgi
    // NT this.words[3] on kõik kolmetähelised

    // defineerin ajutise massiivi, kus kõik on õiges jrk
    var temp_array = [];

    // Käime läbi kõik sõnad
    for(var i = 0; i < words.length; i++){

        var word_length = words[i].length;

        // Kui pole veel seda array'd olemas, tegu esimese just selle pikkusega sõnaga
        if(temp_array[word_length] === undefined){
            // Teen uue
            temp_array[word_length] = [];
        }

        // Lisan sõna juurde
        temp_array[word_length].push(words[i]);
    }

    return temp_array;

}



window.onload = function(){
	
	

    window.table = new Table();
    window.table.toplist();
    window.startGame = function(){
		 window.dark = document.querySelector("input[name=Dark]");
        window.typerGame = new TYPER();
    };
    document.getElementById("play").addEventListener("click", window.startGame);
};
