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
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Canvasele joonistamine
		this.ctx.textAlign = 'center';
		this.ctx.font = '70px Courier';

		// 	// Joonistame sõna, mis on järel / tekst, x, y
		this.ctx.fillText(this.left, this.canvas.width/2, this.canvas.height/2);
	},
	
	Countdown: function(ctx, canvas){
		
		var time=60;
		
		setInterval(function(){
			
			time -= 1;
			
		}, 1000);
		
		(function counter(){
			
			
			ctx.clearRect(this.canvas.width*0.0, this.canvas.height*0.0, this.canvas.width*0.2, this.canvas.height*0.2);
			
			if(time>0){ //kui aega on
				
				ctx.fillText(time, canvas.width*0.15, canvas.height*0.2);
				
				setTimeout(counter, 10);
				
			}else{ //kui aega ei ole
				
				if(typerGame.finishGame){return;}
				ctx.clearRect(0,0, canvas.width, canvas.height); //canvas nulli?
				typerGame.finish(ctx, canvas);
				typerGame.hiScore();
				
			}
			
		})();
		
	},

	// Võtame sõnast esimese tähe maha
	removeFirstLetter: function(){

		// Võtame esimese tähe sõnast maha
		this.left = this.left.slice(1);
		//console.log(this.left);
	}
	

	
};

