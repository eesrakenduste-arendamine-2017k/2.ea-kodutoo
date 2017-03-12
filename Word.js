// Sõna objekt, millele paneme külge ka funktsioonid
function Word(word, canvas, ctx, guessed_letters, guessed_words,e){

    this.word = word;
    
    // lisaks mis on sõnast järel, mida al guses hakkame hakkima ja pärast joonistame
    // esialgne sõna säilib, nt saab kasutada pärast skoori arvutamisel 
	this.left = this.word;
	//this.score = score;
    this.canvas = canvas;
    this.ctx = ctx;
    this.guessed_letters = guessed_letters;
    this.ctx.fillStyle = 'white';
    this.guessed_words = guessed_words;
    this.e = e;
}

Word.prototype = {
	Draw: function(){

		//Tühjendame canvase
		this.ctx.clearRect( this.canvas.width*0.25, this.canvas.height*0.25, this.canvas.width, this.canvas.height*0.50);

		// Canvasele joonistamine

		this.ctx.textAlign = 'center';
		this.ctx.font = '100px Courier';

		// 	// Joonistame sõna, mis on järel / tekst, x, y
		this.ctx.fillText(this.left, this.canvas.width/2, this.canvas.height/2);
		
	},


	Draw2: function(ctx, canvas){

		var  x= 31;

		(function lugeja() {

			x -= 1;
			ctx.clearRect( 0, 0, 250, 250);
			ctx.font = '100px Courier';
			ctx.fillStyle = 'white';
			ctx.fillText(x, 100, 100);

			if(x>0){

		    	setTimeout(lugeja, 1000);

			} else {

				ctx.clearRect( 0, 0, canvas.width, canvas.height);
				typerGame.finish(ctx, canvas);

			}

		})();

	},



	drawScore: function(score){

		this.ctx.font = '100px Courier';
		this.ctx.fillStyle = 'white';
		this.score = score;
		this.ctx.clearRect(0, this.canvas.height*0.8, this.canvas.width, this.canvas.height*0.2);
		this.ctx.fillText(this.score, this.canvas.width*0.9, this.canvas.height*0.9);
		this.ctx.fillText("skoor:", this.canvas.width*0.75, this.canvas.height*0.9);


	},	
	// Võtame sõnast esimese tähe maha
	paintFirstLetter: function(){


		var test = this.ctx;
		var test2 = this.canvas;
		var test3 = this.left;


		this.left = this.left.slice(1);
		/*
		this.left = this.left.substring(0,1).ctx.strokeStyle = "Green"
		+ this.left.substring(1,3);
		*/
		//this.ctx.arvatudOsa.fillStyle = '#90EE90';
		//this.left = arvatudOsa + this.left.substring(1,3);
		//this.left = this.left.substring(this.guessed_letters, this.left.length);

		//this.ctx.fillStyle = 'lightgreen';

		/*ctx.strokeStyle = "Grey";
		"<span style='color: #00e676'>"
        + this.left.innerHTML.substr(0, 1)
        + "</span>"
        + html.substr(1, html.length);
        */
		//console.log(this.left);
		/*
		if(cL === this.word.left.length){
			return;
		}
		*/
	}
};
