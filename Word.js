// Sõna objekt, millele paneme külge ka funktsioonid
function Word(word, canvas, ctx, score) {

	this.word = word;


    // Lisaks mis on sõnast järel, mida alguses hakkame hakkima ja pärast joonistame
    // Esialgne sõna säilib, nt saab kasutada pärast skoori arvutamisel
	this.left = this.word;

	this.canvas = canvas;
	this.ctx = ctx;
}


Word.prototype = {
    Draw: function (score) {

        // Tühjendame canvase
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Canvasele joonistamine
		this.ctx.textAlign = 'center';
		this.ctx.font = '70px Courier';

        // Joonistame sõna, mis on järel / tekst, x, y
		this.ctx.fillText(this.left, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText(score, this.canvas.width * 0.90, this.canvas.height * 0.1);
	},


    // Võtame sõnast esimese tähe maha
	removeFirstLetter: function() {

		// Võtame esimese tähe sõnast maha
		this.left = this.left.slice(1);
		//console.log(this.left);
	}
};
