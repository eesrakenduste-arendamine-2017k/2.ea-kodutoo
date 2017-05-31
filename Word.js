// Sõna objekt, millele paneme külge ka funktsioonid
function Word(word, canvas, ctx){

    this.word = word;
    this.i = 0;
    // lisaks mis on sõnast järel, mida alguses hakkame hakkima ja pärast joonistame
    // esialgne sõna säilib, nt saab kasutada pärast skoori arvutamisel 
	this.left = this.word;
    this.dark = null;
    this.hard = null;
    this.letters = [];
    this.first_word = true;
    this.canvas = canvas;
    this.ctx = ctx;
    this.guessed_words = null;
    this.word_amount = null;
}

Word.prototype = {
	Draw: function() {

        //Tühjendame canvase
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if(this.hard){
            if(this.first_word){
                this.ctx.translate(this.canvas.width + 65, -3);
                this.ctx.scale(-1, 1);
                this.first_word = false;
            }
        } else {
            this.ctx.textAlign = 'center';
        }
        // Canvasele joonistamine
        this.ctx.font = '70px Raleway, sans-serif';
        if (this.dark){
            this.ctx.fillStyle = "white";
        } else{
            this.ctx.fillStyle = "black";
        }
		// 	// Joonistame sõna, mis on järel / tekst, x, y
		this.ctx.fillText(this.left, this.canvas.width/2, this.canvas.height/2);
        this.ctx.font = '40px Raleway, sans-serif';
        this.ctx.fillText(this.guessed_words + "/" + this.word_amount,
            this.canvas.width/2 + 950, 80);
	},

	// Võtame sõnast esimese tähe maha
	removeFirstLetter: function(){

		// Võtame esimese tähe sõnast maha
		this.left = this.left.slice(1);
        this.changeNextLetter();
		//console.log(this.left);
	},
	changeNextLetter: function(){
        this.i++;

        var letter = this.word.slice(this.i-1, this.i)
        this.letters[this.i-1] = letter;
        var coloredWord = this.letters.join("");
        //this.ctx.fillStyle = "#ff0000";
        //this.ctx.fillText(coloredWord, this.canvas.width/2, this.canvas.height/3);
        this.ctx.fillText(this.left, this.canvas.width/2, this.canvas.height/3);
    }
};
