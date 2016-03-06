"use strict";

window.onload = init;

function init(){
    var searchBtn = document.getElementById("searchBtn");

    searchBtn.onclick = function(){
        $(".searchArea").fadeOut(500);
        $(".resultsArea").fadeIn(500);
    }

}


