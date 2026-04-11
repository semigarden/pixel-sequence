var fudge = 40;//increase here to push clsoer to top
$(window).load(function(){
  var wh = window.innerHeight;
  var ph = $('#plane').height();
  var bh = $("#buttonContain").height();
  var diff = wh - (ph+bh+fudge); 
  var offsetY = Math.round(diff / 4);
  if (offsetY < 0){
	  offsetY = 0;
  }
  $("#plane").css({"top": offsetY.toString() + "px"});
  $("#gameDiv").css({"top": offsetY.toString() + "px"});
  var totalBottom = $('#plane').height() + $('#plane').offset().top + 10;
  $('#buttonsContain').css({"top":totalBottom + "px","visibility":"visible"});
  
$(window).resize(function(){
  var wh = window.innerHeight;
  var ph = $('#plane').height();
  var bh = $("#buttonContain").height();
  var diff = wh - (ph+bh+fudge);
  var offsetY = Math.round(diff / 4);
  if (offsetY < 0){
	  offsetY = 0;
  }
  $("#plane").css({"top": offsetY.toString() + "px"});
  $("#gameDiv").css({"top": offsetY.toString() + "px"});
  var totalBottom = $('#plane').height() + $('#plane').offset().top + 10;
  $('#buttonsContain').css("top",totalBottom + "px");});
  var NorthButton = document.getElementById('north');
  var EastButton = document.getElementById('east');
  var WestButton = document.getElementById('west');
  var SouthButton = document.getElementById('south');
 });
