/**
 * Created by stevenbraham on 31-10-16.
 */
$(function () {
    $('#scroll-up').click(function (e) {
        //catch the click event and force a nice scroll effect
        e.preventDefault();
        //scroll to the header tag in 300 ms
        $('html, body').animate({scrollTop: $("header").offset().top}, 300);
    });
    $('#scroll-down').click(function (e) {
        //catch the click event and force a nice scroll effect
        e.preventDefault();
        //scroll to the header tag in 300 ms
        $('html, body').animate({scrollTop: $("main").offset().top}, 300);
    });
    $('.image-button').click(function () {
        window.location.href = $(this).find("a").attr("href");
    });
})