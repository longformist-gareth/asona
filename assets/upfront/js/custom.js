//PORTAL PAGE

function initCustomJS(){
	console.log('Upfront customs running');
	addPortalCustomization();
	//addPromos()
	flipAdvertSize();
}

function addPortalCustomization(){
}

function flipAdvertSize(){
	console.log('resizing ad...');
	if ($('.post-template .article-content').length) {
		if($('article.article').hasClass('tag-no-ads')){
			console.log('no auto ads');
			//do nothing
		} else {
			console.log('show ads');
			var width = $(window).width();
			console.log(width);
			if (width >= 900){
				$('#prom').attr('src', $('.upfront-prom').data('wide'));
			}
		}
	}
}

function addPromos(){
	var sPromo = '';
	if ($('.post-template .article-content').length) {
		if($('article.article').hasClass('tag-no-ads')){
			//do nothing
		} else {
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
		}
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
