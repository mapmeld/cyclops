$(function() {
  if ($(window).width() > 800) {
    var owl = $('.owl-carousel').owlCarousel({
      items: 1,
      loop: false
    });
    $('.prev').click(function() {
      owl.trigger('prev.owl.carousel');
    });
    $('.next').click(function() {
      owl.trigger('next.owl.carousel');
    });
  }
});