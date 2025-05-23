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
	if ($('.article-content').length) {

		$.get("https://theupfront.media/assets/upfront/ajax/ajax_standardPromo.htm", function(data){
            // Display the returned data in browser
			$('.article-content p').each(function(index) {
            	if(index == 0){
            		$(this).after(data);
            		console.log('ads initialized');
            	}
            });
        });
	};
}