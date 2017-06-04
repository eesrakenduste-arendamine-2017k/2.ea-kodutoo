function Word(word, canvas, ctx){
    this.word = word;
    this.size = 70;
    this.letters = [];
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
}

Word.prototype = {
	Draw: function(){
        this.size -= 0.4;

        if(this.size < 5){
			var oldTotalWordsGuessed = JSON.parse(localStorage.getItem('totalWordsGuessed'));
			var newTotalWordsGuessed = oldTotalWordsGuessed + typerGame.player.score;
			localStorage.setItem('totalWordsGuessed', newTotalWordsGuessed);
			
			var oldTotalTypos = JSON.parse(localStorage.getItem('totalTypos'));
			var newTotalTypos = oldTotalTypos + typerGame.typo;
			localStorage.setItem('totalTypos', newTotalTypos);
			
			var oldPlayers = JSON.parse(localStorage.getItem('Scores')) || [];
			var newPlayer = {name: typerGame.player.name, score: typerGame.player.score};
			
			oldPlayers.push(newPlayer);
			localStorage.setItem('Scores', JSON.stringify(oldPlayers));
			
			alert('Aeg otsas, sinu skooriks sai '+ typerGame.player.score);
			window.location.href = "home.html";
			this.size = 100;
        }
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height);

		this.ctx.textAlign = 'center';
		this.ctx.font = this.size+'px Courier';

		for(var i = 0; i < this.letters.length; i++){
            var l = this.letters[i];
			this.ctx.fillStyle = "rgb(0,0,0)";
			this.ctx.fillText(l.letter, l.x, l.y);
		}
	},

	removeFirstLetter: function(){
		this.left = this.left.slice(1);
		this.letters.splice(0, 1);
	}
};
