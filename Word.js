var flyAway='';
var timeChange=0;
var gameFinished=0;
// Sõna objekt, millele paneme külge ka funktsioonid
function Word(word, canvas, ctx){

    this.word = word;
    this.letters = [];
    
    // lisaks mis on sõnast järel, mida alguses hakkame hakkima ja pärast joonistame
    // esialgne sõna säilib, nt saab kasutada pärast skoori arvutamisel 

	this.left = this.word;
	this.first = this.left.charAt(0);
    this.WIDTH = window.innerWidth;
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = this.canvas.width/2;
    this.y = this.canvas.height/2;
    this.pos = this.x - this.left.length*40/2;
    this.size = 170;
    this.flypos=this.canvas.height / 2;
    this.animSize=170;
    this.alpha=0.51;
    this.newWord=1;
    this.greenDuration=0;
    this.flyIn=-10;
    this.gameScore=0;
    this.gameMistakes=0;
    this.gameMistakesCount=0;
    this.gameGuessedWords=0;
    this.gameFinished=0;
    this.gameMistakesNr=0;


    if(timeChange!=1){
        time=1000;
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
    console.log(this.letters);
}


Word.prototype = {
	Draw: function(){
        this.x = this.canvas.width/2;
        this.pos = this.x - this.left.length*150/2;

		//Tühjendame canvase
		this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height);

		//animatsioon
        // if(flyAway!='') {
        if(this.animSize>0) {
            this.animSize -= 9;
            this.pos-=6
        }else if(this.animSize<=0){
            this.alpha-=0.1;
        }
            this.ctx.font = 'bold '+this.animSize+'px Courier';
            this.ctx.fillStyle = 'rgba(40,54,78,'+this.alpha+')';
            // Joonistame sõna, mis on järel / tekst, x, y
            // this.canvas.width / 2 - ((this.left.substring(0).length / 2) * 170) ----------x asukohaks
            //width -----------------x asukohaks variant 2
            this.ctx.fillText(flyAway, this.pos, this.canvas.height/2);
            console.log(this.left.substring(0).length);
        //}

		// Canvasele jarelejaanud sona joonistamine
		this.ctx.textAlign = 'center';
		this.ctx.font = 'bold 170px Courier';
        this.ctx.fillStyle = 'maroon';
		// Joonistame sõna, mis on järel / tekst, x, y
		this.ctx.fillText(this.left, this.canvas.width/2, this.canvas.height/2);

		//console.log(flyAway);

        //aja naitamine canvasel
        time-=1;
        this.showTime= Math.round(time/60);

        if(this.showTime<=0){
            if(gameFinished==1 && this.gameFinished==0){
                this.gameMistakes=mistakes;
                this.gameScore=typerGame.player.score;
                this.gameFinished=1;
                this.gameMistakesCount=mistakesCount;
                this.gameMistakesNr=mistakesnr;
                this.gameGuessedWords=typerGame.guessed_words;
            }
            if(this.flyIn<this.canvas.height / 13) {
                this.left = "";
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.font = 'bold 50px Courier';
                this.ctx.fillStyle = 'gray';
                this.ctx.textAlign = "start";
                this.ctx.fillText("Aeg sai otsa!", 10, this.flyIn);
                this.flyIn+=8;
            }if(this.flyIn>=this.canvas.height / 13) {
                this.left = "";
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.font = 'bold 50px Courier';
                this.ctx.fillStyle = 'gray';
                this.ctx.textAlign = "start";
                this.ctx.fillText("Aeg sai otsa!", 10, this.canvas.height / 13);
                this.flyIn+=8;
            }
            if(this.flyIn<this.canvas.height / 5.2) {
                this.ctx.font = 'bold 50px Courier';
                this.ctx.fillStyle = 'gray';
                this.ctx.fillText("Skoor:", 10, this.flyIn);
            }if(this.flyIn>=this.canvas.height / 5.2) {
                this.ctx.font = 'bold 50px Courier';
                this.ctx.fillStyle = 'gray';
                this.ctx.fillText("Skoor:", 10, this.canvas.height / 5.2);
            }
            if(this.flyIn<this.canvas.height / 3.2) {
                this.ctx.font = 'bold 70px Courier';
                this.ctx.fillStyle = 'rgba(128, 0, 0, 0.73)';
                this.ctx.fillText(this.gameScore, 10, this.flyIn);
            }if(this.flyIn>=this.canvas.height / 3.2) {
                this.ctx.font = 'bold 70px Courier';
                this.ctx.fillStyle = 'rgba(128, 0, 0, 0.73)';
                this.ctx.fillText(this.gameScore, 10, this.canvas.height / 3.2);
            }
            // if(this.flyIn<this.canvas.height / 3.2) {
            //     this.ctx.font = 'bold 50px Courier';
            //     this.ctx.fillStyle = 'rgb(192, 192, 192)';
            //     this.ctx.fillText("="+this.gameGuessedWords+"-"+this.gameMistakes+"*"+this.gameMistakesCount, (""+this.gameScore).length*50, this.flyIn);
            // }if(this.flyIn>=this.canvas.height / 3.2) {
            //     this.ctx.font = 'bold 50px Courier';
            //     this.ctx.fillStyle = 'rgb(192, 192, 192)';
            //     this.ctx.fillText("="+this.gameGuessedWords+"+"+this.gameMistakesNr+"+"+this.gameMistakesCount, (""+this.gameScore).length*50, this.canvas.height / 3.2);
            // }
            if(this.flyIn<this.canvas.height / 2.2) {
                this.ctx.font = 'bold 50px Courier';
                this.ctx.fillStyle = 'gray';
                this.ctx.fillText("Mäng kestis 30sekundit", 10, this.flyIn);
            }if(this.flyIn>=this.canvas.height / 2.2) {
                this.ctx.font = 'bold 50px Courier';
                this.ctx.fillStyle = 'gray';
                this.ctx.fillText("Mäng kestis 30sekundit", 10, this.canvas.height / 2.2);
            }
            if(this.flyIn<this.canvas.height / 1.8) {
                this.ctx.font = 'bold 50px Courier';
                this.ctx.fillStyle = 'gray';
                this.ctx.fillText("Vigade arv:", 10, this.flyIn);
            }if(this.flyIn>=this.canvas.height / 1.8) {
                this.ctx.font = 'bold 50px Courier';
                this.ctx.fillStyle = 'gray';
                this.ctx.fillText("Vigade arv:", 10, this.canvas.height / 1.8);
            }
            if(this.flyIn<this.canvas.height / 1.5) {
                this.ctx.font = 'bold 70px Courier';
                this.ctx.fillStyle = 'rgba(128, 0, 0, 0.73)';
                this.ctx.fillText(this.gameMistakesNr, 10, this.flyIn);
            }if(this.flyIn>=this.canvas.height / 1.5) {
                this.ctx.font = 'bold 70px Courier';
                this.ctx.fillStyle = 'rgba(128, 0, 0, 0.73)';
                this.ctx.fillText(this.gameMistakesNr, 10, this.canvas.height / 1.5);
            }
            if(this.flyIn<this.canvas.height / 1.01) {
                this.ctx.font = '30px Courier';
                this.ctx.fillStyle = 'gray';
                this.ctx.textAlign = "center";
                this.ctx.fillText("Jätkamiseks klikka ekraanil", this.canvas.width / 2, this.flyIn);
            }if(this.flyIn>=this.canvas.height / 1.01) {
                this.ctx.font = '30px Courier';
                this.ctx.fillStyle = 'gray';
                this.ctx.textAlign = "center";
                this.ctx.fillText("Jätkamiseks klikka ekraanil", this.canvas.width / 2, this.canvas.height / 1.01);
            }
            gameFinished=1;

        }else if(this.showTime>0 && this.newWord==1) {
            if(this.greenDuration>=30){
                this.newWord=0;
            }
            this.ctx.font = 'bold 50px Courier';
            this.ctx.fillStyle = 'rgba(128, 0, 0, 0.73)';
            // Joonistame sõna, mis on järel / tekst, x, y
            this.ctx.fillText("Aega jäänud: " + this.showTime + " sekundit", this.canvas.width / 2, this.canvas.height / 13);
            this.ctx.font = 'bold 50px Courier';
            this.ctx.fillStyle = 'green';
            this.ctx.fillText("Skoor: " + typerGame.player.score, this.canvas.width / 2, this.canvas.height / 1.01);
            this.greenDuration+=1;
        }else if(this.showTime>0 && this.newWord==0) {
            this.ctx.font = 'bold 50px Courier';
            this.ctx.fillStyle = 'rgba(128, 0, 0, 0.73)';
            // Joonistame sõna, mis on järel / tekst, x, y
            this.ctx.fillText("Aega jäänud: " + this.showTime + " sekundit", this.canvas.width / 2, this.canvas.height / 13);
            this.ctx.fillText("Skoor: " + typerGame.player.score, this.canvas.width / 2, this.canvas.height / 1.01);
        }

	},

	// Võtame sõnast esimese tähe maha
	removeFirstLetter: function(){
		// Võtame esimese tähe sõnast maha
		flyAway=this.left.charAt(0);
		this.left = this.left.slice(1);
		console.log("jarele jaanu sona:"+this.left);
        this.animSize=170;
        this.alpha=0.51;

	}
};
