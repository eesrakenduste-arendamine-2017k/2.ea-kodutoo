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
		this.ctx.font = '72px Courier';
    this.ctx.fillStyle="#000";
		// 	// Joonistame sõna, mis on järel / tekst, x, y
		this.ctx.fillText(this.left, this.canvas.width/2, this.canvas.height/2);
	},

	// Võtame sõnast esimese tähe maha
	removeFirstLetter: function(){
    this.firstLetter = this.left.slice(0, 1);
    console.log(this.firstLetter);
		// Võtame esimese tähe sõnast maha
		this.left = this.left.slice(1);

	}
};
