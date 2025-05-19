//PORTAL PAGE

function initCustomJS(){
	console.log('Upfront customs running')
}

function addPortalCustomization(){
	var sLaunchOffer = '<div class="gh-portal-products-grid custom-grid">
	<div class="gh-portal-product-card" data-test-tier="paid" style="margin-top: 16px; background: #DCDAE2">
	    <div class="gh-portal-product-card-header">
	        <h4 class="gh-portal-product-name">Launch offer: Five Year Pro Subscription</h4>
	        <div class="gh-portal-product-card-pricecontainer">
	            <div class="gh-portal-offer-oldprice" style="margin-top: 0;">£999.95</div>
	            <div class="gh-portal-product-card-pricecontainer" style="margin-top: 0;">
	                <div class="gh-portal-product-price"><span class="currency-sign">£</span><span class="amount">499.95</span></div>
	            </div>
	        </div>
	        <p class="footnote" style="margin-bottom: 0;">50% off for five years.</p>
	    </div>
	    <div class="gh-portal-product-card-details">
	        <div class="gh-portal-product-card-detaildata">
	            <div class="gh-portal-product-description" data-testid="product-description">As our version of investor seed funding, we're offering five years of Pro at 50% off for a limited time.</div>
	        </div>
	        <div class="gh-portal-btn-product" style="padding-top: 16px;"><a href="" class="gh-portal-btn">Choose launch offer</a></div>
	    </div>
	</div>
</div>';


	//at the end




	$('.gh-portal-products').append(sLaunchOffer);
}