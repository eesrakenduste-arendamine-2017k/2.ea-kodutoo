var timeCount = 0;
var gameFinished = 0;
// Sõna objekt, millele paneme külge ka funktsioonid
function Word(word, canvas, ctx) {

    this.word = word;

    // lisaks mis on sõnast järel, mida alguses hakkame hakkima ja pärast joonistame
    // esialgne sõna säilib, nt saab kasutada pärast skoori arvutamisel
    this.left = this.word;

    this.canvas = canvas;
    this.ctx = ctx;
    this.gameGuessedWords = 0;
    this.gameFinished = 0;
    // this.showTime;

}

if (timeCount != 1) {
    time = 180;
    timeCount = 1;
}

Word.prototype = {
    Draw: function() {
    if (time > 0) {
        this.showTime = Math.round(time/60);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Canvasele joonistamine
        this.ctx.textAlign = 'center';
        this.ctx.font = 'bolder 70px Courier';
        this.ctx.fillStyle = '#7CFC00';

        // 	// Joonistame sõna, mis on järel / tekst, x, y
        this.ctx.fillText(this.left, this.canvas.width / 2, this.canvas.height / 2);

        time-=1;
        this.showTime= Math.round(time/60);
    }
        //Tühjendame canvase


         if(time<=0) {
             this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

             // Canvasele joonistamine
             this.ctx.textAlign = 'center';
             this.ctx.font = 'bolder 70px Courier';
             this.ctx.fillStyle = '#7CFC00';

             // 	// Joonistame sõna, mis on järel / tekst, x, y
             this.ctx.fillText("Aeg sai otsa!", this.canvas.width / 2, this.canvas.height / 2);
             gameFinished = 1;
         } else if (this.showTime>0) {
             this.ctx.font = 'bold 25px Courier';
             this.ctx.fillText("Aega veel: " + this.showTime + " sekundit", this.canvas.width / 8, this.canvas.height / 13);
         }
    },

    // Võtame sõnast esimese tähe maha
    removeFirstLetter: function() {

        // Võtame esimese tähe sõnast maha
        this.left = this.left.slice(1);
        //console.log(this.left);
    }
};
