// Sõna objekt, millele paneme külge ka funktsioonid
function Word(word, canvas, ctx){

    this.word = word;
    this.size = 70;
    this.letters = [];


    // lisaks mis on sõnast järel, mida alguses hakkame hakkima ja pärast joonistame
    // esialgne sõna säilib, nt saab kasutada pärast skoori arvutamisel
	this.left = this.word;

    this.canvas = canvas;
    this.ctx = ctx;

    var x = this.canvas.width/2;
    var y = this.canvas.height/2;
    x = x - this.left.length*40/2;

    for(var i = 0; i < this.left.length; i++){
        this.letters.push({
            letter: this.left[i],
            x: x,
            y: y,
            guessed: false
        });
        x = x + 40;
    }
    console.log(this.letters);

}

Word.prototype = {
	Draw: function(){
        this.size -= 0.2;

        if(this.size < 5){
            alert('mäng läbi');
        }

		//Tühjendame canvase
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height);

		// Canvasele joonistamine
		this.ctx.textAlign = 'center';
		this.ctx.font = this.size+'px Courier';

		// 	// Joonistame sõna, mis on järel / tekst, x, y
		//this.ctx.fillText(this.left, this.canvas.width/2, this.canvas.height/2);

		//parandan x koordinaadi õigeks
		// nihutan poole sõna võrra vasakule
		// üks täht on 35


		//iga tähe trükin eraldi
		for(var i = 0; i < this.letters.length; i++){

            var l = this.letters[i];
        
			this.ctx.fillStyle = "rgb(0,0,0)";
			this.ctx.fillText(l.letter, l.x+(30+Math.random()*50), l.y+(30+Math.random()*50));
		}



	},

	// Võtame sõnast esimese tähe maha
	removeFirstLetter: function(){

		// Võtame esimese tähe sõnast maha
		this.left = this.left.slice(1);
		//console.log(this.left);
		/* TODO */
		// Märgi iga kord this.letters massiivis õige täht ära arvatuks
	}
};
