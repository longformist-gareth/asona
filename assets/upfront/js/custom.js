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

	   $.ajax({
	        url: 'https://theupfront.media/assets/upfront/ajax/ajax_standardPromo.htm'
	        type: 'GET'
	        data: ''
	        dataType: 'html'
	        success: function(res, status) {
			$('.article-content p').each(function(index) {
            	if(index == 0){
            		$(this).after(res);
            		console.log('ads initialized');
            	}
            });
	        }
	    });
	};
}