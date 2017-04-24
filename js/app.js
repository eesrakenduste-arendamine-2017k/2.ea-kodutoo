window.addEventListener('hashchange', function(){
	console.log('this view\'s id is', window.location.hash.substr(1));
});