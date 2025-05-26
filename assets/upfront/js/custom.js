//PORTAL PAGE

function initCustomJS(){
	console.log('Upfront customs running');
	addPortalCustomization();
	addPromos()
}

function addPortalCustomization(){
}

function addPromos(){
	var sPromo = '';
	if ($('.post-template .article-content').length) {
		$.ajax({
	        url: 'https://theupfront.media/assets/upfront/ajax/ajax_standardPromo.htm',
			cache: false
		})
		  .done(function( html ) {
		    $('.article-content p').each(function(index) {
            	if(index == 0){
            		$(this).after(html);
            		console.log('ads initialized');
            	}
            });
		 });
	} else if ($('.home-template').length) {
		$.ajax({
	        url: 'https://theupfront.media/assets/upfront/ajax/ajax_standardPromo.htm',
			cache: false
		})
		.done(function( html ) {
			$('.posts-highlight').each(function(index) {
            	if(index == 0){
            		$(this).after('<section class="upfront-prom-wrapper"><div data-canvas-grid="content">' + html + '</div></section>');
            		console.log('ads initialized');
            	}
            });
		});
	}
}