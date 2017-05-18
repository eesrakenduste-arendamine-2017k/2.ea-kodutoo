function Word(word, canvas, ctx){
    
	this.word = word;
	this.left = this.word
    this.canvas = canvas;
    this.ctx = ctx;
}

Word.prototype = {
	Draw: function(){	
 		var varWidth = this.canvas.width
		var varHeight = this.canvas.height
		this.ctx.clearRect( 0, 0, varWidth, varHeight);

		this.ctx.textAlign = 'center';
		this.ctx.font = '70px Courier';
		this.ctx.fillText(this.left, varWidth/2, varHeight/2);
	},

	removeFirstLetter: function(){

		this.left = this.left.slice(1);

	}
};
