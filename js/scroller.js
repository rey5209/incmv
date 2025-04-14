
"use strict";
$(window).on('scroll', function() {
    // console.log($(this).scrollTop())

    if ($(this).scrollTop() > 600) {

        $('.return-to-top').fadeIn();

    } else {

        $('.return-to-top').fadeOut();

    }
    
    if ($(this).scrollTop() > 1) {

        $('.logo').fadeIn();

    } 
    else {

        $('.sticky-wrapper').addClass('is-sticky');
        // $('.logo').fadeOut();

    }

});

$('.return-to-top').on('click', function() {

    $('html, body').animate({

        scrollTop: 0

    }, 300);

    return false;

});