var menu = (function() {
  'use strict';

  function elementController(){

    $('.element').on('click', function(){

      var $this = $(this),
        height = $this.height(),
        i = $this.index()

      if($this.hasClass('element--active')){
        $this
          .removeClass('element--active')
          .siblings()
            .removeClass('element--closed');
      } else {
        $this
          .addClass('element--active')
          .siblings()
            .addClass('element--closed');
      }
      return false;
    });
  }

  function bindUI(){


    $('.control-menu').on('click', function(){

      $(this)
        .toggleClass('open')
        .toggleClass('close');

      $('.menu')
        .toggleClass('closed');
    });
    elementController();
  }

  function init() {
    bindUI();

  }
  return {
    init:init
  };
}());

$(function(){
  menu.init();
})


//clock

var i = 60;
  setInterval(function() {

  i--;
  if (i < 0) {
    i = 60;
  }

  var $circle = $('.circle_animation');
  var r = 69.85699;
  var c = Math.PI*(r*2);
  console.log('C: ' + c);

  console.log('i: ' + i);
  console.log((60-i)/60);

  var pct = ((60-i)/60)*c;
  console.log('PCT: ' + pct);
         $('.timer').html(i);



  $circle.css({ strokeDashoffset: pct});
}, 1000);
