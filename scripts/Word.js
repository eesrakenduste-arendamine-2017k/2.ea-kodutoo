// Sõna objekt, millele paneme külge ka funktsioonid
function Word(word, canvas, ctx) {

    this.word = word;
    // Lisaks mis on sõnast järel, mida alguses hakkame hakkima ja pärast joonistame
    // Esialgne sõna säilib, nt saab kasutada pärast skoori arvutamisel
    this.left = this.word;

    this.canvas = canvas;
    this.ctx = ctx;
}


Word.prototype = {
    Draw: function (score, color, time) {

        // Tühjendame canvase
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Canvasele joonistamine
        this.setContext(color);

        // Joonistame sõna, mis on järel / tekst, x, y
        this.ctx.fillText(this.left, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText(score, this.canvas.width * 0.90, this.canvas.height * 0.1);
        this.ctx.fillText("aeg: " + time, this.canvas.width * 0.15, this.canvas.height * 0.1);
    },


    // Võtame sõnast esimese tähe maha
    removeFirstLetter: function () {

        // Võtame esimese tähe sõnast maha
        this.left = this.left.slice(1);
        //console.log(this.left);
    },

    setContext: function (color) {
        this.ctx.textAlign = 'center';
        this.ctx.font = '70px Courier';

        if (color === "white") {
            this.canvas.style.backgroundColor = "white";
            this.ctx.fillStyle = "black";
        } else {
            this.canvas.style.backgroundColor = "black";
            this.ctx.fillStyle = "white";
        }
    }
};
