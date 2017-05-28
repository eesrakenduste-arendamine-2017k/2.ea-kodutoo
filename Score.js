function Score(score, canvas, ctx){
	
	this.score = score;
	
	this.canvas = canvas;
	this.ctx = ctx;
	
}

Score.prototype = {
	
	DrawScore: function(){

		//Tühjendame canvase
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height);

		// Canvasele joonistamine
		this.ctx.textAlign = 'center';
		this.ctx.font = '70px Courier';

		// 	// Joonistame sõna, mis on järel / tekst, x, y
		
	}
	
};