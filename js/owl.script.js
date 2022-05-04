$(".owl-carousel").owlCarousel({
	autoplay: true,
	autoplayhoverpause: true,
	autoplaytime: 100,
	items: 4,
	loop: true,
	lazyLoad: true,
	responsive: {
		0: {
			items: 2,
			dots: true
		},
		470 : {
			items: 3,
			dots: true
		},
		800 : {
			items: 5,
			dots: true
		},
		1100 : {
			items: 6,
			dots: true
		}
	}
});