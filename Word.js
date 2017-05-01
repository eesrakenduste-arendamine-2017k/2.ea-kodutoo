var flyAway='';
var timeChange=0;
var gameFinished=0;
function Word(word, canvas, ctx){

    this.word = word;
    this.letters = [];
    this.left = this.word;
	this.first = this.left.charAt(0);
    this.WIDTH = window.innerWidth;
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = this.canvas.width/2;
    this.y = this.canvas.height/2;
    this.pos = this.x - this.left.length*40/2;
    this.size = 170;
    this.animSize=170;
    this.alpha=0.51;
    this.newWord=1;
    this.correctDur=0;
    this.gameScore=0;
    this.gameMistakes=0;
    this.gameMistakesCount=0;
    this.gameGuessedWords=0;
    this.gameFinished=0;
    this.gameMistakesNr=0;

    if(timeChange!=1){
        time=1800;
        timeChange=1;
    }

    for(var i = 0; i < this.left.length; i++){
        this.letters.push({
            letter: this.left[i],
            x: this.x,
            y: this.y,
            guessed: false
        });
        this.x = this.x + 40;
    }
}

Word.prototype = {
	Draw: function(){
        this.x = this.canvas.width/2;
        this.pos = this.x - this.left.length*150/2;
		//Tühjendame canvase
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height);
		//animation
        if(this.animSize>0) {
            this.animSize -= 9;
            this.pos-=6;
        }else if(this.animSize<=0){
            this.alpha-=0.1;
        }

        this.ctx.font = this.animSize+'px Courier';
        this.ctx.fillStyle = 'rgba(0,0,139,'+this.alpha+')';
        this.ctx.fillText(flyAway, this.pos, this.canvas.height/2);
		// Canvasele jarelejaanud sona joonistamine
		this.ctx.textAlign = 'center';
		this.ctx.font = '160px Courier';
        this.ctx.fillStyle = 'darkblue';
		// Joonistame sõna, mis on järel / tekst, x, y
		this.ctx.fillText(this.left, this.canvas.width/2, this.canvas.height/2);
        //time on canvas
        time-=1;
        this.showTime= Math.round(time/60); 

        if(this.showTime<=0){
            if(gameFinished==1 && this.gameFinished===0){
                this.gameMistakes=mistakes;
                this.gameScore=typerGame.player.score;
                this.gameFinished=1;
                this.gameMistakesCount=mistakesCount;
                this.gameMistakesNr=mistakesNumber;
                this.gameGuessedWords=typerGame.guessed_words;
            }
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = 'darkblue';
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.font = '400% Courier';
            this.ctx.fillText("out of time!", this.canvas.width/2, this.canvas.height / 10);
            this.ctx.fillText("you scored "+this.gameScore+" points!", this.canvas.width/2, this.canvas.height / 4);
            this.ctx.fillText("number of mistakes: "+this.gameMistakesNr, this.canvas.width/2, this.canvas.height / 2.5);
            this.ctx.fillText("(click screen to exit)", this.canvas.width/2, this.canvas.height / 1.5);
            gameFinished=1;

        }
        else if(this.showTime>0 && this.newWord==1) {
            if(this.correctDur>=10){
                this.newWord=0;
            }
            this.ctx.font = '375% Courier';
            this.ctx.fillStyle = 'darkblue';
            this.ctx.fillText("time left " + this.showTime + " seconds", this.canvas.width / 2, this.canvas.height / 10);
            this.ctx.font = 'bold 400% Courier';
            this.ctx.fillStyle = 'darkgreen';
            this.ctx.fillText("points: " + typerGame.player.score, this.canvas.width / 2, this.canvas.height / 1.05);
            this.correctDur+=1;
        }else if(this.showTime>0 && this.newWord===0) {
            this.ctx.font = '375% Courier';
            this.ctx.fillStyle = 'darkblue'; 
            this.ctx.fillText("time left " + this.showTime + " seconds", this.canvas.width / 2, this.canvas.height / 10);
            this.ctx.fillText("points: " + typerGame.player.score, this.canvas.width / 2, this.canvas.height / 1.05);
        }
	},

	removeFirstLetter: function(){
		// Võtame esimese tähe sõnast maha 
		flyAway=this.left.charAt(0);
		this.left = this.left.slice(1);
        this.animSize=170;
        this.alpha=0.51;
	} 
};