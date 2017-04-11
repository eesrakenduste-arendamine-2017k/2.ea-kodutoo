// Sõna objekt, millele paneme külge ka funktsioonid
function Word(word, canvas, ctx){

    this.word = word;

    // lisaks mis on sõnast järel, mida alguses hakkame hakkima ja pärast joonistame
    // esialgne sõna säilib, nt saab kasutada pärast skoori arvutamisel
	this.left = this.word;

    this.canvas = canvas;
    this.ctx = ctx;
}

Word.prototype = {
	Draw: function(){

		//Tühjendame canvase
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height);

		// Canvasele joonistamine
		this.ctx.textAlign = 'center';
		this.ctx.font = '70px Courier';

		// 	// Joonistame sõna, mis on järel / tekst, x, y
		this.ctx.fillText(this.left, this.canvas.width/2, this.canvas.height/2);
	},

	// Võtame sõnast esimese tähe maha
	removeFirstLetter: function(){

		// Võtame esimese tähe sõnast maha
		this.left = this.left.slice(1);
		//console.log(this.left);
	}
};


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
