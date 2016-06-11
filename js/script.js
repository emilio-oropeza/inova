$(document).ready(function(){
	$("article").inncup();
	$("#portada").height(screenHeight());
	$(window).resize(function(){
		$("#portada").height(screenHeight());
	});
});


function barsDisapear(){
	$("#nav-bar-stats").remove();
	$("#mobile-horizontal-menu").remove();
	$("#top-bar-wrapper").remove();
	$("#mobilemenu").remove();
}
function screenHeight(){
	var height = $(window).height();
	if($(window).width() > 768) {
		height = height - 60;
	}else{
		height = 358;
	}	
	return height;
}
function animateScroll(){
    $('html, body').animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 1500);
    return false;
}
