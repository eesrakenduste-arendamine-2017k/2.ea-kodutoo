var totalTypos;
var totalWordsGuessed;

window.onload = function(){
	totalWordsGuessed = JSON.parse(localStorage.getItem('totalWordsGuessed'));
	if(totalWordsGuessed == null){
		document.getElementById("totalWordsGuessed").innerHTML = 0;
	}else{
		document.getElementById("totalWordsGuessed").innerHTML = totalWordsGuessed;
	}
	totalTypos = JSON.parse(localStorage.getItem('totalTypos'));
	if(totalTypos == null){
		document.getElementById("totalTypos").innerHTML = 0;
	}else{
	document.getElementById("totalTypos").innerHTML = totalTypos;
	}
}