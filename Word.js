// Sõna objekt, millele paneme külge ka funktsioonid
var timeFps=1800;
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
		timeFps-=1;
		var time=Math.round(timeFps/60);
	if(time>=0) {
		//Tühjendame canvase
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Canvasele joonistamine
		this.ctx.textAlign = 'center';
		this.ctx.fillStyle = textColor;
		this.ctx.font = wordSize+'px Courier';

		// 	// Joonistame sõna, mis on järel / tekst, x, y
		this.ctx.fillText(this.left, this.canvas.width / 2, this.canvas.height / 2);
		this.ctx.font ='70px Courier';
		this.ctx.fillText(time, this.canvas.width / 2, this.canvas.height / 8);
	}else{
		canvasId.addEventListener("click",function () {
			location.href="welcome.html";
		})

		//Tühjendame canvase
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Canvasele joonistamine
		this.ctx.textAlign = 'center';
		this.ctx.fillStyle = "red";
		this.ctx.font = '170px Courier';

		// 	// Joonistame sõna, mis on järel / tekst, x, y
		this.ctx.fillText("Mäng on läbi!!", this.canvas.width / 2, this.canvas.height / 2);
		this.ctx.fillStyle = "gray";
		this.ctx.font = '30px Courier';
		this.ctx.fillText("jatkamiseks klikka ekraanil", this.canvas.width / 2, this.canvas.height/1.005);
	}
},

	// Võtame sõnast esimese tähe maha
	removeFirstLetter: function(){

		// Võtame esimese tähe sõnast maha
		this.left = this.left.slice(1);
		//console.log(this.left);
	}
};
