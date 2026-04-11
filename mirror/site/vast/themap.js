function vast(number){
return "vast" + number.toString();
}
function setImg(img){
var rootContext = "/vast";
var imgpath = rootContext + '/images/' + img + '.png';
var image = new Image();
image.src = imgpath;
image.onload = function() {
$('#plane').append(image);
}}
function nextChecker(sourceImagesObj,home,directionToNewNeighbor,neighborNumber,oppositeDirection,neighborhood,theMap){
var proposedNewNeighbor = vast(neighborNumber);
for (var vnk in theMap){
var vnkNeighbor = theMap[vnk][directionToNewNeighbor];
var vnkOppNeighbor = theMap[vnk][oppositeDirection[directionToNewNeighbor]];
if (vnkNeighbor == proposedNewNeighbor || vnkOppNeighbor == proposedNewNeighbor){
return false;
}}
for (var dir in neighborhood){
if (proposedNewNeighbor == neighborhood[dir]){
return false;
}}
if (proposedNewNeighbor == home){
return false;
} else if (sourceImagesObj[proposedNewNeighbor].indexOf(oppositeDirection[directionToNewNeighbor])<0){
return false;
} else {
return true;
}}
function setStartObj(startImg,sourceImagesObj,oppositeDirection,theMap){
var neighborhood = {}; //init
for (var directionIndexFromStartImg in sourceImagesObj[startImg]){
var direction = sourceImagesObj[startImg][directionIndexFromStartImg];
var output = false;
while (output == false){
var neighborIndex = Math.floor(Math.random() * 238) + 1;
output = nextChecker(sourceImagesObj, startImg, direction, neighborIndex, oppositeDirection, neighborhood, theMap);};
var neighbor = vast(neighborIndex);
neighborhood[direction] = neighbor;}
return neighborhood;}
function makeNeighbor(sourceImagesObj,oldNeighbor,directionToNewNeighbor,oppositeDirection,directionFromOldNeighborToHome,home,neighborhood,theMap){
var output = false; //init
count = 0; //init
while (output == false && count < 30){
var neighborNumber = Math.floor(Math.random() * 238) + 1; //generate 123 part of vast123
output = nextChecker(sourceImagesObj,home, directionToNewNeighbor, neighborNumber, oppositeDirection, neighborhood, theMap); //make sure we can use this vast123
count = count + 1;}
if (count < 30){
count = 0;
var neighbor = vast(neighborNumber); //convert index to vastNum tile
return neighbor;
} else {
return; }}
function addNeighborhoodsToTheMap(theMap,diff,sourceImagesObj,oppositeDirection){
for (vnIndex in diff){
var oldNeighbor = diff[vnIndex];
for (var directionFromOldNeighborToHome in theMap[oldNeighbor]){
var home = theMap[oldNeighbor][directionFromOldNeighborToHome];
if (theMap[home]){ continue; } else {
var neighborhood = {}; //init
for (vastNum in theMap){
for (direction in theMap[vastNum]){
var vastNumAtDirection = theMap[vastNum][direction];
if (home == vastNumAtDirection){
neighborhood[oppositeDirection[direction]] = vastNum;
}}}
var directionsAvailableToHome = sourceImagesObj[home];
for (directionIndex in directionsAvailableToHome){
var directionToNewNeighborFromHome = directionsAvailableToHome[directionIndex];
if (neighborhood[directionToNewNeighborFromHome] == null){
neighbor = makeNeighbor(sourceImagesObj,oldNeighbor,directionToNewNeighborFromHome,oppositeDirection,directionFromOldNeighborToHome,home,neighborhood,theMap);
if (!neighbor){
continue;}
} else { continue; }
neighborhood[directionToNewNeighborFromHome] = neighbor;
if (theMap[neighbor]){
if (theMap[neighbor][oppositeDirection[directionToNewNeighborFromHome]] == null){
theMap[neighbor][oppositeDirection[directionToNewNeighborFromHome]] = home;
}}}
theMap[home] = neighborhood;
}}}
return theMap;
}
function loadButtons(vastImg){
var vastImgDirsObj = Vast.theMap[vastImg];
vastImgDirs = Object.keys(vastImgDirsObj);
if (Vast.theMap[vastImg]["n"]){
$('#north').css('visibility','visible');
} else {
$('#north').css('visibility','hidden');}
if (Vast.theMap[vastImg]["s"]){
$('#south').css('visibility','visible');
} else {
$('#south').css('visibility','hidden');}
if (Vast.theMap[vastImg]["e"]){
$('#east').css('visibility','visible');
} else {
$('#east').css('visibility','hidden');}
if (Vast.theMap[vastImg]["w"]){
$('#west').css('visibility','visible');
} else {
$('#west').css('visibility','hidden');
}}
function loadImg(directionTo){
directionFrom = Vast.oppositeDirection[directionTo];
var currentImg = $('#plane').children("img").prop('src');
var myRe = /vast\d{1,}/;
var result = myRe.exec(currentImg);
var currentImg = result[0];
$('#plane').empty();
if (Vast.theMap[currentImg] != null){
newImg = Vast.theMap[currentImg][directionTo];
setImg(newImg);
setTimeout(function(){
loadButtons(newImg);
},100)}}
var Vast = {};
$(document).ready(function(){
var sourceImagesObj = (function() {
var sourceImagesObj = null;
$.ajax({
'async': false,
'global': false,
'url': "images.json",
'dataType': "json",
'success': function (data) {
json = data;
}});
return json;
})();
var oppositeDirection = {
"n":"s",
"s":"n",
"e":"w",
"w":"e"}
Vast.oppositeDirection = oppositeDirection;
var theMap = {};
var startImgIndex = Math.floor(Math.random() * 238) + 1;
startImg = vast(startImgIndex);
function maketheMap(sourceImagesObj, oppositeDirection, startImg){
setImg(startImg);
var a = Object.keys(theMap);
var neighborhood = {};
neighborhood = setStartObj(startImg,sourceImagesObj,oppositeDirection,theMap);
theMap[startImg] = neighborhood;
var diff = Object.keys(theMap)
//console.log(theMap);
while (diff[0]){
a = Object.keys(theMap);
theMap = addNeighborhoodsToTheMap(theMap,diff,sourceImagesObj,oppositeDirection);
var diff = Object.keys(theMap).filter(function(x) { return a.indexOf(x) < 0});}
return theMap
}
/*setImg(startImg);
var a = Object.keys(theMap);
var neighborhood = {};
neighborhood = setStartObj(startImg,sourceImagesObj,oppositeDirection,theMap);
theMap[startImg] = neighborhood;
var diff = Object.keys(theMap)
console.log(theMap);
while (diff[0]){
a = Object.keys(theMap);
theMap = addNeighborhoodsToTheMap(theMap,diff,sourceImagesObj,oppositeDirection);
var diff = Object.keys(theMap).filter(function(x) { return a.indexOf(x) < 0});}*/
while (Object.keys(theMap).length < 5 || Object.keys(theMap).length == null){
theMap = maketheMap(sourceImagesObj, oppositeDirection, startImg);
console.log(theMap);
}
Vast.theMap = theMap;
setTimeout(function(){
loadButtons(startImg);
},2000);
});
