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
		this.ctx.clearRect( 0, 100, this.canvas.width, this.canvas.height);

		// Canvasele joonistamine
		

		// 	// Joonistame sõna, mis on järel / tekst, x, y
		this.ctx.fillText(this.left, this.canvas.width/2, this.canvas.height/2);
	},
	
	Timer: function(ctx, canvas){
		
		var time=10;
		
		
		setInterval(function(){ time -= 1; }, 1000);
		(function counter() {

			

			
			ctx.clearRect( 0, 0, 250, 250);
			
		/*
		    var o = Math.round, r = Math.random, s = 255;

			ctx.fillStyle = 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
			ctx.fillRect(500, 0,800,200);
		*/
			if(time>0){
				
				ctx.fillText(time, canvas.width*0.2, canvas.height*0.2);
	
		    	setTimeout(counter, 10);

			} else {
				
				//console.log("Timer läbi");
				if(typerGame.finishGame){return;}
				ctx.clearRect( 0, 0, canvas.width, canvas.height);	
				typerGame.finish(ctx, canvas);
				typerGame.scoreBoard();

			}

		})();
		
	},
	
	
	// Võtame sõnast esimese tähe maha
	removeFirstLetter: function(){

		// Võtame esimese tähe sõnast maha
		this.left = this.left.slice(1);
		//console.log(this.left);
		this.next=this.left.slice(0,1)
	}
};
